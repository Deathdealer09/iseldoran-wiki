#!/usr/bin/env node
/*
 * Stage 1 : figure generation.
 * Generates one clean specimen per species on parchment, subject placed toward
 * the right with the left side left empty. NO ruler, NO seal, NO text.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout } from "node:timers/promises";
import { SPECIES, parseSelection, pad } from "./species.mjs";

const CONFIG = {
  model: "gpt-image-1", // Ensure this matches your specific endpoint proxy or custom mapping
  size: "1024x1536",
  quality: "high",
  figuresDir: "out/figures",
  delayMs: 1500,
  maxRetries: 3,
};

function buildPrompt(species) {
  return [
    `Full-body xenobiology specimen illustration of one ${species.name}.`,
    species.descriptor,
    "Single specimen only, front-facing, neutral anatomical reference pose.",
    "Entire body visible from head to feet, no cropping.",
    "Subject positioned toward the right side of the frame.",
    "Large area of empty plain parchment on the left side and clear margins, reserved for annotation.",
    "No text, no labels, no ruler, no seal, no border, nothing written anywhere.",
    "Plain pale grey parchment background, uniform and clean.",
    "Hyperrealistic digital concept art, fine anatomical detail, natural coloration.",
    "Cinematic soft studio lighting, muted desaturated palette.",
    "Sharp focus, painterly realism, portrait 2:3 framing.",
  ].join(" ");
}

async function generateImage(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CONFIG.model,
      prompt,
      size: CONFIG.size,
      n: 1,
      quality: CONFIG.quality,
      response_format: "b64_json", // Forces API to send raw data instead of a URL
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${body.slice(0, 700)}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No b64_json image returned.");
  return Buffer.from(b64, "base64");
}

async function withRetry(fn, label) {
  let lastErr;
  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`Attempt ${attempt} failed for ${label}: ${err.message}`);
      if (attempt < CONFIG.maxRetries) {
        await setTimeout(attempt * 2000);
      }
    }
  }
  throw new Error(`${label} failed: ${lastErr.message}`);
}

export async function run(arg = process.argv[2]) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: Missing OPENAI_API_KEY environment variable.");
    process.exit(1);
  }

  const keys = parseSelection(arg);
  if (!keys || !keys.length) {
    console.error("Error: No valid species selected or matching indices found.");
    process.exit(1);
  }

  await mkdir(CONFIG.figuresDir, { recursive: true });
  console.log(`Stage 1: generating ${keys.length} figures.\n`);

  const results = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const species = SPECIES[key];

    if (!species) {
      console.error(`Skipping invalid species key: ${key}`);
      results.push({ key, ok: false, error: "Key not found in SPECIES config." });
      continue;
    }

    const label = `[${i + 1}/${keys.length}] ${species.name}`;
    console.log(`${label}: generating...`);

    try {
      const bytes = await withRetry(() => generateImage(buildPrompt(species)), label);
      const file = join(CONFIG.figuresDir, `${pad(key)}.png`);
      await writeFile(file, bytes);
      console.log(`Saved: ${file}\n`);
      results.push({ key, ok: true, file });
    } catch (err) {
      console.error(`FAILED: ${err.message}\n`);
      results.push({ key, ok: false, error: err.message });
    }

    if (i < keys.length - 1) {
      await setTimeout(CONFIG.delayMs);
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`Stage 1 done. ${ok}/${results.length} figures generated.`);
  return results;
}

// Fixed line-ending safe check for execution context
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFilePath === process.argv[1]) {
  run().catch((err) => {
    console.error(`Fatal Runtime Error: ${err.message}`);
    process.exit(1);
  });
}
