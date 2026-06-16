/*
 * Species catalog + selection helpers for the figure generator (generate.mjs).
 *
 * SPECIES is keyed by a stable string/number id. Each entry needs:
 *   - name:       short label used in the prompt and (via pad) the filename
 *   - descriptor: one or two sentences of distinctive anatomical detail
 *
 * The entries below are EXAMPLES/PLACEHOLDERS. Replace the descriptors (and add
 * more entries) with canonical Iseldoran xenobiology before generating.
 */

export const SPECIES = {
  1: {
    name: "Vah'Sumir",
    descriptor:
      "Tall genetically engineered post-human, elongated limbs, ridged armored skin, " +
      "deep-set photosensitive eyes, built for survival on hostile worlds.",
  },
  2: {
    name: "Ashari'i",
    descriptor:
      "Lean post-human warform with reinforced musculature, sloped cranial crest, " +
      "and dark mottled hide adapted for existential-scale warfare.",
  },
};

/**
 * Zero-pad a species key for use in a filename (e.g. 1 -> "001").
 * Non-numeric keys are returned as-is.
 */
export function pad(key, width = 3) {
  const str = String(key);
  return /^\d+$/.test(str) ? str.padStart(width, "0") : str;
}

/**
 * Resolve a CLI selection argument into an array of SPECIES keys.
 *
 * Supported forms (comma- or space-separated, combinable):
 *   - "all" / undefined  -> every key in SPECIES
 *   - "1,2,5"            -> those numeric keys
 *   - "1-3"              -> inclusive numeric range
 *   - "vah"              -> case-insensitive match on key or species name
 *
 * Returns a de-duplicated array of keys that actually exist in SPECIES.
 */
export function parseSelection(arg) {
  const allKeys = Object.keys(SPECIES);
  if (!arg || String(arg).trim().toLowerCase() === "all") {
    return allKeys;
  }

  const tokens = String(arg)
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const selected = new Set();

  for (const token of tokens) {
    // Numeric range: "1-3"
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      for (let n = lo; n <= hi; n++) {
        if (Object.prototype.hasOwnProperty.call(SPECIES, n)) {
          selected.add(String(n));
        }
      }
      continue;
    }

    // Exact key match
    if (Object.prototype.hasOwnProperty.call(SPECIES, token)) {
      selected.add(token);
      continue;
    }

    // Case-insensitive match on key or species name
    const lower = token.toLowerCase();
    for (const key of allKeys) {
      const name = SPECIES[key]?.name?.toLowerCase() ?? "";
      if (key.toLowerCase() === lower || name.includes(lower)) {
        selected.add(key);
      }
    }
  }

  return [...selected];
}
