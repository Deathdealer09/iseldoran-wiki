#!/usr/bin/env node
/**
 * post-to-x.mjs — Post a tweet to X (Twitter) from the command line.
 *
 * Uses the X API v2 `POST /2/tweets` endpoint with OAuth 1.0a User Context
 * signing. No third-party dependencies — just Node's built-in `crypto`.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 * Create an app at https://developer.x.com with Read+Write permission, then
 * generate Consumer Keys and an Access Token + Secret. Export these as env
 * vars (e.g. in a local .env you DON'T commit, or as GitHub Actions secrets):
 *
 *   X_API_KEY         consumer (API) key
 *   X_API_SECRET      consumer (API) secret
 *   X_ACCESS_TOKEN    access token (for the posting account)
 *   X_ACCESS_SECRET   access token secret
 *
 * ── Usage ────────────────────────────────────────────────────────────────
 *   node scripts/post-to-x.mjs "Your tweet text here"
 *   node scripts/post-to-x.mjs --file path/to/tweet.txt
 *   node scripts/post-to-x.mjs --dry-run "Preview without posting"
 *   node scripts/post-to-x.mjs --last       # show the account's latest tweet
 *
 * Exit code 0 on success, non-zero on any error.
 */

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const POST_URL = 'https://api.twitter.com/2/tweets';
const ME_URL = 'https://api.twitter.com/2/users/me';
// X always counts a URL as 23 characters; the standard tweet limit is 280.
const TWEET_LIMIT = 280;

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { dryRun: false, file: null, text: null, last: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--last') opts.last = true;
    else if (arg === '--file') opts.file = argv[++i];
    else if (!opts.text) opts.text = arg;
  }
  return opts;
}

function loadCreds() {
  const creds = {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  };
  const names = [];
  if (!creds.apiKey) names.push('X_API_KEY');
  if (!creds.apiSecret) names.push('X_API_SECRET');
  if (!creds.accessToken) names.push('X_ACCESS_TOKEN');
  if (!creds.accessSecret) names.push('X_ACCESS_SECRET');
  if (names.length) fail(`Missing env var(s): ${names.join(', ')}`);
  return creds;
}

function getText(opts) {
  if (opts.file) return readFileSync(opts.file, 'utf8').trim();
  if (opts.text) return opts.text;
  return null;
}

// RFC 3986 percent-encoding (stricter than encodeURIComponent).
function rfc3986(str) {
  return encodeURIComponent(str).replace(
    /[!*'()]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function oauthHeader({ method, url, creds, queryParams = {} }) {
  const oauth = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: '1.0',
  };

  // The signature base includes the oauth_* params plus any query-string
  // params. A JSON request body is NOT included in the signature.
  const allParams = { ...oauth, ...queryParams };
  const paramString = Object.keys(allParams)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(allParams[k])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    rfc3986(url),
    rfc3986(paramString),
  ].join('&');

  const signingKey = `${rfc3986(creds.apiSecret)}&${rfc3986(creds.accessSecret)}`;
  oauth.oauth_signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');

  // Only oauth_* params go in the Authorization header.
  return (
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${rfc3986(k)}="${rfc3986(oauth[k])}"`)
      .join(', ')
  );
}

// Fetch and print the authenticated account's most recent tweet.
async function showLast(creds) {
  const me = await apiGet(ME_URL, {}, creds);
  const userId = me?.data?.id;
  if (!userId) fail('Could not resolve the authenticated user id.');

  const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets`;
  const query = { max_results: '5', 'tweet.fields': 'created_at' };
  const tl = await apiGet(tweetsUrl, query, creds);

  const latest = tl?.data?.[0];
  if (!latest) {
    console.log('No tweets found on this account.');
    return;
  }

  console.log(`Last post by @${me.data.username}:`);
  console.log('─'.repeat(50));
  console.log(latest.text);
  console.log('─'.repeat(50));
  if (latest.created_at) console.log(`Posted: ${latest.created_at}`);
  console.log(`https://x.com/i/web/status/${latest.id}`);
}

async function apiGet(url, queryParams, creds) {
  const authorization = oauthHeader({ method: 'GET', url, creds, queryParams });
  const qs = new URLSearchParams(queryParams).toString();
  const res = await fetch(qs ? `${url}?${qs}` : url, {
    headers: { Authorization: authorization },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    fail(
      `X API ${res.status}: ${JSON.stringify(body.detail || body.errors || body)}`
    );
  }
  return body;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // Read mode: show the account's most recent tweet and exit.
  if (opts.last) {
    await showLast(loadCreds());
    return;
  }

  const text = getText(opts);

  if (!text) {
    fail('No tweet text. Pass it as an argument or use --file <path>.');
  }
  if (text.length > TWEET_LIMIT) {
    fail(
      `Tweet is ${text.length} chars (limit ${TWEET_LIMIT}). ` +
        'Shorten it or use a Premium+ account.'
    );
  }

  console.log('─'.repeat(50));
  console.log(text);
  console.log('─'.repeat(50));
  console.log(`(${text.length}/${TWEET_LIMIT} chars)`);

  if (opts.dryRun) {
    console.log('✓ Dry run — nothing posted.');
    return;
  }

  const creds = loadCreds();
  const authorization = oauthHeader({ method: 'POST', url: POST_URL, creds });

  const res = await fetch(POST_URL, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    fail(
      `X API ${res.status}: ${JSON.stringify(body.detail || body.errors || body)}`
    );
  }

  const id = body?.data?.id;
  console.log(`✓ Posted. Tweet ID: ${id}`);
  if (id) console.log(`  https://x.com/i/web/status/${id}`);
}

main().catch((err) => fail(err.message));
