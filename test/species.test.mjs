import { test } from "node:test";
import assert from "node:assert/strict";
import { SPECIES, pad, parseSelection } from "../species.mjs";

test("pad zero-pads numeric keys to width 3", () => {
  assert.equal(pad(1), "001");
  assert.equal(pad(12), "012");
  assert.equal(pad(100), "100");
});

test("pad leaves non-numeric keys untouched", () => {
  assert.equal(pad("vah"), "vah");
});

test("pad honors a custom width", () => {
  assert.equal(pad(7, 4), "0007");
});

test("parseSelection: undefined / 'all' returns every key", () => {
  const all = Object.keys(SPECIES);
  assert.deepEqual(parseSelection(undefined).sort(), all.slice().sort());
  assert.deepEqual(parseSelection("all").sort(), all.slice().sort());
  assert.deepEqual(parseSelection("ALL").sort(), all.slice().sort());
});

test("parseSelection: explicit comma list", () => {
  assert.deepEqual(parseSelection("1,2,5").sort(), ["1", "2", "5"]);
});

test("parseSelection: inclusive numeric range", () => {
  assert.deepEqual(parseSelection("1-3").sort(), ["1", "2", "3"]);
});

test("parseSelection: reversed range still works", () => {
  assert.deepEqual(parseSelection("3-1").sort(), ["1", "2", "3"]);
});

test("parseSelection: case-insensitive name match", () => {
  // "vah" matches Vah'Sumir (key 3)
  assert.deepEqual(parseSelection("vah"), ["3"]);
});

test("parseSelection: de-duplicates overlapping selectors", () => {
  const got = parseSelection("1,1,1-2").sort();
  assert.deepEqual(got, ["1", "2"]);
});

test("parseSelection: unknown tokens are dropped", () => {
  assert.deepEqual(parseSelection("nonexistent-thing-xyz"), []);
});

test("SPECIES catalog is internally consistent", () => {
  for (const [key, s] of Object.entries(SPECIES)) {
    assert.ok(s.name, `species ${key} has a name`);
    assert.ok(s.classification, `species ${key} has a classification`);
    assert.ok(s.homeworld, `species ${key} has a homeworld`);
    assert.ok(typeof s.rulerMax === "number", `species ${key} rulerMax is numeric`);
    assert.ok(s.descriptor && s.descriptor.length > 20, `species ${key} has a descriptor`);
  }
});
