/*
 * Pipeline tests. The fixture is SYNTHETIC placeholder text whose only purpose
 * is to exercise the arithmetic; it is not research data and must never be
 * reported as findings.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parseCsv, toCsv } from "./csv.mjs";
import { validateRow } from "./codebook.mjs";

const FIXTURE = "scripts/vzla-tt/fixtures/SYNTHETIC-not-real-data.csv";

function run(args) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "vzla-"));
  execFileSync("node", ["scripts/vzla-tt/analyze.mjs", FIXTURE, "--out", out], {
    encoding: "utf8",
  });
  return JSON.parse(fs.readFileSync(path.join(out, "analysis.json"), "utf8"));
}

test("csv round-trips quoted fields and embedded newlines", () => {
  const t = 'a,b\n1,"x, ""y""\nz"\n';
  const p = parseCsv(t);
  assert.equal(p.rows[0].b, 'x, "y"\nz');
  assert.equal(parseCsv(toCsv(p.header, p.rows)).rows[0].b, 'x, "y"\nz');
});

test("duplicate comments from the same commenter are removed", () => {
  const a = run();
  // Rows C0001 and C0004 are the same text from commenter H001 on two platforms.
  assert.equal(a.sample.rows_in_file, 6);
  assert.equal(a.sample.duplicates_removed, 1);
  assert.equal(a.sample.comments_analysed, 5);
});

test("unique commenters are counted, not comments", () => {
  const a = run();
  assert.equal(a.sample.unique_commenters, 5);
});

test("themes rank by distinct commenters", () => {
  const a = run();
  const doc = a.themes_all.find((t) => t.theme === "documentation");
  assert.equal(doc.commenters, 2);
  assert.equal(a.themes_all[0].theme, "documentation");
});

test("second-hand rows are excluded from destination preference", () => {
  const a = run();
  // H004 is second_hand with stay_trinidad and must not be counted.
  assert.equal(a.destination_preference.n_commenters_expressing, 4);
  assert.equal(a.destination_preference.counts.stay_trinidad, 1);
});

test("percentages are withheld below the reporting threshold", () => {
  const a = run();
  for (const t of a.themes_all) {
    assert.equal(t.share_of_commenters.pct, null);
    assert.equal(t.share_of_commenters.below_threshold, true);
  }
});

test("open-coded themes are reported rather than rejected", () => {
  const a = run();
  assert.ok(a.quality_control.open_coded_themes.includes("teleworking_for_venezuelan_firms"));
});

test("an empty dataset yields an empty report, not estimates", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vzla-empty-"));
  const empty = path.join(dir, "empty.csv");
  fs.writeFileSync(empty, fs.readFileSync(FIXTURE, "utf8").split("\n")[0] + "\n");
  execFileSync("node", ["scripts/vzla-tt/analyze.mjs", empty, "--out", dir], {
    encoding: "utf8",
  });
  const a = JSON.parse(fs.readFileSync(path.join(dir, "analysis.json"), "utf8"));
  assert.equal(a.sample.comments_analysed, 0);
  assert.equal(a.sample.unique_commenters, 0);
  assert.equal(a.themes_all.length, 0);
  assert.equal(a.sentiment.toward_trinidad.mean, null);
  assert.equal(a.sample.target_vs_actual.shortfall, 5000);
});

test("validator rejects out-of-codebook values and bad dates", () => {
  const bad = validateRow(
    { Platform: "MySpace", Date: "05/09/2026", Anonymous_ID: "x", Comment: "c",
      First_Hand: "first_hand", Theme: "employment", Confidence: "high", Commenter_Hash: "h" },
    7,
  );
  assert.ok(bad.errors.some((e) => e.includes("Platform")));
  assert.ok(bad.errors.some((e) => e.includes("ISO YYYY-MM-DD")));
});
