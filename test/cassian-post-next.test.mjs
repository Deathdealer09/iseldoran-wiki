import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNext, minutesSinceLastPost } from "../scripts/cassian-post-next.mjs";

test("parseNext finds the first unchecked entry, dropping the leading number", () => {
  const lines = [
    "[x] **1. Already posted** — posted 2026-01-01 00:00Z",
    "> old body",
    "",
    "[ ] **2. Filed under: tests**",
    "> First line of the body.",
    ">",
    "> Second paragraph.",
    "",
    "[ ] **3. Never reached**",
    "> unreached body",
  ];
  const next = parseNext(lines);
  assert.equal(next.title, "Filed under: tests");
  assert.equal(next.text, "First line of the body.\n\nSecond paragraph.");
  assert.equal(next.index, 3);
});

test("parseNext returns null when nothing is queued", () => {
  const lines = ["[x] **1. Done** — posted 2026-01-01 00:00Z", "> body"];
  assert.equal(parseNext(lines), null);
});

test("minutesSinceLastPost reads the most recent posted-timestamp marker", () => {
  const now = Date.now();
  const stampMinsAgo = (mins) => new Date(now - mins * 60000).toISOString().slice(0, 16).replace("T", " ") + "Z";
  const raw = [
    `[x] **1. Older** — posted ${stampMinsAgo(120)}`,
    `[x] **2. Newer** — posted ${stampMinsAgo(10)}`,
    "[ ] **3. Queued**",
  ].join("\n");
  const mins = minutesSinceLastPost(raw);
  assert.ok(mins >= 9 && mins <= 11, `expected ~10 minutes, got ${mins}`);
});

test("minutesSinceLastPost is Infinity when nothing has ever posted", () => {
  assert.equal(minutesSinceLastPost("[ ] **1. Queued**\n> body"), Infinity);
});
