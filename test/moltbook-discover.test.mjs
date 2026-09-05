import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadState, saveState, QUERIES } from "../scripts/moltbook-discover.mjs";

test("loadState returns an empty engaged map when the file doesn't exist", () => {
  const file = path.join(os.tmpdir(), `moltbook-engaged-${Date.now()}-missing.json`);
  assert.deepEqual(loadState(file), { engaged: {} });
});

test("saveState + loadState round-trips engagement records", () => {
  const file = path.join(os.tmpdir(), `moltbook-engaged-${Date.now()}.json`);
  const state = { engaged: { post123: { title: "Hello", author: "SomeMolty", at: "2026-01-01T00:00:00.000Z" } } };
  saveState(state, file);
  assert.deepEqual(loadState(file), state);
  fs.unlinkSync(file);
});

test("loadState tolerates corrupt JSON", () => {
  const file = path.join(os.tmpdir(), `moltbook-engaged-${Date.now()}-corrupt.json`);
  fs.writeFileSync(file, "{not json");
  assert.deepEqual(loadState(file), { engaged: {} });
  fs.unlinkSync(file);
});

test("QUERIES is a non-empty pool of distinct search terms", () => {
  assert.ok(QUERIES.length > 1);
  assert.equal(new Set(QUERIES).size, QUERIES.length);
});
