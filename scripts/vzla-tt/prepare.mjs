#!/usr/bin/env node
/*
 * Turn raw collected comments into a codebook-shaped master dataset.
 *
 * Collection in the field captures only what a person can realistically see and
 * copy: platform, date, who wrote it, the text, the link. This script does the
 * mechanical rest — anonymisation, stable comment and commenter identifiers,
 * and the full 23-column layout — leaving only the interpretive coding for a
 * human, which is where human judgement is actually required.
 *
 * Anonymisation: the author label is passed through HMAC-SHA256 with a secret
 * salt and truncated. The same person always yields the same hash, so distinct
 * commenters can be counted, but the hash cannot be reversed to a username by
 * anyone holding the dataset without the salt. The salt lives in .vzla-salt
 * (gitignored, generated on first run) and must never be committed or shared
 * alongside the data.
 *
 * Raw input CSV needs at least: Platform, Comment, Author_Label
 * Optional: Date, Source_URL, Engagement, and any codebook column already coded.
 *
 * Usage:
 *   node scripts/vzla-tt/prepare.mjs raw.csv --out dataset.csv
 *   node scripts/vzla-tt/prepare.mjs raw.csv --out dataset.csv --append
 *
 * Exit codes: 0 ok · 1 error
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseCsv, toCsv } from "./csv.mjs";
import { COLUMNS, PLATFORMS } from "./codebook.mjs";

const SALT_FILE = ".vzla-salt";

/** Load the anonymisation salt, generating one on first run. */
function loadSalt() {
  if (process.env.VZLA_SALT) return process.env.VZLA_SALT;
  if (fs.existsSync(SALT_FILE)) return fs.readFileSync(SALT_FILE, "utf8").trim();
  const salt = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(SALT_FILE, salt + "\n", { mode: 0o600 });
  console.error(
    `note: generated a new anonymisation salt at ${SALT_FILE} (mode 600).\n` +
      `      Keep it out of version control and out of any shared dataset.\n` +
      `      Losing it means commenter hashes can no longer be matched across batches.`,
  );
  return salt;
}

/** One-way, salted, stable identifier for an author label. */
function hashAuthor(label, salt) {
  return crypto
    .createHmac("sha256", salt)
    .update(label.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
}

/**
 * Sequential comment id that stays stable across appends by continuing from the
 * highest id already present in the output file.
 */
function nextIdFactory(existingRows) {
  let max = 0;
  for (const r of existingRows) {
    const m = /^C(\d+)$/.exec(r.Anonymous_ID || "");
    if (m) max = Math.max(max, Number(m[1]));
  }
  return () => `C${String(++max).padStart(5, "0")}`;
}

/** Defaults for coding columns a human has not filled in yet. */
const CODING_DEFAULTS = {
  Language: "",
  First_Hand: "",
  Theme: "",
  Subtheme: "",
  Trinidad_Sentiment: "",
  Venezuela_Sentiment: "",
  Preference: "",
  Reason: "",
  Gender: "unspecified",
  Age_Group: "unknown",
  Family_Status: "unknown",
  Time_In_Trinidad: "unknown",
  Employment_Context: "unknown",
  Trinidad_Location: "",
  Venezuela_Location: "",
  Confidence: "",
};

function main() {
  const args = process.argv.slice(2);
  let out = null;
  let append = false;
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out") out = args[++i];
    else if (args[i] === "--append") append = true;
    else if (args[i].startsWith("--")) {
      console.error(`error: unknown option ${args[i]}`);
      process.exit(1);
    } else positional.push(args[i]);
  }
  const input = positional[0];

  if (!input || !out) {
    console.error("usage: node scripts/vzla-tt/prepare.mjs <raw.csv> --out <dataset.csv> [--append]");
    process.exit(1);
  }
  if (!fs.existsSync(input)) {
    console.error(`error: raw file not found: ${input}`);
    process.exit(1);
  }

  const { header, rows } = parseCsv(fs.readFileSync(input, "utf8"));
  for (const need of ["Platform", "Comment", "Author_Label"]) {
    if (!header.includes(need)) {
      console.error(`error: raw file is missing the ${need} column`);
      process.exit(1);
    }
  }

  let existing = [];
  if (append && fs.existsSync(out)) {
    existing = parseCsv(fs.readFileSync(out, "utf8")).rows;
  }

  const salt = loadSalt();
  const nextId = nextIdFactory(existing);
  const seen = new Set(
    existing.map((r) => `${r.Commenter_Hash}::${(r.Comment || "").trim().toLowerCase()}`),
  );

  const prepared = [];
  let skippedDupes = 0;
  let skippedEmpty = 0;
  const badPlatforms = new Set();

  for (const raw of rows) {
    const comment = (raw.Comment || "").trim();
    const author = (raw.Author_Label || "").trim();
    if (!comment || !author) {
      skippedEmpty++;
      continue;
    }
    if (!PLATFORMS.includes(raw.Platform)) badPlatforms.add(raw.Platform);

    const hash = hashAuthor(author, salt);
    const key = `${hash}::${comment.toLowerCase()}`;
    if (seen.has(key)) {
      skippedDupes++;
      continue;
    }
    seen.add(key);

    const row = { ...CODING_DEFAULTS };
    for (const col of COLUMNS) if (raw[col] !== undefined && raw[col] !== "") row[col] = raw[col];
    row.Platform = raw.Platform || "";
    row.Date = raw.Date || "";
    row.Comment = comment;
    row.Engagement = raw.Engagement || "";
    row.Source_URL = raw.Source_URL || "";
    row.Anonymous_ID = nextId();
    row.Commenter_Hash = hash;
    prepared.push(row);
  }

  const all = append ? [...existing, ...prepared] : prepared;
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, toCsv(COLUMNS, all));

  console.log(
    `prepared ${prepared.length} new rows (${skippedDupes} duplicates, ${skippedEmpty} incomplete skipped)`,
  );
  console.log(`dataset now holds ${all.length} rows across ${new Set(all.map((r) => r.Commenter_Hash)).size} commenters`);
  if (badPlatforms.size) {
    console.error(
      `warning: unrecognised Platform values: ${[...badPlatforms].join(", ")} (expected ${PLATFORMS.join(", ")})`,
    );
  }
  console.log(`next: code the blank columns, then run analyze.mjs`);
}

main();
