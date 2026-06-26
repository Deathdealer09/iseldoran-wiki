# Xenobiology Reference Plate Generator

> **Official Imperial Xenological Survey Archive** — museum-grade species
> reference plates for *The Great Bestiary of the Rim* (Iseldoran Sagas).

This document is the human-readable specification for the single-stage plate
generator. Where the two-stage pipeline (`generate.mjs` → `annotate.mjs`)
renders a clean figure and then composites the ruler, data block, and seal
deterministically with `sharp`, this generator bakes the **scale ruler**, the
**Imperial seal**, and the **scale range** straight into the image prompt and
asks the model for a finished plate in one pass.

The canonical species catalog lives in [`../species.mjs`](../species.mjs). The
table below is kept in sync with it (12 species, canon names and scale ranges).

---

## Output format

| Setting        | Value                                                        |
| -------------- | ----------------------------------------------------------- |
| Orientation    | Portrait, **2:3** framing (`1024x1536`)                      |
| Background     | Plain pale-grey parchment archive sheet                      |
| Subject        | Single specimen, front-facing, neutral anatomical pose       |
| Framing        | Entire body head-to-feet, no cropping                        |
| Ruler          | Vertical metric ruler on the right edge, `0 m` → `scaleMax`  |
| Seal           | Small gold Imperial double-headed eagle, lower-left corner   |
| Text           | None except the metric ruler markings                        |
| Style          | Hyperrealistic digital concept art, muted/desaturated palette |
| Lighting       | Cinematic soft studio lighting, bronze & gold archive accents |

---

## Prompt template

Each plate is built from the same scaffold, with the species `name`,
`descriptor`, and `scaleMax` substituted in:

```text
Full-body xenobiology reference plate of one {name}.
{descriptor}
Official Imperial Xenological Survey Archive.
Museum-grade scientific species illustration.
Single specimen only, front-facing, neutral anatomical pose.
Entire body visible from head to feet, no cropping.
Subject standing beside a simple vertical metric ruler on the right edge.
Ruler scale range: 0m to {scaleMax}m.
No labels, no captions, no extra writing except metric ruler markings.
Plain pale grey parchment archive background.
Small gold Imperial double-headed eagle seal in the lower-left corner.
Hyperrealistic digital concept art.
Fine anatomical detail.
Natural coloration.
Cinematic soft studio lighting.
Muted desaturated palette with bronze and gold archive accents.
Sharp focus, painterly realism, portrait 2:3 framing.
```

---

## Species catalog

| # | Species | Classification | Homeworld | Scale (m) | Scale max (ruler) |
| - | ------- | -------------- | --------- | --------- | ----------------- |
| 1 | Imperial Human | Homo Imperialis (Optimized Strain) | Terra (Holy World) | 1.88 | 2.0 |
| 2 | Noirak | Noirak Nobilis | Noirak Prime | 2.45–2.75 | 3.0 |
| 3 | Vah'Sumir | Vah'Sumir Maximus | Sumir Prime | 3.0–3.6 | 4.0 |
| 4 | Ashari'i | Ashari'i Immortalis | Ashar | 2.3–2.9 | 3.0 |
| 5 | Gor'nath Brute | Gor'nath Colossus | Gor'nath | 3.5–4.2 | 5.0 |
| 6 | Yurshak Brood | Yurshak Broodling | Yurshak Hive Worlds | 2.0–2.6 | 3.0 |
| 7 | Shal'mak Aerophage | Shal'mak Dominus | High Atmosphere Layers | 6.0–7.5 (wingspan) | 4.0 |
| 8 | Oolak Luminary | Oolak Sapientis | Oolak | 2.2–2.7 | 3.0 |
| 9 | Threxx War-Smith | Threxx Ferrum-Artifex | Thorexia Prime | 2.6–3.2 | 4.0 |
| 10 | Razeen Flesh-Weaver | Razeen Artifex | Razeen Vaults | 2.1–2.6 | 3.0 |
| 11 | Haal'tek Voidwalker | Haal'tek Exuvia | Deep Void / Unknown | 3.0–3.8 | 4.0 |
| 12 | Aquorian | Aquorian Pelagis | Pelagic Depths | 2.2–2.7 | 3.0 |

### Descriptors

The `descriptor` is the distinctive-appearance line dropped into the prompt
after the species name. These mirror `species.mjs`.

1. **Imperial Human** — Genetically optimized human at the peak of Imperial
   refinement, ~1.88 m. Athletic build, dark skin, close-cropped hair,
   disciplined bearing; tan ceremonial tunic with a bronze-gold pauldron and
   sash, leather belt and bracers.
