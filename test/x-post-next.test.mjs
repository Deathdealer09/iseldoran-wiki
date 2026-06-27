import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNext, markPostedLine } from "../scripts/x-post-next.mjs";

const sample = `# Queue

## Batch 1

[x] **0. Already posted** — posted 2026-06-27 00:00Z
> This one is done.

[ ] **1. Manufactured divinity**
Image: assets/bestiary/001.jpg
> At his coronation, Cassian I executed 433 rival princes.
> You end every bloodline that could argue otherwise.

[ ] **2. Second item**
> Body of the second item.
`.split("\n");

test("parseNext skips posted items and finds the first unchecked", () => {
  const next = parseNext(sample);
  assert.ok(next);
  assert.equal(next.header, "1. Manufactured divinity");
});

test("parseNext joins multi-line blockquotes with newlines", () => {
  const next = parseNext(sample);
  assert.equal(
    next.text,
    "At his coronation, Cassian I executed 433 rival princes.\nYou end every bloodline that could argue otherwise."
  );
});

test("parseNext stops the body at the next item", () => {
  const next = parseNext(sample);
  assert.ok(!next.text.includes("Second item"));
  assert.ok(!next.text.includes("Body of the second"));
});

test("parseNext extracts the Image: line and keeps it out of the text", () => {
  const next = parseNext(sample);
  assert.deepEqual(next.images, ["assets/bestiary/001.jpg"]);
  assert.ok(!next.text.includes("Image:"));
});

test("parseNext returns an empty images array when none declared", () => {
  const noImg = `[ ] **A. No image**\n> Just text.\n`.split("\n");
  assert.deepEqual(parseNext(noImg).images, []);
});

test("parseNext returns null when nothing is queued", () => {
  const allPosted = `[x] **1. Done** — posted now\n> body\n`.split("\n");
  assert.equal(parseNext(allPosted), null);
});

test("parseNext returns the correct line index for rewriting", () => {
  const next = parseNext(sample);
  assert.match(sample[next.index], /^\[ \] \*\*1\. Manufactured divinity\*\*/);
});

test("markPostedLine flips the checkbox and stamps the header", () => {
  const line = "[ ] **1. Manufactured divinity**";
  const out = markPostedLine(line, "2026-06-27 04:00Z");
  assert.equal(out, "[x] **1. Manufactured divinity** — posted 2026-06-27 04:00Z");
});

test("markPostedLine does not touch an already-posted line", () => {
  const line = "[x] **1. Done** — posted 2026-06-27 00:00Z";
  assert.equal(markPostedLine(line, "now"), line);
});
