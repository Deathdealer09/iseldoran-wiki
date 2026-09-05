#!/usr/bin/env node
/*
 * Discover Iseldoran-adjacent discussions on Moltbook via semantic search and
 * engage genuinely: upvote posts that actually match, and follow their authors.
 *
 * Deliberately does NOT generate comment text. A static script has no way to
 * write a comment that actually responds to what a post says — a templated
 * "great post!" dropped across strangers' threads on a timer is comment-spam,
 * not engagement, regardless of intent. Genuine commentary needs real judgment
 * (see docs/social-automation.md's "Trigger A" — a live Claude session, not a
 * script). This script sticks to the two actions that are honest without a
 * language model in the loop: upvoting and following, both of which Moltbook's
 * own docs explicitly encourage as good citizenship.
 *
 * State: content/moltbook-engaged.json — post IDs already engaged with, so
 * repeat runs don't re-upvote/re-follow the same thing. Committed like the
 * saga queue file.
 *
 * Auth: $MOLTBOOK_API_KEY or ~/.config/moltbook/credentials.json. The key is
 * sent ONLY to www.moltbook.com.
 *
 * Exit: 0 always for normal outcomes (best-effort; never blocks the schedule)
 * · 2 no key
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const API = "https://www.moltbook.com/api/v1";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const STATE_FILE = process.env.MB_ENGAGED_STATE
  ? path.resolve(process.env.MB_ENGAGED_STATE)
  : path.join(__dirname, "..", "content", "moltbook-engaged.json");
const MAX_NEW_ENGAGEMENTS = Number(process.env.MB_MAX_ENGAGE || "2");
// The live API returns a `relevance` field (small, non-normalized, already
// rank-ordered — NOT the 0-1 `similarity` the docs example shows), so we trust
// the API's own ordering and take the top N candidates rather than threshold
// on an undocumented scale. `similarity` is still checked first in case a
// future API version sends it.
const MAX_CANDIDATES = Number(process.env.MB_MAX_CANDIDATES || "10");
const CRYPTO_PATTERN = /\$[A-Z]{2,10}\b|cryptocurrency|crypto[- ]?coin|token launch|airdrop|presale|to the moon/i;

// Rotated by the hour so consecutive runs surface different corners of the
// platform rather than hammering the same query.
export const QUERIES = [
  "epic worldbuilding and fictional empires",
  "space opera politics and war",
  "dynastic succession and political intrigue in fiction",
  "military science fiction storytelling",
  "worldbuilding lore and canon consistency",
  "stories about empires and the burden of rulership",
];

function loadKey() {
  if (process.env.MOLTBOOK_API_KEY) return process.env.MOLTBOOK_API_KEY;
  const f = path.join(os.homedir(), ".config", "moltbook", "credentials.json");
  if (fs.existsSync(f)) {
    try { return JSON.parse(fs.readFileSync(f, "utf8")).api_key; } catch { /* ignore */ }
  }
  return null;
}

export function loadState(file = STATE_FILE) {
  if (!fs.existsSync(file)) return { engaged: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return { engaged: parsed.engaged || {} };
  } catch {
    return { engaged: {} };
  }
}

export function saveState(state, file = STATE_FILE) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");
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

  const me = await mb("GET", "/agents/me", key);
  const myName = me.json?.agent?.name;

  const state = loadState();

  const query = QUERIES[Math.floor(Date.now() / 3600000) % QUERIES.length];
  console.log(`Searching: "${query}"`);
  const search = await mb("GET", `/search?q=${encodeURIComponent(query)}&type=posts&limit=20`, key);
  if (search.status === 429) { console.log("Rate limited (429). Skipping this run."); process.exit(0); }
  const results = search.json?.results || [];

  const candidates = results
    .filter((r) =>
      r.type === "post" &&
      r.author?.name && r.author.name !== myName &&
      !state.engaged[r.id] &&
      !CRYPTO_PATTERN.test(`${r.title || ""} ${r.content || ""}`)
    )
    .slice(0, MAX_CANDIDATES);

  if (!candidates.length) {
    console.log("No new matching posts this run.");
    process.exit(0);
  }

  let engaged = 0;
  for (const post of candidates) {
    if (engaged >= MAX_NEW_ENGAGEMENTS) break;
    const label = post.title || (post.content || "").slice(0, 60);
    const score = post.similarity ?? post.relevance;
    console.log(`Engaging: "${label}" by ${post.author.name}${typeof score === "number" ? ` (score ${score.toFixed(4)})` : ""}`);

    const up = await mb("POST", `/posts/${post.id}/upvote`, key);
    if (up.status === 429) { console.log("Rate limited (429). Stopping this run."); break; }
    if (!up.json?.success) {
      console.log("Upvote failed, skipping:", JSON.stringify(up.json).slice(0, 150));
      continue;
    }

    if (up.json.already_following === false) {
      const f = await mb("POST", `/agents/${encodeURIComponent(post.author.name)}/follow`, key);
      console.log(f.json?.success ? `Followed ${post.author.name}` : `Follow skipped: ${JSON.stringify(f.json).slice(0, 100)}`);
    }

    state.engaged[post.id] = { title: post.title || null, author: post.author.name, at: new Date().toISOString() };
    engaged++;
  }

  saveState(state);
  console.log(`Done. Engaged with ${engaged} new post(s).`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
