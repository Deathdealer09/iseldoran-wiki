#!/usr/bin/env node
/*
 * Post the next queued Iseldoran Sagas item from content/x-posts.md to X,
 * then mark it as posted in the file.
 *
 * Queue format (see content/x-posts.md):
 *   [ ] **3. Continuity, not land**
 *   > "The empire is not land. It is continuity." — Isolde...
 *   > Second blockquote line, joined with a newline.
 *
 * The tweet text is the blockquote block (lines beginning with "> ") that
 * immediately follows the first unchecked `[ ]` item. On success the `[ ]`
 * is flipped to `[x]` and an ISO timestamp is appended to the header line.
 *
 * Usage:
 *   node scripts/x-post-next.mjs              # post next + mark posted
 *   node scripts/x-post-next.mjs --dry-run    # show what would post, no send, no edit
 *   node scripts/x-post-next.mjs --peek       # just print the next item, do nothing
 *
 * Exit codes: 0 ok (or nothing queued) · 2 no credentials · 1 error
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { postTweet } from "./x-post.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const QUEUE = path.join(__dirname, "..", "content", "x-posts.md");

/**
 * Find the first unchecked `[ ]` item and its blockquote body.
 * @param {string[]} lines  file split on "\n"
 * @returns {{index:number, header:string, text:string}|null}
 */
export function parseNext(lines) {
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\[ \]\s+\*\*(.+?)\*\*/);
    if (!m) continue;
    const header = m[1];
    const body = [];
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (l.trim() === "") {
        j++;
        // Allow a single blank line inside a block, but stop at the next item/heading.
        if (j < lines.length && /^(\[[ x]\]|#|---)/.test(lines[j])) break;
        continue;
      }
      const bm = l.match(/^>\s?(.*)$/);
      if (!bm) break;
      body.push(bm[1]);
      j++;
    }
    return { index: i, header, text: body.join("\n").trim() };
  }
  return null;
}

/**
 * Flip a queue line from `[ ]` to `[x]` and stamp the header.
 * @returns {string} the rewritten line
 */
export function markPostedLine(line, stamp) {
  return line.replace(/^\[ \]/, "[x]").replace(/\*\*\s*$/, `** — posted ${stamp}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const peek = args.includes("--peek");

  if (!fs.existsSync(QUEUE)) {
    console.error(`Queue not found: ${QUEUE}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(QUEUE, "utf8");
  const lines = raw.split("\n");
  const next = parseNext(lines);

  if (!next) {
    console.log(
      "Nothing queued — every item is marked posted. Add more to content/x-posts.md."
    );
    process.exit(0);
  }

  console.log(
    `Next: "${next.header}" (${[...next.text].length} chars)\n---\n${next.text}\n---`
  );

  if (peek) process.exit(0);

  try {
    await postTweet(next.text, { dryRun });
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(e.code === "NO_CREDS" ? 2 : 1);
  }

  if (dryRun) {
    console.log("[dry-run] queue not modified.");
    process.exit(0);
  }

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + "Z";
  lines[next.index] = markPostedLine(lines[next.index], stamp);
  fs.writeFileSync(QUEUE, lines.join("\n"));
  console.log(`Marked posted in queue (${stamp}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
