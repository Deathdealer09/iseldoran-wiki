#!/usr/bin/env node
/*
 * TikTok Research API collector for the "Venezuelans in Trinidad" study.
 *
 * Queries public videos matching the study's search terms, pulls the comment
 * threads, and writes rows in the raw shape that prepare.mjs consumes. Author
 * identifiers are handed on as opaque labels and are anonymised downstream by
 * prepare.mjs; no username is ever written to the master dataset.
 *
 * STATUS: UNVERIFIED AGAINST THE LIVE API. Written from the published endpoint
 * documentation and never executed against TikTok, because this environment
 * blocks the host and holds no credentials. Treat the first real run as a
 * shakedown: start with --max-videos 2 and confirm the response shape before
 * spending daily quota.
 *
 * Access requires an approved TikTok Research API application. Eligibility is
 * limited to qualifying universities and non-profit academic institutions in
 * the US, EEA, UK, Switzerland and Brazil, and requires completed ethical
 * review. See docs/venezuelans-trinidad-social-listening-access.md.
 *
 * Quota: 1,000 requests per day, 100 records per request. Each video costs one
 * search request plus one request per 100 comments. The script tracks spend and
 * stops before the ceiling rather than failing mid-collection.
 *
 * Credentials (environment):
 *   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
 *
 * Usage:
 *   node scripts/vzla-tt/collect-tiktok.mjs --out raw-tiktok.csv \
 *     --start 2025-01-01 --end 2026-09-01 --max-videos 50 [--dry-run]
 *
 * Exit codes: 0 ok · 1 error · 2 no credentials
 */
import fs from "node:fs";
import path from "node:path";
import { toCsv } from "./csv.mjs";
import { SEARCH_TERMS } from "./search-terms.mjs";

const API = "https://open.tiktokapis.com";
const DAILY_REQUEST_CEILING = 950; // leave headroom under the 1,000 limit
const PAGE = 100;

let requestsSpent = 0;

/** POST JSON with bearer auth, surfacing API errors rather than swallowing them. */
async function post(url, token, body) {
  if (requestsSpent >= DAILY_REQUEST_CEILING) {
    throw new Error(`daily request ceiling reached (${DAILY_REQUEST_CEILING})`);
  }
  requestsSpent++;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`non-JSON response from ${url} (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }
  if (!res.ok || json?.error?.code === "invalid_params" || json?.error?.code === "rate_limit_exceeded") {
    throw new Error(`API error from ${url} (HTTP ${res.status}): ${JSON.stringify(json.error ?? json).slice(0, 400)}`);
  }
  return json;
}

/** Client-credentials token. */
async function getToken() {
  const key = process.env.TIKTOK_CLIENT_KEY;
  const secret = process.env.TIKTOK_CLIENT_SECRET;
  if (!key || !secret) {
    console.error("error: set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET");
    process.exit(2);
  }
  const res = await fetch(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: key,
      client_secret: secret,
      grant_type: "client_credentials",
    }),
  });
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`token request failed: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return json.access_token;
}

/** TikTok wants dates as YYYYMMDD. */
const compact = (iso) => iso.replace(/-/g, "");

/**
 * Search public videos. The API caps a single query window at 30 days, so the
 * requested range is walked in monthly slices.
 */
async function searchVideos(token, terms, startDate, endDate, maxVideos) {
  const videos = [];
  let windowStart = new Date(startDate);
  const final = new Date(endDate);

  while (windowStart < final && videos.length < maxVideos) {
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 29);
    const sliceEnd = windowEnd > final ? final : windowEnd;

    let cursor = 0;
    let searchId;
    let hasMore = true;

    while (hasMore && videos.length < maxVideos) {
      const body = {
        query: {
          and: [
            { operation: "IN", field_name: "region_code", field_values: ["TT", "VE"] },
            { operation: "IN", field_name: "keyword", field_values: terms.slice(0, 20) },
          ],
        },
        start_date: compact(windowStart.toISOString().slice(0, 10)),
        end_date: compact(sliceEnd.toISOString().slice(0, 10)),
        max_count: PAGE,
        ...(cursor ? { cursor } : {}),
        ...(searchId ? { search_id: searchId } : {}),
      };
      const json = await post(
        `${API}/v2/research/video/query/?fields=id,create_time,region_code,video_description`,
        token,
        body,
      );
      const batch = json?.data?.videos ?? [];
      videos.push(...batch);
      cursor = json?.data?.cursor ?? 0;
      searchId = json?.data?.search_id;
      hasMore = Boolean(json?.data?.has_more) && batch.length > 0;
      process.stderr.write(`\r  videos: ${videos.length} (requests ${requestsSpent})   `);
    }

    windowStart = new Date(sliceEnd);
    windowStart.setDate(windowStart.getDate() + 1);
  }
  process.stderr.write("\n");
  return videos.slice(0, maxVideos);
}

