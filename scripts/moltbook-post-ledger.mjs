#!/usr/bin/env node
/*
 * Post the next queued Cassian's Ledger fragment to a Moltbook submolt,
 * solving the verification challenge with the conservative solver. Same
 * pattern as moltbook-post-next.mjs (the Black Death saga poster), generalized
 * for an open-ended fragment queue instead of a fixed 50-part numbered saga.
 *
 * Cassian's Ledger is a SEPARATE, openly-disclosed companion persona to
 * Kaizar — its own agent identity, its own human owner, its own verified X
 * account (Moltbook allows one bot per verified X account, so it cannot share
 * Kaizar's). Its bio discloses the connection to Kaizar/Iseldoran Sagas
 * directly; it does not pretend to be an independent third party, and its job
 * is not to reply under Kaizar's own posts — see docs/social-automation.md.
 *
 * Queue: content/cassians-ledger.md (override via $CL_QUEUE). Items look like:
 *   [ ] **CL 03**
 *   > <fragment text>
 *
 * Cadence gate: refuses to post if the most recent "posted to m/<submolt>
 * <UTC>" marker in the queue is newer than $CL_GATE_MIN minutes (default 35).
 *
 * Verification: same conservative solver as the saga poster — never guesses
 * (10 failures auto-suspends the account).
 *
 * Auth: $LEDGER_MOLTBOOK_API_KEY or ~/.config/moltbook/credentials-ledger.json
 * — deliberately separate names from Kaizar's $MOLTBOOK_API_KEY /
 * credentials.json so the two identities can never cross-authenticate by
 * accident. The key is sent ONLY to www.moltbook.com.
 *
 * Not yet configured (no key at all) exits 0 quietly — this script is
 * committed ahead of the agent actually being registered/claimed, so a
 * workflow running it before setup is complete should not show a failure.
 *
 * Exit: 0 ok / skipped / gated / pending / not-yet-configured · 1 error
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";
import { solveChallenge } from "./moltbook-solve.mjs";
import { DISCUSSION_PROMPTS } from "./moltbook-post-next.mjs";

const API = "https://www.moltbook.com/api/v1";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const QUEUE = process.env.CL_QUEUE
  ? path.resolve(process.env.CL_QUEUE)
  : path.join(__dirname, "..", "content", "cassians-ledger.md");
const SUBMOLT = process.env.CL_SUBMOLT || "iseldoran";
const GATE_MIN = Number(process.env.CL_GATE_MIN || "35");
const ITEM_PREFIX = "CL";

function loadKey() {
  if (process.env.LEDGER_MOLTBOOK_API_KEY) return process.env.LEDGER_MOLTBOOK_API_KEY;
  const f = path.join(os.homedir(), ".config", "moltbook", "credentials-ledger.json");
  if (fs.existsSync(f)) {
    try { return JSON.parse(fs.readFileSync(f, "utf8")).api_key; } catch { /* ignore */ }
  }
  return null;
}

/** Find the first unchecked `[ ] **CL..**` item and its blockquote body. */
export function parseNext(lines) {
  const re = new RegExp(`^\\[ \\]\\s+\\*\\*${ITEM_PREFIX}`);
  for (let i = 0; i < lines.length; i++) {
    if (!re.test(lines[i])) continue;
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

export function minutesSinceLastPost(raw) {
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

/** Best-effort discussion-prompt reply on our own just-published post. Never throws. */
async function selfReply(key, postId) {
  try {
    const prompt = DISCUSSION_PROMPTS[Math.floor(Math.random() * DISCUSSION_PROMPTS.length)];
    const created = await mb("POST", `/posts/${postId}/comments`, key, { content: prompt });
    if (!created.json.success) {
      console.log("Self-reply skipped (create failed):", JSON.stringify(created.json).slice(0, 150));
      return;
    }
    const v = created.json.comment?.verification || created.json.verification;
    if (v) {
      const sol = solveChallenge(v.challenge_text);
      if (!sol) { console.log("Self-reply left unverified (challenge unsure)."); return; }
      const ver = await mb("POST", "/verify", key, { verification_code: v.verification_code, answer: sol.answer });
      if (!ver.json.success) { console.log("Self-reply left unverified (verify rejected)."); return; }
    }
    console.log("Self-reply posted ✅");
  } catch (e) {
    console.log("Self-reply skipped (error):", e.message);
  }
}

async function main() {
  const key = loadKey();
  if (!key) {
    console.log("Cassian's Ledger not yet configured (no LEDGER_MOLTBOOK_API_KEY / credentials-ledger.json). Skipping quietly.");
    process.exit(0);
  }
  if (!fs.existsSync(QUEUE)) { console.error(`Queue not found: ${QUEUE}`); process.exit(1); }

  const raw = fs.readFileSync(QUEUE, "utf8");
  const sinceMin = minutesSinceLastPost(raw);
  if (sinceMin < GATE_MIN) {
    console.log(`Gate: last post ${sinceMin.toFixed(0)}m ago (<${GATE_MIN}m). Skipping.`);
    process.exit(0);
  }

  const lines = raw.split("\n");
  const next = parseNext(lines);
  if (!next) { console.log("Ledger queue empty — add more fragments to keep it going."); process.exit(0); }

  const n = (lines[next.index].match(new RegExp(`${ITEM_PREFIX}\\s*(\\d+)`)) || [])[1] || "?";
  const title = `Cassian's Ledger — Fragment ${n}`;
  console.log(`Posting ${title} (${[...next.text].length} chars) to m/${SUBMOLT}...`);

  const created = await mb("POST", "/posts", key, { submolt_name: SUBMOLT, title, content: next.text });
  if (created.status === 429) { console.log("Rate limited (429). Skipping."); process.exit(0); }
  if (!created.json.success) { console.error("Post failed:", JSON.stringify(created.json).slice(0, 300)); process.exit(1); }

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + "Z";
  const v = created.json.post?.verification || created.json.verification;

  if (v) {
    const sol = solveChallenge(v.challenge_text);
    if (!sol) {
      console.log(`UNSURE of challenge; leaving pending (code ${v.verification_code}).`);
      lines[next.index] = lines[next.index].replace(/^\[ \]/, "[~]").replace(/\*\*\s*$/, `** — pending verify ${v.verification_code} (${stamp})`);
      fs.writeFileSync(QUEUE, lines.join("\n"));
      process.exit(0);
    }
    const ver = await mb("POST", "/verify", key, { verification_code: v.verification_code, answer: sol.answer });
    if (!ver.json.success) {
      console.error("Verify rejected:", JSON.stringify(ver.json).slice(0, 200));
      lines[next.index] = lines[next.index].replace(/^\[ \]/, "[~]").replace(/\*\*\s*$/, `** — verify failed ${v.verification_code} (${stamp})`);
      fs.writeFileSync(QUEUE, lines.join("\n"));
      process.exit(1);
    }
    console.log(`Solved & verified (${sol.a} ${sol.op} ${sol.b} = ${sol.answer}).`);
  }

  lines[next.index] = lines[next.index].replace(/^\[ \]/, "[x]").replace(/\*\*\s*$/, `** — posted to m/${SUBMOLT} ${stamp}`);
  fs.writeFileSync(QUEUE, lines.join("\n"));
  console.log(`Published ${title} ✅`);

  if (created.json.post?.id) await selfReply(key, created.json.post.id);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
