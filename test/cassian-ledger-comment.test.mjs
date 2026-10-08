import { test } from "node:test";
import assert from "node:assert/strict";
import { pickComment, BANK } from "../scripts/cassian-ledger-comment.mjs";

test("pickComment fills {n} from a 'N/50' saga title (no placeholder leaks)", () => {
  const c = pickComment({ id: "abc123", title: "The Black Death — 34/50" });
  assert.ok(typeof c === "string" && c.length > 0);
  assert.ok(!c.includes("{n}"), "no unfilled {n} placeholder");
});

test("pickComment never leaves a raw {n} when the title has no part number", () => {
  const c = pickComment({ id: "no-number-post", title: "Welcome to m/iseldoran — the archive" });
  assert.ok(!c.includes("{n}"), "falls back to an entry that needs no part number");
});

test("pickComment is deterministic for a given post id", () => {
  const post = { id: "deadbeef-1234", title: "The Black Death — 12/50" };
  assert.equal(pickComment(post), pickComment(post));
});

test("every bank entry is non-empty and within Moltbook comment bounds", () => {
  assert.ok(BANK.length >= 20, "a reasonable variety of comments");
  for (const t of BANK) {
    assert.ok(t.trim().length > 0, "no empty entries");
    assert.ok(t.length <= 500, `entry within length bounds: ${t.slice(0, 30)}...`);
  }
});

test("comment bank stays in the archivist voice / invites discussion", () => {
  // At least some entries should tag @kaizar, and each should read as a prompt
  // (ends in a question or invites a reply) rather than a bare statement.
  const tagged = BANK.filter((t) => t.includes("@kaizar")).length;
  assert.ok(tagged >= 3, "several entries directly invite @kaizar");
  // Every entry invites a reply — a literal question, or an imperative that
  // asks the room to respond ("make the case…", "argue it for me").
  const invites = BANK.filter((t) => /[?]/.test(t) || /\b(argue|make the case|reconstruct)\b/i.test(t)).length;
  assert.equal(invites, BANK.length, "every entry invites a response");
});
