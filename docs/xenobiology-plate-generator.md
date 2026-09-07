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

## Title-header plate prompts (ready to paste)

These match the finished title-header plate style (species name + homeworld set
at the top, vertical metric ruler down the right edge, gold Imperial
double-headed eagle seal lower-left, aged parchment). Every prompt shares the
same **layout / style / text** wrapper — stated once here, then each species
block fills the four variables (`title`, `homeworld line`, `ruler max`,
`subject`).

**Shared wrapper (prepend/append to each subject below):**

```text
A museum-grade xenobiology reference plate in an aged Imperial archive style.

LAYOUT (strict):
- Portrait orientation, 2:3 framing (1024x1536).
- Aged pale-grey/cream parchment sheet with subtle stains, a fine printed
  inner border and small ornamental filigree corner pieces.
- Centered title header at the top in large classical serif capitals:
  "{{TITLE}}"  then a smaller centered "of" flanked by tiny diamond ornaments,
  then the homeworld in a smaller serif title: "{{HOMEWORLD}}".
- One specimen, full body, head-to-feet, no cropping, centered below the
  title, front-facing in a neutral anatomical reference pose, arms at sides.
- A vertical metric ruler down the RIGHT edge with clean tick marks and labels
  from "0m" at the bottom up to "{{RULER_MAX}}m" at the top; the specimen's
  height reads correctly against the ruler ({{TYPICAL_HEIGHT}}m).
- A small gold Imperial double-headed eagle seal in the LOWER-LEFT corner.

STYLE:
Hyperrealistic digital concept art, fine anatomical and material detail,
natural coloration, cinematic soft studio lighting, muted desaturated palette
with bronze and gold archive accents, sharp focus, painterly realism.

TEXT RULES:
No text anywhere except the title header, the "of", the homeworld line, and the
metric ruler markings. No captions, no paragraphs, no watermark.
```

### 01 · Imperial Human
- **title:** `IMPERIAL HUMAN` · **of** `Terra, the Holy World` · **ruler:** `2.0m` · **height:** `~1.9m`
- **subject:** Homo Imperialis (Optimized Strain), a genetically optimized human at the peak of Imperial refinement, ~1.88 m. Athletic build, dark skin, close-cropped hair, disciplined bearing; tan ceremonial tunic with a bronze-gold pauldron and sash, leather belt and bracers.

### 02 · Noirak
- **title:** `NOIRAK` · **of** `Noirak Prime` · **ruler:** `3.0m` · **height:** `~2.6m`
- **subject:** Noirak Nobilis, an ancient noble species 2.45-2.75 m tall. Human-presenting but subtly alien, refined features, enhanced physiology, the bearing of a natural leader; ornate black-and-gold imperial vestments.

### 03 · Vah'Sumir
- **title:** `VAH'SUMIR` · **of** `Sumir Prime` · **ruler:** `4.0m` · **height:** `~3.3m`
- **subject:** Vah'Sumir Maximus, massive reptilian apex warriors 3.0-3.6 m tall with a digitigrade stance. Crested reptilian head, predatory physiology, thick bronze-grey armored hide over dense heavy musculature, built for domination and endurance.

### 04 · Ashari'i
- **title:** `ASHARI'I` · **of** `Ashar` · **ruler:** `3.0m` · **height:** `~2.6m`
- **subject:** Ashari'i Immortalis, an ancient immortal warrior caste 2.3-2.9 m tall. Pale ivory skin, elegant refined features, sharp cranial ridges; white-and-gold ceremonial armor of great age.

### 05 · Gor'nath Brute
- **title:** `GOR'NATH BRUTE` · **of** `Gor'nath` · **ruler:** `5.0m` · **height:** `~3.9m`
- **subject:** Gor'nath Colossus, a gigantic powerfully built species 3.5-4.2 m tall. Incredible strength, dense skeletal structure, a spiked cranial crest, brown armor-like skin plates across a hulking heavily muscled frame.

