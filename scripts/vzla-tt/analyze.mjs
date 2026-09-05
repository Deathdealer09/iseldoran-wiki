#!/usr/bin/env node
/*
 * Analysis pipeline for the "Venezuelans in Trinidad" social listening study.
 *
 * Reads a coded master dataset (CSV, schema in scripts/vzla-tt/codebook.mjs),
 * validates it, removes duplicates, and computes every statistic the research
 * brief calls for: theme frequencies, six-point sentiment distributions,
 * Trinidad-versus-Venezuela comparisons, destination preference, and
 * demographic cross-tabs.
 *
 * Two rules are enforced rather than left to the analyst:
 *
 *   1. Nothing is invented. Every number traces to rows in the input. An empty
 *      input yields an empty report, not an estimate.
 *   2. Percentages carry their denominator, and a demographic cell below the
 *      reporting threshold gets counts only, flagged, never a percentage.
 *
 * Theme frequency is ranked by DISTINCT COMMENTERS first and comment volume
 * second, so one prolific commenter cannot manufacture a finding.
 *
 * Usage:
 *   node scripts/vzla-tt/analyze.mjs <dataset.csv> [--out DIR] [--strict]
 *
 * Outputs (into --out, default research/venezuelans-trinidad/output):
 *   analysis.json    machine-readable, drives the infographic
 *   findings.md      human-readable tables
 *   qc-report.txt    validation errors, warnings, open-coded themes
 *
 * Exit codes: 0 ok · 1 error · 3 validation failed under --strict
 */
import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv.mjs";
import {
  COLUMNS,
  SENTIMENT,
  SENTIMENT_WEIGHT,
  PREFERENCE,
  MIN_CELL_FOR_PERCENT,
  validateRow,
} from "./codebook.mjs";

const POSITIVE = new Set(["strongly_positive", "positive"]);
const NEGATIVE = new Set(["strongly_negative", "negative"]);

