import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNext, minutesSinceLastPost } from "../scripts/moltbook-post-ledger.mjs";

const SAMPLE = `# Cassian's Ledger

[x] **CL 01** — posted to m/iseldoran 2026-01-01 00:00Z
> Already posted fragment.

[ ] **CL 02**
> Second fragment, still queued.
> Second line of the same fragment.

[ ] **CL 03**
> Third fragment.
`;

test("parseNext finds the first unchecked CL item and joins its blockquote body", () => {
  const lines = SAMPLE.split("\n");
  const next = parseNext(lines);
  assert.ok(next);
  assert.equal(lines[next.index].includes("CL 02"), true);
  assert.equal(next.text, "Second fragment, still queued.\nSecond line of the same fragment.");
});

test("parseNext returns null when nothing is queued", () => {
  const lines = "[x] **CL 01** — posted to m/iseldoran 2026-01-01 00:00Z\n> Done.".split("\n");
  assert.equal(parseNext(lines), null);
});

test("minutesSinceLastPost reads the most recent posted timestamp", () => {
  const raw = "[x] **CL 01** — posted to m/iseldoran 2026-01-01 00:00Z\n[x] **CL 02** — posted to m/iseldoran 2026-01-01 00:30Z";
  const mins = minutesSinceLastPost(raw);
  const expected = (Date.now() - Date.parse("2026-01-01T00:30:00Z")) / 60000;
  assert.ok(Math.abs(mins - expected) < 1);
});

test("minutesSinceLastPost is Infinity when nothing has posted yet", () => {
  assert.equal(minutesSinceLastPost("[ ] **CL 01**\n> Not posted yet."), Infinity);
});