### 06 · Yurshak Brood
- **title:** `YURSHAK BROOD` · **of** `the Yurshak Hive Worlds` · **ruler:** `3.0m` · **height:** `~2.3m`
- **subject:** Yurshak Broodling, hive-evolved predators 2.0-2.6 m tall. Insectoid-reptilian morphology with mandibles, jutting horns, multiple sensory organs, dark chitinous plating and natural bladed weapons.

### 07 · Shal'mak Aerophage
- **title:** `SHAL'MAK AEROPHAGE` · **of** `the High Atmosphere` · **ruler:** `4.0m` · **height:** `~3.4m standing`
- **subject:** Shal'mak Dominus, aerial apex organisms shown standing with wings folded, ~3.0-3.8 m tall (6.0-7.5 m wingspan). Large membranous wings, a crested draconic head, light but strong sinewy anatomy adapted for high-speed aerial hunting.

### 08 · Oolak Luminary
- **title:** `OOLAK LUMINARY` · **of** `Oolak` · **ruler:** `3.0m` · **height:** `~2.45m`
- **subject:** Oolak Sapientis, bioluminescent beings 2.2-2.7 m tall. Translucent silvery-white bodies that produce natural light through glowing blue organic structures and luminous eyes; ancient, wise, highly spiritual.

### 09 · Threxx War-Smith
- **title:** `THREXX WAR-SMITH` · **of** `Thorexia Prime` · **ruler:** `4.0m` · **height:** `~2.9m`
- **subject:** Threxx Ferrum-Artifex, a forge-adapted engineer-warrior 2.6-3.2 m tall. A broad hulking humanoid with a crested draconic-reptilian head, encased in heavy industrial battle-plate of dark iron and weathered brass; rivets, pistons and cabling, a circular gear-and-cog chest emblem, layered pauldrons, a segmented armored kilt, and a mechanical claw-arm rising over one shoulder. Part living warrior, part walking forge.

### 10 · Razeen Flesh-Weaver
- **title:** `RAZEEN FLESH-WEAVER` · **of** `the Razeen Vaults` · **ruler:** `3.0m` · **height:** `~2.35m`
- **subject:** Razeen Artifex, bio-engineers and sculptors of flesh 2.1-2.6 m tall. Pale elegant humanoids with advanced sensory organs and branching root-like tendril growths extending from head and body; masters of organic architecture.

### 11 · Haal'tek Voidwalker
- **title:** `HAAL'TEK VOIDWALKER` · **of** `the Deep Void` · **ruler:** `4.0m` · **height:** `~3.4m`
- **subject:** Haal'tek Exuvia, void-adapted entities 3.0-3.8 m tall. Elongated dark blue-black carapaced bodies with a large smooth head and trailing tendrils, optimized for microgravity and extreme isolation between the stars.

### 12 · Aquorian
- **title:** `AQUORIAN` · **of** `the Pelagic Depths` · **ruler:** `3.0m` · **height:** `~2.45m`
- **subject:** Aquorian Pelagis, a deep-ocean bioluminescent species 2.2-2.7 m tall. Translucent crystalline blue skin, glowing internal neural lattices, trailing fin-sails and webbed digits, adapted to crushing pressure and electromagnetic sensing.

> **Tip:** image models often misspell baked-in title text (especially the
> apostrophe names — `Vah'Sumir`, `Ashari'i`, `Gor'nath`, `Shal'mak`,
> `Haal'tek`). Generate a few candidates and pick the clean one, or render the
> figure + ruler only and overlay the title text deterministically.

---

## See also

- [`../species.mjs`](../species.mjs) — canonical species catalog (source of truth)
- [`../generate.mjs`](../generate.mjs) — Stage 1: figure generation
- [`../annotate.mjs`](../annotate.mjs) — Stage 2: ruler + data block + seal compositing
- [`../assets/bestiary/README.md`](../assets/bestiary/README.md) — published plate slots
