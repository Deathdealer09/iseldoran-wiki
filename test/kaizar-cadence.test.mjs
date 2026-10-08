import { test } from "node:test";
import assert from "node:assert/strict";
import { composePost, composePromo, SUBJECTS, GRID_SIZE, BOOKS } from "../scripts/iseldoran-lore.mjs";
import { loadSeeds, nextPost } from "../scripts/moltbook-kaizar-daily.mjs";

test("composePost is deterministic and well-formed", () => {
  const a = composePost(7);
  const b = composePost(7);
  assert.deepEqual(a, b);
  assert.ok(a.title && a.content, "has title and content");
  assert.ok([...a.content].length <= 320, "content stays in the carved range");
});

test("composePost walks the whole grid with strong variety", () => {
  const seen = new Set();
  for (let i = 0; i < GRID_SIZE; i++) {
    const g = composePost(i);
    seen.add(g.title + "|" + g.content);
  }
  assert.ok(seen.size >= GRID_SIZE - SUBJECTS.length, `distinct grid posts: ${seen.size}/${GRID_SIZE}`);
});

test("a full lens-row of posts answers the Ledger", () => {
  let ledger = 0;
  for (let i = 0; i < GRID_SIZE; i++) if (composePost(i).ledger) ledger++;
  assert.ok(ledger >= SUBJECTS.length, `ledger posts: ${ledger}`);
});

test("composePromo cycles the real books", () => {
  const titles = new Set();
  for (let i = 0; i < BOOKS.length * 3; i++) {
    const p = composePromo(i);
    assert.ok(p.promo, "flagged as promo");
    assert.ok(p.content.includes("http"), "carries a link");
    titles.add(p.title);
  }
  assert.ok(titles.size >= BOOKS.length, "covers each book");
});

test("curated seed pool parses to 48 posts, 16 answering the Ledger", () => {
  const seeds = loadSeeds();
  assert.equal(seeds.length, 48, "48 curated seeds (code-fence example excluded)");
  assert.equal(seeds[0].title, "The Archive Reopens");
  const ledger = seeds.filter((s) => s.content.includes("@cassians_ledger")).length;
  assert.equal(ledger, 16, "16 seed posts answer @cassians_ledger");
});

test("nextPost serves seeds, then generated lore (unique) with promos woven in", () => {
  const seeds = loadSeeds();
  const state = { seedCursor: 0, loreCursor: 0, genStep: 0, promoCursor: 0, postedHashes: {} };
  const loreSeen = new Set();
  let promos = 0;
  for (let i = 0; i < 220; i++) {
    const p = nextPost(state, seeds);
    assert.ok(p, "always returns a post");
    state.postedHashes[p.h] = true;
    if (p.promo) { promos++; continue; }
    const k = p.title + "|" + p.content;
    assert.ok(!loreSeen.has(k), `no duplicate lore/seed at draw ${i}`);
    loreSeen.add(k);
  }
  assert.ok(promos > 0, "book promos are woven into the stream");
});