2. **Noirak** — Ancient noble species, 2.45–2.75 m. Human-presenting but subtly
   alien, refined features, enhanced physiology, the bearing of a natural
   leader; ornate black-and-gold imperial vestments.
3. **Vah'Sumir** — Massive apex warriors, 3.0–3.6 m, digitigrade stance. Crested
   reptilian head, predatory physiology, thick bronze-grey armored hide over
   dense musculature.
4. **Ashari'i** — Ancient immortal warrior caste, 2.3–2.9 m. Pale ivory skin,
   elegant refined features, sharp cranial ridges; white-and-gold ceremonial
   armor of great age.
5. **Gor'nath Brute** — Gigantic, powerfully built, 3.5–4.2 m. Dense skeletal
   structure, spiked cranial crest, brown armor-like skin plates over a hulking
   heavily muscled frame.
6. **Yurshak Brood** — Hive-evolved predators, 2.0–2.6 m. Insectoid-reptilian
   morphology with mandibles, jutting horns, multiple sensory organs, dark
   chitinous plating, natural bladed weapons.
7. **Shal'mak Aerophage** — Aerial apex organisms, 6.0–7.5 m wingspan. Large
   membranous wings, crested draconic head, light but strong sinewy anatomy for
   high-speed aerial hunting.
8. **Oolak Luminary** — Bioluminescent beings, 2.2–2.7 m. Translucent
   silvery-white bodies producing natural light through glowing blue organic
   structures and luminous eyes; ancient, wise, highly spiritual.
9. **Threxx War-Smith** — Forge-adapted engineer-warriors, 2.6–3.2 m. Stocky
   grey-skinned humanoids in heavy industrial plated armor; masters of advanced
   technology.
10. **Razeen Flesh-Weaver** — Bio-engineers and flesh-sculptors, 2.1–2.6 m. Pale
    elegant humanoids with advanced sensory organs and branching root-like
    tendril growths; masters of organic architecture.
11. **Haal'tek Voidwalker** — Void-adapted entities, 3.0–3.8 m. Elongated dark
    blue-black carapaced bodies, large smooth head, trailing tendrils; optimized
    for microgravity and extreme isolation between stars.
12. **Aquorian** — Deep-pelagic bioluminescent species, 2.2–2.7 m. Translucent
    crystalline blue skin, glowing internal neural lattices, trailing fin-sails
    and webbed digits; adapted to crushing pressure and electromagnetic sensing.

---

## Generation config

The reference generator script uses these defaults:

| Key          | Value         | Notes                                        |
| ------------ | ------------- | -------------------------------------------- |
| `model`      | `gpt-image-1` | Image model / endpoint mapping               |
| `size`       | `1024x1536`   | Portrait 2:3                                  |
| `quality`    | `auto`        | `low` / `auto` / `high`                       |
| `outDir`     | `out`         | Gitignored working space                      |
| `delayMs`    | `1500`        | Pause between requests (rate-limit courtesy)  |
| `maxRetries` | `3`           | Exponential-ish backoff on failure           |
| `timeoutMs`  | `120000`      | Per-request timeout                           |
| `selected`   | `[1..12]`     | Which species keys to render                  |

Filenames are `NN-slug.png` (zero-padded key + slugified name), e.g.
`03-vahsumir.png`.

---

## Generating the plates in Canva

These plates can also be produced as Canva designs (poster format, portrait)
and exported as PNG/JPG. The workflow:

1. **Generate** a poster design per species from its descriptor + plate spec
   (`generate-design`, `design_type: "poster"`).
2. **Materialize** the chosen candidate into an editable design
   (`create-design-from-candidate`).
3. **Export** it as PNG/JPG (`export-design`) and drop the result into
   `assets/bestiary/NNN.jpg` (zero-padded plate number matching this table).

> **Note on fidelity:** Canva's design generation is template/layout driven and
> will not reproduce the hyperrealistic concept-art look of a raw `gpt-image-1`
> render. Use the `gpt-image-1` pipeline for archival hero plates; use Canva
> when you want an editable, on-brand, shareable layout.

---

## See also

- [`../species.mjs`](../species.mjs) — canonical species catalog (source of truth)
- [`../generate.mjs`](../generate.mjs) — Stage 1: figure generation
- [`../annotate.mjs`](../annotate.mjs) — Stage 2: ruler + data block + seal compositing
- [`../assets/bestiary/README.md`](../assets/bestiary/README.md) — published plate slots