/** Pull every comment page for one video. */
async function fetchComments(token, videoId) {
  const out = [];
  let cursor = 0;
  let hasMore = true;
  while (hasMore) {
    const json = await post(
      `${API}/v2/research/video/comment/list/?fields=id,video_id,text,like_count,reply_count,parent_comment_id,create_time`,
      token,
      { video_id: videoId, max_count: PAGE, ...(cursor ? { cursor } : {}) },
    );
    const batch = json?.data?.comments ?? [];
    out.push(...batch);
    cursor = json?.data?.cursor ?? 0;
    hasMore = Boolean(json?.data?.has_more) && batch.length > 0;
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
  };
  const out = opt("--out", "raw-tiktok.csv");
  const start = opt("--start", "2025-01-01");
  const end = opt("--end", new Date().toISOString().slice(0, 10));
  const maxVideos = Number(opt("--max-videos", "50"));
  const dryRun = args.includes("--dry-run");

  const terms = SEARCH_TERMS.filter((t) => t.platform_query).map((t) => t.term);

  if (dryRun) {
    console.log(`dry run: would search ${terms.length} terms in region TT and VE`);
    console.log(`window ${start} to ${end}, up to ${maxVideos} videos`);
    console.log(`terms: ${terms.slice(0, 20).join(" | ")}`);
    console.log(`estimated request spend: ${Math.ceil(maxVideos / PAGE)} search + up to ${maxVideos} comment pages`);
    return;
  }

  (async () => {
    const token = await getToken();
    console.error(`searching videos ${start} to ${end}...`);
    const videos = await searchVideos(token, terms, start, end, maxVideos);
    console.error(`found ${videos.length} videos; pulling comments...`);

    const rows = [];
    for (const [i, v] of videos.entries()) {
      if (requestsSpent >= DAILY_REQUEST_CEILING) {
        console.error(`\nstopping: request ceiling reached after ${i} videos`);
        break;
      }
      let comments = [];
      try {
        comments = await fetchComments(token, v.id);
      } catch (err) {
        console.error(`\n  video ${v.id}: ${err.message}`);
        continue;
      }
      for (const c of comments) {
        rows.push({
          Platform: "TikTok",
          Date: c.create_time
            ? new Date(c.create_time * 1000).toISOString().slice(0, 10)
            : "",
          // Opaque per-video author label. The Research API does not expose
          // usernames on comments; prepare.mjs hashes whatever label arrives.
          Author_Label: `tiktok:${c.id}`,
          Comment: c.text ?? "",
          Source_URL: `https://www.tiktok.com/@/video/${v.id}`,
          Engagement: c.like_count ?? "",
        });
      }
      process.stderr.write(`\r  comments: ${rows.length} from ${i + 1}/${videos.length} videos   `);
    }
    process.stderr.write("\n");

    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(
      out,
      toCsv(["Platform", "Date", "Author_Label", "Comment", "Source_URL", "Engagement"], rows),
    );
    console.log(`wrote ${rows.length} raw comments to ${out} (${requestsSpent} API requests spent)`);
    console.log(`next: node scripts/vzla-tt/prepare.mjs ${out} --out dataset.csv --append`);
  })().catch((err) => {
    console.error(`error: ${err.message}`);
    process.exit(1);
  });
}

main();
