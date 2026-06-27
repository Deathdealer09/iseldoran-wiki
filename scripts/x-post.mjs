#!/usr/bin/env node
/*
 * Post a single tweet to X (Twitter) via API v2 `POST /2/tweets`, with optional
 * image attachments.
 *
 * Auth: OAuth 1.0a user context (HMAC-SHA1), signed with Node's built-in
 * crypto — no external dependencies.
 *
 * Credentials resolution order (first hit wins):
 *   1. Environment variables:
 *        X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *   2. JSON file at $X_CREDENTIALS or ~/.config/iseldoran-x/credentials.json:
 *        { "api_key", "api_secret", "access_token", "access_secret" }
 *
 * PROXY NOTE (Claude Code on the web): Node's built-in fetch ignores
 * HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 is set, and the proxy re-terminates
 * TLS so NODE_EXTRA_CA_CERTS must point at the CA bundle. Always invoke via the
 * wrappers (social-tick.sh / x-post-next.mjs are run with these set) or export:
 *     NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
 *
 * SECURITY: credentials are ONLY ever sent to api.twitter.com / upload.twitter.com.
 *
 * Usage:
 *   node scripts/x-post.mjs "Tweet text here"
 *   node scripts/x-post.mjs --image assets/bestiary/001.jpg "Text with an image"
 *   node scripts/x-post.mjs --dry-run "Validate signing, do not send"
 *
 * Exit codes: 0 success/dry-run · 2 no credentials · 3 bad input · 1 API error
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const TWEETS_ENDPOINT = "https://api.twitter.com/2/tweets";
const MEDIA_ENDPOINT = "https://upload.twitter.com/1.1/media/upload.json";
const TWEET_LIMIT = 280; // standard limit; X Premium allows more (warn, don't block)
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // X still image limit

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

// OAuth 1.0a header. `extraParams` are signed too (used for form-encoded posts);
// JSON / multipart bodies are NOT signed, so callers pass {} for those.
function authHeader(method, url, creds, extraParams = {}) {
  const oauth = {
    oauth_consumer_key: creds.api_key,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.access_token,
    oauth_version: "1.0",
  };
  const allParams = { ...oauth, ...extraParams };
  const paramString = Object.keys(allParams)
    .sort()
    .map((k) => `${enc(k)}=${enc(allParams[k])}`)
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

// Upload one image and return its media_id_string (v1.1 simple upload, base64).
export async function uploadMedia(imagePath, creds) {
  const abs = path.resolve(imagePath);
  if (!fs.existsSync(abs)) throw Object.assign(new Error(`Image not found: ${imagePath}`), { code: "BAD_INPUT" });
  const bytes = fs.statSync(abs).size;
  if (bytes > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error(`Image ${imagePath} is ${bytes} bytes (> 5MB limit)`), { code: "BAD_INPUT" });
  }
  const b64 = fs.readFileSync(abs).toString("base64");
  // media_data is a form field, so it IS part of the signed parameters.
  const params = { media_data: b64 };
  const body = new URLSearchParams(params).toString();
  const res = await fetch(MEDIA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authHeader("POST", MEDIA_ENDPOINT, creds, params),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw Object.assign(new Error(`Media upload ${res.status}: ${text}`), {
      code: "API_ERROR",
      status: res.status,
    });
  }
  return JSON.parse(text).media_id_string;
}

export async function postTweet(text, { dryRun = false, images = [] } = {}) {
  const creds = loadCredentials();
  if (!creds) {
    throw Object.assign(
      new Error(
        "No X credentials. Set X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / " +
          "X_ACCESS_SECRET, or create ~/.config/iseldoran-x/credentials.json. " +
          "See scripts/x-setup.md."
      ),
      { code: "NO_CREDS" }
    );
  }
  if (!text || !text.trim()) {
    throw Object.assign(new Error("Refusing to post empty tweet text."), { code: "BAD_INPUT" });
  }
  if ([...text].length > TWEET_LIMIT) {
    console.warn(
      `!! Warning: ${[...text].length} chars (> ${TWEET_LIMIT}). ` +
        "Requires X Premium or it will be rejected."
    );
  }
  if (images.length > 4) {
    throw Object.assign(new Error("X allows at most 4 images per post."), { code: "BAD_INPUT" });
  }
  if (dryRun) {
    authHeader("POST", TWEETS_ENDPOINT, creds); // exercise signing
    for (const img of images) {
      const abs = path.resolve(img);
      if (!fs.existsSync(abs)) throw Object.assign(new Error(`Image not found: ${img}`), { code: "BAD_INPUT" });
    }
    console.log(`[dry-run] would post${images.length ? ` with ${images.length} image(s)` : ""}:\n${text}`);
    return { dryRun: true };
  }

  const mediaIds = [];
  for (const img of images) {
    mediaIds.push(await uploadMedia(img, creds));
  }
  const payload = { text };
  if (mediaIds.length) payload.media = { media_ids: mediaIds };

  const res = await fetch(TWEETS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authHeader("POST", TWEETS_ENDPOINT, creds),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const bodyText = await res.text();
  if (!res.ok) {
    throw Object.assign(new Error(`X API ${res.status}: ${bodyText}`), {
      code: "API_ERROR",
      status: res.status,
    });
  }
  return JSON.parse(bodyText);
}

// --- CLI ---------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const images = [];
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--image") {
      images.push(args[++i]);
    } else if (args[i] === "--stdin") {
      rest.push(fs.readFileSync(0, "utf8").trim());
    } else if (!args[i].startsWith("--")) {
      rest.push(args[i]);
    }
  }
  const text = rest.join(" ");
  try {
    const out = await postTweet(text, { dryRun, images });
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
