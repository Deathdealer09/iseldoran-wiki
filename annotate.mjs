#!/usr/bin/env node
/*
 * Stage 2 : annotation.
 * Takes the clean Stage 1 figures in out/figures and composites the bestiary
 * annotation onto the reserved empty space: plate title, data block
 * (classification / homeworld / scale), physical notes, a vertical scale ruler,
 * and the Imperial seal. Produces finished plates in out/plates.
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { SPECIES, parseSelection, pad } from "./species.mjs";

const CONFIG = {
  figuresDir: "out/figures",
  platesDir: "out/plates",
  // Annotation lives in the empty left band; the figure sits on the right.
  textX: 56,
  textWidth: 360,
  font: "Georgia, 'Times New Roman', 'DejaVu Serif', serif",
  ink: "#2b2b2b",
  faint: "#6f6f6f",
  gold: "#9a7b34",
  notesWrap: 30,
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Greedy word-wrap to a max character width. */
function wrap(text, max) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if (line && (line + " " + w).length > max) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + " " + w : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** A labelled data block: bold header in tracked caps, then value line(s). */
function dataBlock(x, y, header, valueLines, lineH = 26) {
  const parts = [
    `<text x="${x}" y="${y}" font-family="${CONFIG.font}" font-size="17" ` +
      `letter-spacing="2" font-weight="bold" fill="${CONFIG.ink}">${esc(
        header.toUpperCase()
      )}</text>`,
  ];
  let vy = y + 27;
  for (const line of valueLines) {
    parts.push(
      `<text x="${x}" y="${vy}" font-family="${CONFIG.font}" font-size="20" ` +
        `fill="${CONFIG.faint}">${esc(line)}</text>`
    );
    vy += lineH;
  }
  return { svg: parts.join(""), bottom: vy };
}

/** Vertical scale ruler down the right edge, ticked in metres. */
function scaleRuler(species, W, H) {
  const max = species.rulerMax || 3.0;
  const step = max <= 2 ? 0.5 : 1.0;
  const axisX = W - 70;
  const top = 150;
  const bottom = H - 96;
  const yFor = (v) => bottom - (v / max) * (bottom - top);

  const parts = [
    `<line x1="${axisX}" y1="${top - 12}" x2="${axisX}" y2="${bottom}" ` +
      `stroke="${CONFIG.faint}" stroke-width="2"/>`,
  ];
  for (let v = 0; v <= max + 1e-9; v += step) {
    const y = yFor(v);
    parts.push(
      `<line x1="${axisX}" y1="${y}" x2="${axisX + 14}" y2="${y}" ` +
        `stroke="${CONFIG.faint}" stroke-width="2"/>`
    );
    parts.push(
      `<text x="${axisX + 22}" y="${y + 6}" font-family="${CONFIG.font}" ` +
        `font-size="18" fill="${CONFIG.faint}">${v.toFixed(1)} m</text>`
    );
  }
  return parts.join("");
}

/** Stylized circular Imperial seal (double-headed eagle) bottom-left. */
function seal(cx, cy, r) {
  const eagle =
    `<g transform="translate(${cx} ${cy}) scale(${r / 50})" fill="${CONFIG.gold}">` +
    // body
    `<path d="M0,-2 L8,-20 L3,-6 L14,-14 L6,0 L20,-2 L6,6 L16,14 ` +
    `L4,7 L7,22 L0,10 L-7,22 L-4,7 L-16,14 L-6,6 L-20,-2 L-6,0 ` +
    `L-14,-14 L-3,-6 L-8,-20 Z"/>` +
    `<circle cx="0" cy="-2" r="3"/>` +
    `</g>`;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ` +
      `stroke="${CONFIG.gold}" stroke-width="2.5"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="none" ` +
      `stroke="${CONFIG.gold}" stroke-width="1"/>` +
    eagle
  );
}

function buildOverlay(species, key, W, H) {
  const x = CONFIG.textX;
  const plateNo = String(key).padStart(2, "0");
  const metricLabel = species.metricLabel || "Average Height";

  const head = [
    `<text x="${x}" y="92" font-family="${CONFIG.font}" font-size="44" ` +
      `fill="${CONFIG.ink}">${esc(plateNo)}. ${esc(species.name.toUpperCase())}</text>`,
    `<text x="${x}" y="124" font-family="${CONFIG.font}" font-size="19" ` +
      `letter-spacing="4" fill="${CONFIG.faint}">ISELDORAN UNIVERSE</text>`,
  ];

  const blocks = [];
  let y = 188;
  for (const b of [
    { header: "Classification", lines: [species.classification] },
    { header: "Homeworld", lines: [species.homeworld] },
    { header: metricLabel, lines: [species.metric] },
    { header: "Physical Notes", lines: wrap(species.notes, CONFIG.notesWrap) },
  ]) {
    const blk = dataBlock(x, y, b.header, b.lines);
    blocks.push(blk.svg);
    y = blk.bottom + 18;
  }

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      head.join("") +
      blocks.join("") +
      scaleRuler(species, W, H) +
      seal(x + 38, H - 70, 36) +
      `</svg>`
  );
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function run(arg = process.argv[2]) {
  const keys = parseSelection(arg);
  if (!keys || !keys.length) {
    console.error("Error: No valid species selected or matching indices found.");
    process.exit(1);
  }

  await mkdir(CONFIG.platesDir, { recursive: true });
  console.log(`Stage 2: annotating ${keys.length} figures.\n`);

  const results = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const species = SPECIES[key];
    const label = `[${i + 1}/${keys.length}] ${species?.name ?? key}`;

    if (!species) {
      console.error(`Skipping invalid species key: ${key}`);
      results.push({ key, ok: false, error: "Key not found in SPECIES config." });
      continue;
    }

    const figurePath = join(CONFIG.figuresDir, `${pad(key)}.png`);
    if (!(await exists(figurePath))) {
      console.error(`${label}: missing figure ${figurePath} (run generate.mjs first)`);
      results.push({ key, ok: false, error: `Missing figure: ${figurePath}` });
      continue;
    }

    console.log(`${label}: annotating...`);
    try {
      const base = sharp(await readFile(figurePath));
      const { width, height } = await base.metadata();
      const overlay = buildOverlay(species, key, width, height);
      const out = join(CONFIG.platesDir, `${pad(key)}.png`);
      await base.composite([{ input: overlay, top: 0, left: 0 }]).png().toFile(out);
      console.log(`Saved: ${out}\n`);
      results.push({ key, ok: true, file: out });
    } catch (err) {
      console.error(`FAILED: ${err.message}\n`);
      results.push({ key, ok: false, error: err.message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`Stage 2 done. ${ok}/${results.length} plates annotated.`);
  return results;
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFilePath === process.argv[1]) {
  run().catch((err) => {
    console.error(`Fatal Runtime Error: ${err.message}`);
    process.exit(1);
  });
}
