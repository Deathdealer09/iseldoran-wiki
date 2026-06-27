#!/usr/bin/env node
/*
 * Zero-dependency linter for this repo.
 *
 * npm dependencies cannot be installed in the web environment (the network
 * policy blocks the registry), so instead of ESLint this uses only Node
 * built-ins:
 *   - `node --check` for parse/syntax validation of every JS/MJS source file
 *   - objective hygiene checks: trailing whitespace, CRLF endings, tab indent,
 *     leftover `debugger;`
 *
 * Scope: real source modules only. Generated/vendored/JSX files are excluded
 * (the compiled bundle is minified; .jsx isn't plain ESM).
 *
 * Usage:  node scripts/lint.mjs        (exit 0 clean, 1 on any finding)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");

const EXCLUDE_DIRS = new Set(["node_modules", ".git", "vendor", "out", "assets"]);
const EXCLUDE_FILES = new Set(["IseldoranSagasWiki.compiled.js"]);
const INCLUDE_EXT = new Set([".mjs", ".js"]);

function collect(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".claude") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) collect(full, acc);
    } else if (
      INCLUDE_EXT.has(path.extname(entry.name)) &&
      !EXCLUDE_FILES.has(entry.name)
    ) {
      acc.push(full);
    }
  }
  return acc;
}

const files = collect(root).sort();
const problems = [];

for (const file of files) {
  const rel = path.relative(root, file);

  // 1. Syntax / parse check.
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (e) {
    const msg = (e.stderr?.toString() || e.message).split("\n").slice(0, 4).join("\n");
    problems.push(`${rel}: syntax error\n${msg}`);
    continue; // a file that won't parse can't be hygiene-checked meaningfully
  }

  // 2. Hygiene checks.
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/\r$/.test(line)) problems.push(`${rel}:${n}: CRLF line ending`);
    if (/[ \t]+$/.test(line)) problems.push(`${rel}:${n}: trailing whitespace`);
    if (/^\t/.test(line)) problems.push(`${rel}:${n}: tab indentation (use spaces)`);
    if (/(^|\s)debugger\s*;?\s*$/.test(line))
      problems.push(`${rel}:${n}: leftover \`debugger\` statement`);
  });
}

if (problems.length) {
  console.error(`✖ ${problems.length} lint problem(s) in ${files.length} file(s):\n`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`✓ lint clean — ${files.length} source file(s) checked.`);
