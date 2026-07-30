# QUIET KNIVES — BOOK LAYOUT BLUEPRINT

*Gate 6 reference. The Canva book must contain the **full supplied manuscript**, not a synopsis or selection. This blueprint maps every part, record, appendix, and matter section to pages, templates, and art. Derived from prompt §12–§13 and the Version 6 contents.*

---

## 1. FORMAT DECISION

- **Chosen trim: 12 × 12 in square** (premium large format), per the prompt's stated preference.
- **Fallback:** 11 × 14 in portrait *only if* full-text readability materially demands it. Decision rule: typeset three representative pages (a dense manuscript page, a full-page plate + caption, a Companion Record opener) in both trims; if the square trim forces body text below comfortable measure, switch to 11×14 for the whole book. **Test first, choose once, keep throughout.**
- Page target: **≈ 260–380 pp.**
- 300 DPI source art at final size wherever possible; full bleed where appropriate; mirrored margins with a generous inner gutter; section openers on **recto** pages; no important face or text crossing the gutter; consistent folios; embedded or safely-substituted fonts; no clipped captions, stretched images, widows, or orphans.

---

## 2. LOCKED CANVA TEMPLATES (build once, duplicate — never rebuild)

| Template | Purpose |
|---|---|
| `TPL_TITLE` | Half-title, title page, part openers |
| `TPL_CAST_PLATE` | Full-page portrait + nameplate lockup |
| `TPL_FULL_SCENE` | Single full-page scene + caption block |
| `TPL_SPREAD` | Double-page battle/panorama + battle caption |
| `TPL_RECORD_OPENER` | Companion Record intimate archival opener |
| `TPL_ARTEFACT` | Relic/ship/weapon plate + spec caption |
| `TPL_DIAGRAM` | Map / timeline / family-tree / architecture |
| `TPL_BODY` | Classical-serif manuscript body text |
| `TPL_CAPTION` | Restrained sans caption + source + continuity note |
| `TPL_INDEX` | Back-matter index columns |

**Every major image carries:** (1) scene title; (2) 40–120-word caption on dramatic/thematic significance; (3) manuscript source; (4) short verified quotation where useful; (5) characters + location; (6) approximate chronological position; (7) continuity note. **Battle captions additionally name:** attacker, defender, objective, significance, consequence.

Original manuscript text must be typographically distinguished from new captions/editorial notes (e.g. body serif vs. sans caption rules + a hairline rule or tint block on editorial matter). Every quotation verified against source and speaker.

---

## 3. FULL PAGINATION MAP

### FRONT MATTER
1. Half-title
2. Illustrated title page / frontispiece (COVER plate)
3. Copyright (verbatim from V6: PCM GenCon Group; ISBN 978-1-963407-89-4; First Edition 2026; fiction disclaimer)
4. Dedication (verbatim: *"For the sons who were sent instead of seen. And for the fathers who understand too late."*)
5. Epigraph (verbatim: the two Sarimus lines — *"Power is not given…"* / *"Before the throne fell…"*)
6. **Hard-coded Contents** (mirrors the V6 contents; page-numbered, not auto-generated)
7. Empire map (DIAG plate)
8. Dramatis Personae (condensed from the Casting Dossier; nameplate style)
9. **Fan-casting disclaimer** (unofficial concept; no actor contacted/attached)
10. "A Note from the Scribe" (verbatim V6 opening)

### PART ONE — THE ORIGINAL RECORD (full text, dense)
- Monologue of Nashim XII (Baths of Kasparia) — opens with EVENT_001 plate
- The Song of Jovarian · Acts I–VI
- The Full Jovarian Cycle · Books I–XXII — Jovarian-cycle plates placed densely through the acts/books (EVENT_002–023)
- The Vexori War · Acts I–VI
- The Pursuit of Ishak · Acts I–VI (SCENE plates: theft, consumption, pursuit, empty scabbard)
- Act VIII · The Crown That Did Not Fit (Laurentis antechamber/coronation; Goliath)
- Act IX · The War of Quiet Knives (Bashir/Hiram; Kalia/Bashir; the three-tier architecture)
- Act X · The Return of Ashim (the Tower in the Rain; the false Ashim)
- Act XI · The First Rebellion Against Laurentis (the Hall of Unity)
- *Cast plates introduced as each character becomes important.*

### PART TWO — THE COMPANION RECORDS (each gets its own illustrated opener)
- A Note on This Companion
- Record I · The Song of Jovarian the Red
- Record II · The Halls of Ashim
- Record III · The Making of the Mask
- Record IV · The Audit of Nashim
- Record V · The Antechamber
- Record VI · The Tower in the Rain
- Record VII · What the Sword Is
- Record VIII · The Architecture of the Quiet Knives
- Record IX · The First Year
- Record X · The Hall of Unity
- Record XI · The Century Between (facing the 93-year spread)
- Record XII · The Coronation of the Mud
- *Openers use `TPL_RECORD_OPENER`: intimate archival layouts — notebooks, baths, rain, corridors, sanctuaries, lamps, hands, scars, private rooms.*

### PART THREE — THE CODE OF MARTYRS APPENDICES (full text + diagrams; never replaces original text)
- Book One · The Sapphire Eye
- Book Two · The Withered King
- Book Three · The Winnowing of Maldorus
- Book Four · The Chronicles of the Glass Eye
- *Uses ART/DIAG plates: Sword & Lattice imagery, fleet spreads, the spear, family-tree, timelines, character plates, visual summaries.*

### PART FOUR — SAGA APPENDICES (complete)
- Appendix A · Saga Synopsis
- Appendix B · Character Biographies (paired with cast plates)
- Appendix C · Core Themes (paired with thematic plates)
- Appendix D · The Canonical Family Tree (DIAG_001 full-page)
- Appendix E · Glossary of Terms (paired with artefact plates)

### BACK MATTER
- Image index
- Character index
- Location index
- Chronology index
- Cast index
- Quotation index (each verified to source + speaker)
- Production notes
- Fan-casting disclaimer (repeated)
- Acknowledgements
- **Unresolved-Ambiguities report** (the one-pager)
- Final endpaper (COVER plate)

---

## 4. ART PLACEMENT PRINCIPLE

Section openers on recto; full-page plates face the text they illustrate; battle spreads at the climax of their act (Nostavius's death; the Ashim–Jovarian duel; the siege); Companion Record openers set an intimate key before the record's prose; artefact/diagram plates cluster in Parts Three and Four. No plate reused; no two adjacent spreads sharing a composition.

---

## 5. STATE OF THE LAYOUT (honest)

This blueprint is complete and build-ready. The **Canva book assembly itself is not yet built** — it depends on the 105 approved plates, which depend on an image-generation pipeline Canva's Magic-Design tool cannot fulfil at continuity-locked photoreal quality (see `09-canva-production-log.md`). The manuscript text, contents, dramatis personae, and all editorial matter *can* be flowed into Canva now; the plates are the blocker. Resume order is recorded in the production log.