/** Normalise comment text for duplicate detection. */
function normalise(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Count occurrences into a Map. */
function tally(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

/**
 * Percentage that refuses to report on thin cells.
 * @returns {{n:number, pct:number|null, below_threshold:boolean}}
 */
function rate(count, denom) {
  if (!denom) return { n: count, pct: null, below_threshold: true };
  const below = denom < MIN_CELL_FOR_PERCENT;
  return {
    n: count,
    pct: below ? null : Math.round((count / denom) * 1000) / 10,
    below_threshold: below,
  };
}

/** Distribution over the six-point scale plus a mean of the scored points. */
function sentimentProfile(rows, column) {
  const dist = Object.fromEntries(SENTIMENT.map((s) => [s, 0]));
  let sum = 0;
  let scored = 0;
  for (const r of rows) {
    const v = r[column];
    if (!v || !(v in dist)) continue;
    dist[v]++;
    if (v in SENTIMENT_WEIGHT) {
      sum += SENTIMENT_WEIGHT[v];
      scored++;
    }
  }
  const expressed = Object.entries(dist)
    .filter(([k]) => k !== "not_expressed")
    .reduce((a, [, v]) => a + v, 0);
  return {
    distribution: dist,
    n_expressed: expressed,
    mean: scored ? Math.round((sum / scored) * 100) / 100 : null,
    shares: Object.fromEntries(
      SENTIMENT.filter((s) => s !== "not_expressed").map((s) => [
        s,
        rate(dist[s], expressed),
      ]),
    ),
  };
}

/**
 * Rank themes by distinct commenters, then by comment volume.
 * @param {Record<string,string>[]} rows
 * @param {number} denomCommenters denominator for share, 0 disables percentages
 */
function themeTable(rows, denomCommenters) {
  const commenters = new Map();
  const comments = new Map();
  for (const r of rows) {
    if (!r.Theme) continue;
    tally(comments, r.Theme);
    if (!commenters.has(r.Theme)) commenters.set(r.Theme, new Set());
    commenters.get(r.Theme).add(r.Commenter_Hash);
  }
  return [...comments.keys()]
    .map((theme) => ({
      theme,
      commenters: commenters.get(theme).size,
      comments: comments.get(theme),
      share_of_commenters: rate(commenters.get(theme).size, denomCommenters),
    }))
    .sort((a, b) => b.commenters - a.commenters || b.comments - a.comments);
}

/** Distinct commenters in a row set. */
function uniqueCommenters(rows) {
  return new Set(rows.map((r) => r.Commenter_Hash)).size;
}

/**
 * Resolve each commenter to a single destination preference.
 * Multiple comments from one person are collapsed to their most frequent
 * stated preference; a genuine tie is excluded and reported rather than
 * broken arbitrarily.
 */
function preferenceByCommenter(rows) {
  const byPerson = new Map();
  for (const r of rows) {
    // A preference is a statement of the commenter's own intention, so
    // second-hand reports are not eligible.
    if (r.First_Hand !== "first_hand") continue;
    if (!r.Preference || r.Preference === "not_expressed") continue;
    if (!byPerson.has(r.Commenter_Hash)) byPerson.set(r.Commenter_Hash, new Map());
    tally(byPerson.get(r.Commenter_Hash), r.Preference);
  }
  const counts = Object.fromEntries(
    PREFERENCE.filter((p) => p !== "not_expressed").map((p) => [p, 0]),
  );
  let conflicting = 0;
  for (const [, prefs] of byPerson) {
    const ranked = [...prefs.entries()].sort((a, b) => b[1] - a[1]);
    if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) {
      conflicting++;
      continue;
    }
    counts[ranked[0][0]]++;
  }
  const denom = Object.values(counts).reduce((a, b) => a + b, 0);
  return {
    n_commenters_expressing: denom,
    conflicting_excluded: conflicting,
    counts,
    shares: Object.fromEntries(
      Object.entries(counts).map(([k, v]) => [k, rate(v, denom)]),
    ),
  };
}

/** Cross-tab one demographic column against themes and Trinidad sentiment. */
function crossTab(rows, column) {
  const groups = new Map();
  for (const r of rows) {
    const g = r[column] || "unknown";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(r);
  }
  const out = {};
  for (const [group, groupRows] of groups) {
    const n = uniqueCommenters(groupRows);
    out[group] = {
      commenters: n,
      comments: groupRows.length,
      below_reporting_threshold: n < MIN_CELL_FOR_PERCENT,
      top_themes: themeTable(groupRows, n).slice(0, 8),
      trinidad_sentiment: sentimentProfile(groupRows, "Trinidad_Sentiment"),
      venezuela_sentiment: sentimentProfile(groupRows, "Venezuela_Sentiment"),
      preference: preferenceByCommenter(groupRows),
    };
  }
  return out;
}

/**
 * Pick quotation candidates: first-hand, confidently coded, one per leading
 * theme, mid-length. Selection is by theme coverage, never by how striking the
 * comment is.
 */
function quoteCandidates(rows, themes, limit = 10) {
  const picked = [];
  for (const { theme } of themes) {
    if (picked.length >= limit) break;
    const pool = rows
      .filter(
        (r) =>
          r.Theme === theme &&
          r.First_Hand === "first_hand" &&
          r.Confidence === "high" &&
          r.Comment.length >= 40 &&
          r.Comment.length <= 320,
      )
      .sort((a, b) => a.Comment.length - b.Comment.length);
    if (!pool.length) continue;
    const pick = pool[Math.floor(pool.length / 2)];
    picked.push({
      theme,
      anonymous_id: pick.Anonymous_ID,
      language: pick.Language,
      comment: pick.Comment,
      trinidad_sentiment: pick.Trinidad_Sentiment,
      venezuela_sentiment: pick.Venezuela_Sentiment,
      source_url_internal: pick.Source_URL,
    });
  }
  return picked;
}

function main() {
  const args = process.argv.slice(2);
  let strict = false;
  let outDir = "research/venezuelans-trinidad/output";
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--strict") strict = true;
    else if (args[i] === "--out") outDir = args[++i] ?? outDir;
    else if (args[i].startsWith("--")) {
      console.error(`error: unknown option ${args[i]}`);
      process.exit(1);
    } else positional.push(args[i]);
  }
  const input = positional[0];

  if (!input) {
    console.error("usage: node scripts/vzla-tt/analyze.mjs <dataset.csv> [--out DIR] [--strict]");
    process.exit(1);
  }
  if (!fs.existsSync(input)) {
    console.error(`error: dataset not found: ${input}`);
    process.exit(1);
  }

  const { header, rows, lineNos } = parseCsv(fs.readFileSync(input, "utf8"));

  const missingCols = COLUMNS.filter((c) => !header.includes(c));
  if (missingCols.length) {
    console.error(`error: dataset is missing columns: ${missingCols.join(", ")}`);
    process.exit(1);
  }

  /* -- Validation and quality control ----------------------------------- */
  const errors = [];
  const warnings = [];
  const newThemes = new Set();
  rows.forEach((r, i) => {
    const v = validateRow(r, lineNos[i]);
    errors.push(...v.errors);
    warnings.push(...v.warnings);
    v.newThemes.forEach((t) => newThemes.add(t));
  });

  const seen = new Map();
  const duplicates = [];
  const clean = [];
  for (const r of rows) {
    const key = `${r.Commenter_Hash}::${normalise(r.Comment)}`;
    if (!r.Comment || !normalise(r.Comment)) continue;
    if (seen.has(key)) {
      duplicates.push(r.Anonymous_ID);
      continue;
    }
    seen.set(key, true);
    clean.push(r);
  }

  if (errors.length && strict) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "qc-report.txt"), errors.join("\n") + "\n");
    console.error(`validation failed: ${errors.length} error(s). See ${outDir}/qc-report.txt`);
    process.exit(3);
  }

  /* -- Sample description ------------------------------------------------ */
  const totalCommenters = uniqueCommenters(clean);
  const byPlatform = {};
  for (const p of new Set(clean.map((r) => r.Platform))) {
    const sub = clean.filter((r) => r.Platform === p);
    byPlatform[p] = { comments: sub.length, commenters: uniqueCommenters(sub) };
  }
  const dates = clean.map((r) => r.Date).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();

  const firstHand = clean.filter((r) => r.First_Hand === "first_hand");
  const languages = {};
  for (const r of clean) {
    const key = r.Language || "unknown";
    languages[key] = (languages[key] || 0) + 1;
  }

  /* -- Core analysis ----------------------------------------------------- */
  const themes = themeTable(clean, totalCommenters);

  const ttPositiveRows = clean.filter((r) => POSITIVE.has(r.Trinidad_Sentiment));
  const ttNegativeRows = clean.filter((r) => NEGATIVE.has(r.Trinidad_Sentiment));
  const vePositiveRows = clean.filter((r) => POSITIVE.has(r.Venezuela_Sentiment));

  const analysis = {
    meta: {
      generated_utc: new Date().toISOString(),
      dataset: path.basename(input),
      pipeline: "scripts/vzla-tt/analyze.mjs",
      note:
        "OBSERVED DATA. Every figure is computed from the input dataset. " +
        "No value is estimated, imputed or modelled.",
    },
    sample: {
      rows_in_file: rows.length,
      duplicates_removed: duplicates.length,
      comments_analysed: clean.length,
      unique_commenters: totalCommenters,
      by_platform: byPlatform,
      date_range: dates.length ? { first: dates[0], last: dates[dates.length - 1] } : null,
      first_hand: {
        comments: firstHand.length,
        commenters: uniqueCommenters(firstHand),
        share: rate(firstHand.length, clean.length),
      },
      languages,
      target_vs_actual: {
        target_comments: 5000,
        actual_comments: clean.length,
        shortfall: Math.max(0, 5000 - clean.length),
      },
    },
    themes_top20: themes.slice(0, 20),
    themes_all: themes,
    sentiment: {
      toward_trinidad: sentimentProfile(clean, "Trinidad_Sentiment"),
      toward_venezuela: sentimentProfile(clean, "Venezuela_Sentiment"),
    },
    trinidad_advantages: themeTable(ttPositiveRows, uniqueCommenters(ttPositiveRows)).slice(0, 12),
    trinidad_complaints: themeTable(ttNegativeRows, uniqueCommenters(ttNegativeRows)).slice(0, 12),
    missed_about_venezuela: themeTable(vePositiveRows, uniqueCommenters(vePositiveRows)).slice(0, 12),
    destination_preference: preferenceByCommenter(clean),
    crosstabs: {
      gender: crossTab(clean, "Gender"),
      age_group: crossTab(clean, "Age_Group"),
      time_in_trinidad: crossTab(clean, "Time_In_Trinidad"),
      family_status: crossTab(clean, "Family_Status"),
      employment_context: crossTab(clean, "Employment_Context"),
    },
    quotations: quoteCandidates(clean, themes),
    quality_control: {
      validation_errors: errors,
      warnings,
      open_coded_themes: [...newThemes],
      reporting_threshold: MIN_CELL_FOR_PERCENT,
    },
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "analysis.json"), JSON.stringify(analysis, null, 2));
  fs.writeFileSync(path.join(outDir, "findings.md"), renderMarkdown(analysis));
  fs.writeFileSync(
    path.join(outDir, "qc-report.txt"),
    [
      `errors: ${errors.length}`,
      ...errors,
      ``,
      `warnings: ${warnings.length}`,
      ...warnings,
      ``,
      `open-coded themes: ${[...newThemes].join(", ") || "(none)"}`,
    ].join("\n") + "\n",
  );

  console.log(
    `analysed ${clean.length} comments from ${totalCommenters} commenters ` +
      `(${duplicates.length} duplicates removed, ${errors.length} errors, ${warnings.length} warnings)`,
  );
  console.log(`wrote ${outDir}/analysis.json, findings.md, qc-report.txt`);
}

