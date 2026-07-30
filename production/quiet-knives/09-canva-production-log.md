# QUIET KNIVES — CANVA PRODUCTION LOG & CAPABILITY REPORT

*Honest record of what was actually done in Canva, what Canva can and cannot do for this brief, and the exact resume point. Nothing here is claimed as finished that is not. (Prompt §3: "Never pretend that an image, page, export, or audit has been completed when it has not.")*

---

## 1. WHAT IS REALLY BUILT IN CANVA (verified this session)

**Project folder:** `QUIET KNIVES — DEFINITIVE ILLUSTRATED COFFEE-TABLE BOOK`
- ID `FAHQ5_Q2T8E` — https://www.canva.com/folder/FAHQ5_Q2T8E

**Thirteen subfolders (all created, real):**

| Folder | ID |
|---|---|
| 00 Source and Canon | `FAHQ5waNbQc` |
| 01 Story Map | `FAHQ58c2GMo` |
| 02 Casting | `FAHQ55GcXSA` |
| 03 Character Bible | `FAHQ585eqVA` |
| 04 Architecture and Costume Bible | `FAHQ517Vlug` |
| 05 Scene Briefs | `FAHQ57m7Kq0` |
| 06 Raw Generations | `FAHQ50xCa6s` |
| 07 Approved Art | `FAHQ58mHLq4` |
| 08 Nameplated Portraits | `FAHQ56g6n4Q` |
| 09 Book Layout | `FAHQ5-fDKMc` |
| 10 Contact Sheets | `FAHQ54jA2wo` |
| 11 QA Reports | `FAHQ5xSa1wI` |
| 12 Final Exports | `FAHQ54iV2GI` |

**One genuine sample design generated and saved:**
- Generation job `4efd01a2-a9e9-4a5c-8058-5934b815b08f` returned **4 real poster candidates**.
- One saved as an editable design: **`DAHQ59IOZ4Y`** — "Poster - QUIET KNIVES"
  - View: https://www.canva.com/d/Hs3Qs5v1HgbTLLf
  - Edit: https://www.canva.com/d/9mcqjyBEmpQNo_G
  - Filed in **06 Raw Generations** (`FAHQ50xCa6s`).
- PNG export **succeeded** on Canva's side (job `91b67f5b-2c96-4ad3-9fc0-92bd6098c401`), but the download host `export-download.canva.com` is **blocked by this environment's egress policy (403 CONNECT)**, so the pixels could not be pulled into the sandbox for automated QA. The design is fully viewable in Canva via the links above. Per the proxy rules, policy denials are reported, not retried.

*This sample exists to demonstrate real capability truthfully — it is a Raw Generation, not Approved Art, and it is NOT counted toward the 105-image quota.*

---

## 2. HONEST CAPABILITY ASSESSMENT — WHY THE FULL 105-PLATE BOOK CANNOT BE TRUTHFULLY COMPLETED WITH THESE TOOLS

The prompt asks for ≥105 unique, approved, continuity-locked, ultra-photorealistic IMAX-grade plates with tracked character faces, generational ageing, and print-CMYK export. The Canva MCP tools available this session are:

- `generate-design` — Canva **Magic Design**: produces *layout* candidates (posters, docs, social, reports) that combine Canva's stock/AI imagery with templated composition. It is **not** a controllable photoreal concept-art engine. It cannot:
  - hold a **consistent character face** across many images (no reference-image identity lock exposed here);
  - render **specific continuity** (a wound from scene N present in scene N+1; Ishak's progressive withering; Ashim's sapphire-eyed Lattice stage);
  - reliably keep **text out of the art** or heraldry correct;
  - reproduce a **real actor's likeness** (correctly refused by policy — the brief itself mandates original performers instead).
- `create-design-from-candidate`, `edit-design`, `export-design`, folder tools — real and working, but they operate on Magic-Design output, not on a bespoke art pipeline.
- **No CMYK export.** Canva provides PDF/PNG/JPG/PPTX; there is no controllable CMYK conversion. A true-CMYK print master cannot be claimed (prompt §15 anticipates exactly this).

**Conclusion (stated plainly):** A genuinely continuity-locked, 105-plate, 260–380-page photoreal coffee-table book is **beyond what Canva's Magic Design can truthfully deliver**, no matter how many generations are run. Producing it to the brief's standard requires a dedicated image model with reference-image/identity control (character LoRAs or equivalent), human art-direction iteration per plate, and a prepress path for CMYK — then Canva (or InDesign) for typesetting the approved plates. The written production bible in this repo is the correct, faithful foundation for that pipeline whenever those tools are available.

---

## 3. WHAT *CAN* BE DONE IN CANVA NOW (achievable next steps, not yet done)

These are truthful, in-scope Canva actions that do not depend on the missing art pipeline:

1. **Flow the full manuscript text** into Canva Docs (front matter, all four Parts, Companion Records, appendices) using `generate-design` with `design_type: "doc"`, `verbatim: true`. This builds the *text spine* of the book faithfully.
2. **Build the locked templates** (`TPL_*` from the layout blueprint) as Canva designs to duplicate.
3. **Typeset the nameplate lockups, captions, and diagram/timeline/family-tree plates** — these are typographic/vector, well within Canva's real strengths, and can be genuinely finished.
4. **Assemble contact sheets and index pages.**
5. Use whatever **Canva photoreal generation** can honestly achieve for *mood/environment* plates (no character-identity dependency), clearly marked as Raw until human-approved.

Steps 2–4 are recommended as the next honest Canva batch because they can be *completed*, not merely attempted.

---

## 4. RESUME POINTER (so work continues from the ledger, not from scratch)

- **Canon + planning:** COMPLETE, in `production/quiet-knives/` (this repo).
- **Casting dossier (25):** authored → `03-casting-dossier.md`.
- **Image ledger (105 rows) + scene briefs (46):** authored → `04-image-ledger.md`, `05-scene-briefs.md`.
- **Canva project skeleton:** COMPLETE (folders above).
- **Next incomplete batch:** §3 steps 2–4 (templates, nameplates, diagrams, text flow) — do these before any character-plate generation.
- **Blocked batch:** the 105 character/scene photoreal plates — blocked on tooling per §2; do not mark any as "approved" until real art exists and passes the QA gates.

Nothing downstream should treat a Raw Generation or a template as an approved, quota-counting plate.
