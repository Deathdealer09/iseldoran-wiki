#!/usr/bin/env node
/*
 * Post the next queued saga part to a Moltbook submolt (default m/iseldoran),
 * solving the verification challenge with the conservative solver.
 *
 * Queue: content/black-death-saga.md (override via $MB_QUEUE). Items look like:
 *   [ ] **BD 02**
 *   > The Black Death — 2/50
 *   >
 *   > <body...>
 *
 * Cadence gate: refuses to post if the most recent "posted to m/iseldoran
 * <UTC>" marker in the queue is newer than $MB_GATE_MIN minutes (default 35) —
 * keeps us safely above Moltbook's 1-post/30-min limit.
 *
 * Verification: if the challenge can't be solved confidently, the post (already
 * created, pending) is marked `[~] ... pending verify <code>` and we exit 0 —
 * we NEVER submit a guess (10 failures auto-suspends the account).
 *
 * Auth: $MOLTBOOK_API_KEY or ~/.config/moltbook/credentials.json. The key is
 * sent ONLY to www.moltbook.com.
 *
 * Exit: 0 ok / skipped / gated / pending · 2 no key · 1 error
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";
import { solveChallenge } from "./moltbook-solve.mjs";

const API = "https://www.moltbook.com/api/v1";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const QUEUE = process.env.MB_QUEUE
  ? path.resolve(process.env.MB_QUEUE)
  : path.join(__dirname, "..", "content", "black-death-saga.md");
const SUBMOLT = process.env.MB_SUBMOLT || "iseldoran";
const GATE_MIN = Number(process.env.MB_GATE_MIN || "35");

function loadKey() {
  if (process.env.MOLTBOOK_API_KEY) return process.env.MOLTBOOK_API_KEY;
  const f = path.join(os.homedir(), ".config", "moltbook", "credentials.json");
  if (fs.existsSync(f)) {
    try { return JSON.parse(fs.readFileSync(f, "utf8")).api_key; } catch { /* ignore */ }
  }
  return null;
}

/** Find the first unchecked `[ ] **BD..**` item and its blockquote body. */
function parseNext(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (!/^\[ \]\s+\*\*BD/.test(lines[i])) continue;
    const body = [];
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (l.trim() === "") { j++; if (j < lines.length && /^(\[[ x~]\]|#|---)/.test(lines[j])) break; continue; }
      const bm = l.match(/^>\s?(.*)$/);
      if (!bm) break;
      body.push(bm[1]); j++;
    }
    return { index: i, text: body.join("\n").trim() };
  }
  return null;
}

function minutesSinceLastPost(raw) {
  const stamps = [...raw.matchAll(/posted to m\/\S+ (\d{4}-\d{2}-\d{2} \d{2}:\d{2})Z/g)].map((m) => Date.parse(m[1] + "Z"));
  if (!stamps.length) return Infinity;
  return (Date.now() - Math.max(...stamps)) / 60000;
}

async function mb(method, endpoint, key, body) {
  const res = await fetch(API + endpoint, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

async function main() {
  const key = loadKey();
  if (!key) { console.error("No MOLTBOOK_API_KEY / credentials.json"); process.exit(2); }
  if (!fs.existsSync(QUEUE)) { console.error(`Queue not found: ${QUEUE}`); process.exit(1); }

  const raw = fs.readFileSync(QUEUE, "utf8");
  const sinceMin = minutesSinceLastPost(raw);
  if (sinceMin < GATE_MIN) {
    console.log(`Gate: last post ${sinceMin.toFixed(0)}m ago (<${GATE_MIN}m). Skipping.`);
    process.exit(0);
  }

  const lines = raw.split("\n");
  const next = parseNext(lines);
  if (!next) { console.log("Saga complete — nothing queued."); process.exit(0); }

  const n = (next.text.match(/(\d+)\/50/) || [])[1] || "?";
  const title = `The Black Death — ${n}/50`;
  console.log(`Posting ${title} (${[...next.text].length} chars) to m/${SUBMOLT}...`);

  const created = await mb("POST", "/posts", key, { submolt_name: SUBMOLT, title, content: next.text });
  if (created.status === 429) { console.log("Rate limited (429). Skipping."); process.exit(0); }
  if (!created.json.success) { console.error("Post failed:", JSON.stringify(created.json).slice(0, 300)); process.exit(1); }

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + "Z";
  const v = created.json.post?.verification || created.json.verification;

  if (v) {
    const sol = solveChallenge(v.challenge_text);
    if (!sol) {
      // Cannot solve confidently — never guess. Mark pending so we don't re-post.
      console.log(`UNSURE of challenge; leaving pending (code ${v.verification_code}).`);
      lines[next.index] = lines[next.index].replace(/^\[ \]/, "[~]").replace(/\*\*\s*$/, `** — pending verify ${v.verification_code} (${stamp})`);
      fs.writeFileSync(QUEUE, lines.join("\n"));
      process.exit(0);
    }
    const ver = await mb("POST", "/verify", key, { verification_code: v.verification_code, answer: sol.answer });
    if (!ver.json.success) {
      console.error("Verify rejected:", JSON.stringify(ver.json).slice(0, 200));
      // Mark pending rather than retry-spam (protects against suspension).
      lines[next.index] = lines[next.index].replace(/^\[ \]/, "[~]").replace(/\*\*\s*$/, `** — verify failed ${v.verification_code} (${stamp})`);
      fs.writeFileSync(QUEUE, lines.join("\n"));
      process.exit(1);
    }
    console.log(`Solved & verified (${sol.a} ${sol.op} ${sol.b} = ${sol.answer}).`);
  }

  lines[next.index] = lines[next.index].replace(/^\[ \]/, "[x]").replace(/\*\*\s*$/, `** — posted to m/${SUBMOLT} ${stamp}`);
  fs.writeFileSync(QUEUE, lines.join("\n"));
  console.log(`Published ${title} ✅`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
export { parseNext, minutesSinceLastPost };