/** Render the headline tables as markdown. */
function renderMarkdown(a) {
  const pct = (r) =>
    r.pct === null ? `n=${r.n} (below threshold)` : `${r.pct}% (n=${r.n})`;
  const L = [];
  L.push(`# Venezuelans in Trinidad — Findings`);
  L.push(``);
  L.push(`Generated ${a.meta.generated_utc} from \`${a.meta.dataset}\`.`);
  L.push(``);
  L.push(`> ${a.meta.note}`);
  L.push(``);
  L.push(`## Sample`);
  L.push(``);
  L.push(`| Measure | Value |`);
  L.push(`|---|---|`);
  L.push(`| Comments analysed | ${a.sample.comments_analysed} |`);
  L.push(`| Unique commenters | ${a.sample.unique_commenters} |`);
  L.push(`| Duplicates removed | ${a.sample.duplicates_removed} |`);
  L.push(`| First-hand comments | ${a.sample.first_hand.comments} |`);
  L.push(
    `| Date range | ${a.sample.date_range ? `${a.sample.date_range.first} to ${a.sample.date_range.last}` : "none recorded"} |`,
  );
  L.push(`| Target vs actual | ${a.sample.target_vs_actual.actual_comments} of ${a.sample.target_vs_actual.target_comments} |`);
  L.push(``);
  for (const [p, v] of Object.entries(a.sample.by_platform)) {
    L.push(`- ${p}: ${v.comments} comments, ${v.commenters} commenters`);
  }
  L.push(``);
  L.push(`## Top themes`);
  L.push(``);
  L.push(`Ranked by distinct commenters, so a single prolific account cannot create a theme.`);
  L.push(``);
  L.push(`| # | Theme | Commenters | Comments | Share of commenters |`);
  L.push(`|---|---|---|---|---|`);
  a.themes_top20.forEach((t, i) =>
    L.push(`| ${i + 1} | ${t.theme} | ${t.commenters} | ${t.comments} | ${pct(t.share_of_commenters)} |`),
  );
  L.push(``);
  const section = (title, note, table) => {
    L.push(`## ${title}`);
    L.push(``);
    if (note) { L.push(note); L.push(``); }
    L.push(`| Theme | Commenters | Share |`);
    L.push(`|---|---|---|`);
    table.forEach((t) => L.push(`| ${t.theme} | ${t.commenters} | ${pct(t.share_of_commenters)} |`));
    L.push(``);
  };
  section("Biggest advantages of Trinidad", "Among commenters expressing positive sentiment toward Trinidad.", a.trinidad_advantages);
  section("Biggest complaints about Trinidad", "Among commenters expressing negative sentiment toward Trinidad.", a.trinidad_complaints);
  section("What they miss about Venezuela", "Among commenters expressing positive sentiment toward Venezuela.", a.missed_about_venezuela);

  L.push(`## Stay or leave`);
  L.push(``);
  const p = a.destination_preference;
  L.push(`Among ${p.n_commenters_expressing} commenters who stated a first-hand preference (${p.conflicting_excluded} excluded for stating conflicting preferences).`);
  L.push(``);
  L.push(`| Destination | Commenters | Share |`);
  L.push(`|---|---|---|`);
  for (const [k, v] of Object.entries(p.shares)) L.push(`| ${k} | ${v.n} | ${pct(v)} |`);
  L.push(``);
  L.push(`## Sentiment`);
  L.push(``);
  for (const [label, key] of [["Toward Trinidad", "toward_trinidad"], ["Toward Venezuela", "toward_venezuela"]]) {
    const s = a.sentiment[key];
    L.push(`### ${label}`);
    L.push(``);
    L.push(`Mean score ${s.mean === null ? "n/a" : s.mean} on a -2 to +2 scale, ${s.n_expressed} comments expressing a view.`);
    L.push(``);
    L.push(`| Level | Comments | Share |`);
    L.push(`|---|---|---|`);
    for (const [k, v] of Object.entries(s.shares)) L.push(`| ${k} | ${v.n} | ${pct(v)} |`);
    L.push(``);
  }
  L.push(`## Quality control`);
  L.push(``);
  L.push(`- Validation errors: ${a.quality_control.validation_errors.length}`);
  L.push(`- Warnings: ${a.quality_control.warnings.length}`);
  L.push(`- Open-coded themes: ${a.quality_control.open_coded_themes.join(", ") || "none"}`);
  L.push(`- Demographic reporting threshold: ${a.quality_control.reporting_threshold} commenters`);
  L.push(``);
  return L.join("\n");
}

main();
