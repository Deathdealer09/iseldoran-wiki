import { test } from "node:test";
import assert from "node:assert/strict";
import { composePost, SUBJECTS, GRID_SIZE } from "../scripts/iseldoran-lore.mjs";
import { loadSeeds, nextPost } from "../scripts/moltbook-kaizar-daily.mjs";

test("composePost is deterministic and well-formed", () => {
  const a = composePost(7);
  const b = composePost(7);
  assert.deepEqual(a, b);
  assert.ok(a.title && a.content, "has title and content");
  assert.ok([...a.content].length <= 300, "content stays in the carved range");
});

test("composePost walks the whole grid without immediate repeats", () => {
  const seen = new Set();
  for (let i = 0; i < GRID_SIZE; i++) {
    const g = composePost(i);
    seen.add(g.title + "|" + g.content);
  }
  // The grid should yield a large number of distinct posts (allowing a few
  // collisions where a long closer is dropped).
  assert.ok(seen.size >= GRID_SIZE - SUBJECTS.length, `distinct grid posts: ${seen.size}/${GRID_SIZE}`);
});

test("some generated posts address the Ledger", () => {
  let ledger = 0;
  for (let i = 0; i < GRID_SIZE; i++) if (composePost(i).ledger) ledger++;
  assert.ok(ledger >= SUBJECTS.length, "a full lens-row of Ledger posts exists");
});

test("curated seed pool parses to 48 posts, 16 answering the Ledger", () => {
  const seeds = loadSeeds();
  assert.equal(seeds.length, 48, "48 curated seeds (code-fence example excluded)");
  assert.equal(seeds[0].title, "The Archive Reopens");
  const ledger = seeds.filter((s) => s.content.includes("@cassians_ledger")).length;
  assert.equal(ledger, 16, "16 seed posts answer @cassians_ledger");
});

test("nextPost serves seeds first, then the generator, never repeating", () => {
  const seeds = loadSeeds();
  const state = { seedCursor: 0, gridCursor: 0, postedHashes: {} };
  const seen = new Set();
  for (let i = 0; i < 200; i++) {
    const p = nextPost(state, seeds);
    assert.ok(p, "always returns a post");
    const k = p.title + "|" + p.content;
    assert.ok(!seen.has(k), `no duplicate at draw ${i}`);
    seen.add(k);
    state.postedHashes[p.h] = true;
  }
  assert.equal(seen.size, 200);
});
