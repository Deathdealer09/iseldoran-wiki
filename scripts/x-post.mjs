#!/usr/bin/env node
/*
 * Post a single tweet to X (Twitter) via API v2 `POST /2/tweets`.
 *
 * Auth: OAuth 1.0a user context (HMAC-SHA1), signed with Node's built-in
 * crypto — no external dependencies.
 *
 * Credentials resolution order (first hit wins):
 *   1. Environment variables:
 *        X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *   2. JSON file at $X_CREDENTIALS or ~/.config/iseldoran-x/credentials.json:
 *        { "api_key": "...", "api_secret": "...",
 *          "access_token": "...", "access_secret": "..." }
 *
 * SECURITY: credentials are ONLY ever sent to api.twitter.com. Never commit the
 * credentials file (it lives under ~/.config by default, outside the repo).
 *
 * Usage:
 *   node scripts/x-post.mjs "Tweet text here"
 *   node scripts/x-post.mjs --dry-run "Tweet text here"   # sign + validate, do not send
 *   echo "Tweet text" | node scripts/x-post.mjs --stdin
 *
 * Exit codes: 0 success/dry-run · 2 no credentials · 3 bad input · 1 API error
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ENDPOINT = "https://api.twitter.com/2/tweets";
const TWEET_LIMIT = 280; // standard limit; X Premium allows more (warn, don't block)

export function loadCredentials() {
  const env = {
    api_key: process.env.X_API_KEY,
    api_secret: process.env.X_API_SECRET,
    access_token: process.env.X_ACCESS_TOKEN,
    access_secret: process.env.X_ACCESS_SECRET,
  };
  if (env.api_key && env.api_secret && env.access_token && env.access_secret) {
    return env;
  }
  const file =
    process.env.X_CREDENTIALS ||
    path.join(os.homedir(), ".config", "iseldoran-x", "credentials.json");
  if (fs.existsSync(file)) {
    try {
      const j = JSON.parse(fs.readFileSync(file, "utf8"));
      const c = {
        api_key: j.api_key || j.consumer_key,
        api_secret: j.api_secret || j.consumer_secret,
        access_token: j.access_token,
        access_secret: j.access_secret || j.access_token_secret,
      };
      if (c.api_key && c.api_secret && c.access_token && c.access_secret) return c;
    } catch (e) {
      throw new Error(`Could not parse credentials file ${file}: ${e.message}`);
    }
  }
  return null;
}

const enc = (s) =>
  encodeURIComponent(s).replace(
    /[!*'()]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );

function authHeader(method, url, creds) {
  // For X API v2 with a JSON body, only the oauth_* params are signed.
  const oauth = {
    oauth_consumer_key: creds.api_key,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.access_token,
    oauth_version: "1.0",
  };
  const paramString = Object.keys(oauth)
    .sort()
    .map((k) => `${enc(k)}=${enc(oauth[k])}`)
    .join("&");
  const base = [method.toUpperCase(), enc(url), enc(paramString)].join("&");
  const signingKey = `${enc(creds.api_secret)}&${enc(creds.access_secret)}`;
  oauth.oauth_signature = crypto
    .createHmac("sha1", signingKey)
    .update(base)
    .digest("base64");
  return (
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${enc(k)}="${enc(oauth[k])}"`)
      .join(", ")
  );
}

export async function postTweet(text, { dryRun = false } = {}) {
  const creds = loadCredentials();
  if (!creds) {
    const err = new Error(
      "No X credentials. Set X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / " +
        "X_ACCESS_SECRET, or create ~/.config/iseldoran-x/credentials.json. " +
        "See scripts/x-setup.md."
    );
    err.code = "NO_CREDS";
    throw err;
  }
  if (!text || !text.trim()) {
    const err = new Error("Refusing to post empty tweet text.");
    err.code = "BAD_INPUT";
    throw err;
  }
  if ([...text].length > TWEET_LIMIT) {
    console.warn(
      `!! Warning: ${[...text].length} chars (> ${TWEET_LIMIT}). ` +
        "Requires X Premium or it will be rejected."
    );
  }
  if (dryRun) {
    // Exercise the signing path so a dry run validates credentials shape.
    authHeader("POST", ENDPOINT, creds);
    console.log("[dry-run] would post:\n" + text);
    return { dryRun: true };
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authHeader("POST", ENDPOINT, creds),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  const bodyText = await res.text();
  if (!res.ok) {
    const err = new Error(`X API ${res.status}: ${bodyText}`);
    err.code = "API_ERROR";
    err.status = res.status;
    throw err;
  }
  return JSON.parse(bodyText);
}

// --- CLI ---------------------------------------------------------------------
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const useStdin = args.includes("--stdin");
  let text;
  if (useStdin) {
    text = fs.readFileSync(0, "utf8").trim();
  } else {
    text = args.filter((a) => !a.startsWith("--")).join(" ");
  }
  try {
    const out = await postTweet(text, { dryRun });
    if (!dryRun) {
      const id = out?.data?.id;
      console.log(`Posted ✅  id=${id}  https://x.com/i/web/status/${id}`);
    }
    process.exit(0);
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(e.code === "NO_CREDS" ? 2 : e.code === "BAD_INPUT" ? 3 : 1);
  }
}
