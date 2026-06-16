/*
 * Species catalog + selection helpers for the figure generator (generate.mjs).
 *
 * Canon source: "The Great Bestiary of the Rim", compiled for the Imperial
 * Academy Xenobiological Archives (Iseldoran Universe). Keys 1-11 follow the
 * bestiary's plate numbering.
 *
 * Each entry needs:
 *   - name:       short label used in the prompt and (via pad) the filename
 *   - descriptor: distinctive anatomical / appearance detail for the prompt
 */

export const SPECIES = {
  1: {
    name: "Imperial Human",
    descriptor:
      "Homo Imperialis (Optimized Strain) from Terra, the Holy World. Genetically " +
      "optimized human at the peak of Imperial refinement, roughly 1.88 m tall. " +
      "Athletic build, dark skin, close-cropped hair, disciplined bearing, clad in a " +
      "tan ceremonial tunic with a bronze-gold pauldron and sash, leather belt and bracers.",
  },
  2: {
    name: "Noirak",
    descriptor:
      "Noirak Nobilis from Noirak Prime, an ancient noble species standing 2.45-2.75 m. " +
      "Human-presenting but subtly alien, with refined features, enhanced physiology and " +
      "the bearing of a natural leader. Robed in ornate black and gold imperial vestments.",
  },
  3: {
    name: "Vah'Sumir",
    descriptor:
      "Vah'Sumir Maximus from Sumir Prime, massive apex warriors 3.0-3.6 m tall with a " +
      "digitigrade stance. Crested reptilian head, predatory physiology and thick bronze-grey " +
      "armored hide over dense musculature, built for domination and endurance.",
  },
  4: {
    name: "Ashari'i",
    descriptor:
      "Ashari'i Immortalis from Ashar, an ancient immortal warrior caste 2.3-2.9 m tall. " +
      "Pale ivory skin, elegant refined features, sharp cranial ridges, and advanced longevity. " +
      "Dressed in elegant white and gold ceremonial armor of great age.",
  },
  5: {
    name: "Gor'nath Brute",
    descriptor:
      "Gor'nath Colossus from Gor'nath, a gigantic powerfully built species 3.5-4.2 m tall. " +
      "Incredible strength, dense skeletal structure, a spiked cranial crest and brown " +
      "armor-like skin plates across a hulking heavily muscled frame.",
  },
  6: {
    name: "Yurshak Brood",
    descriptor:
      "Yurshak Broodling from the Yurshak Hive Worlds, hive-evolved predators 2.0-2.6 m tall. " +
      "Insectoid-reptilian morphology with mandibles, jutting horns, multiple sensory organs, " +
      "dark chitinous plating and natural bladed weapons.",
  },
  7: {
    name: "Shal'mak Aerophage",
    descriptor:
      "Shal'mak Dominus, aerial apex organisms native to the high atmosphere layers, with a " +
      "6.0-7.5 m wingspan. Large membranous wings, a crested draconic head, and a light but " +
      "strong sinewy anatomy adapted for high-speed aerial hunting.",
  },
  8: {
    name: "Oolak Luminary",
    descriptor:
      "Oolak Sapientis from Oolak, bioluminescent beings 2.2-2.7 m tall. Translucent silvery-white " +
      "bodies that produce natural light through glowing blue organic structures and luminous eyes. " +
      "Ancient, wise and highly spiritual.",
  },
  9: {
    name: "Threxx War-Smith",
    descriptor:
      "Threxx Ferrum-Artifex from the Threxx Forge Worlds, forge-adapted engineer-warriors " +
      "2.6-3.2 m tall. Stocky grey-skinned humanoids built for industry and warfare, clad in " +
      "heavy industrial plated armor, masters of advanced technology.",
  },
  10: {
    name: "Razeen Flesh-Weaver",
    descriptor:
      "Razeen Artifex from the Razeen Vaults, bio-engineers and sculptors of flesh 2.1-2.6 m tall. " +
      "Pale elegant humanoids with advanced sensory organs and branching root-like tendril growths " +
      "extending from the head and body, masters of organic architecture.",
  },
  11: {
    name: "Haal'tek Voidwalker",
    descriptor:
      "Haal'tek Exuvia from the deep void, void-adapted entities 3.0-3.8 m tall. Elongated dark " +
      "blue-black carapaced bodies with a large smooth head and trailing tendrils, optimized for " +
      "microgravity and extreme isolation between the stars.",
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
