# Master Operating System: Agentic Loop
### Cross-Platform Implementation for Claude, ChatGPT, and Gemini

**Edition 1, Version 1**
**Date:** September 15, 2026
**Time:** 23:40

---

## 1. Purpose

The Master Operating System, as written, is a static instruction set: twenty-seven sections covering editorial standard, canon protection, version control, and output discipline. A static instruction set tells a model *what* to value. It does not tell it *when* to check, *when* to stop and ask, or *when* a piece of work is actually done. The loop below turns the instruction set into a running process: six stages an assistant works through on every substantial task, with defined pause conditions and one legitimate loop-back edge. It is model-agnostic. The same six stages run whether the underlying engine is Claude, ChatGPT, or Gemini; only the setup mechanics differ, covered in Section 4.

---

## 2. The Six-Stage Loop

```
STAGE 0: INTAKE
   |
   v
STAGE 1: CANON / DATA CHECK  ---(material conflict found)---> PAUSE, ask user, wait
   |
   |(no conflict, or conflict resolved)
   v
STAGE 2: CLASSIFICATION (tag every fact by source and certainty)
   |
   v
STAGE 3: EXECUTION (produce the deliverable)
   |
   v
STAGE 4: AUDIT PASSES (task-appropriate checklist)
   |
   v
STAGE 5: VERSION + DELIVERY (metadata, change log, word count, hand off)
   |
   +----> loops back to STAGE 0 on the next request
```

**Stage 0, Intake.** Read the request. Identify the task type (manuscript edit, canon lore, business or financial document, game or application specification, marketing plan), the scope (a surgical edit versus new creation), and the deliverable format (chat reply, file, table, script).

**Stage 1, Canon and Data Check.** Before drafting, check the request against whatever record of truth applies: locked canon for fiction, prior approved figures for a financial model, the current file version for an edit. This stage produces no visible output. It produces a single yes-or-no: does the request conflict with something already established?
- No conflict: move to Stage 2.
- A material conflict (identity, chronology, a financial result, a technical result): stop the loop here, state the two versions plainly, and wait for the user's answer before moving on.
- A cosmetic issue (spelling, formatting, a minor slip): fix it in passing and continue without a pause.

**Stage 2, Classification.** Tag every fact that will appear in the output: VERIFIED FACT, USER-SUPPLIED FACT, USER-SUPPLIED ASSUMPTION, MODEL ASSUMPTION, ESTIMATE, CALCULATION, or UNKNOWN. This happens before the draft is written, not as cleanup after, so an estimate never gets presented as a confirmed figure in the first place.

**Stage 3, Execution.** Produce the deliverable. For a surgical edit, touch only what the instruction requires and repair the direct consequences of that change. For new material, build against the classification set in Stage 2. For fiction, the prose restrictions (banned vocabulary and phrasing, the dead-stop rule, the article rule) are applied as the draft is written, not bolted on afterward.

**Stage 4, Audit Passes.** Run the checklist that fits the task before showing the output. Fiction gets the ten passes from Section 10 of the Operating System (repetition, sentence rhythm, dialogue, character voice, exposition, sensory detail, dead-stop, literary authenticity, publisher quality, read-aloud cadence). Business, financial, or technical work gets the Section 25 checklist (canon intact, figures reconcile, assumptions identified, metadata correct, version advanced, change log present).

**Stage 5, Version and Delivery.** Attach edition and version metadata, a change log entry, and the word count footer. Deliver the work. If the task belongs to a longer project, this stage's version record becomes the "current file version" that Stage 1 checks against on the next request.

**The loop-back edge.** A contradiction caught in Stage 1 on a later request can reopen Stage 5's metadata from an earlier delivery; a fact that gets superseded needs its change log updated at the source, not just noted going forward. This is the one place the loop legitimately runs backward.

---

## 3. Pause Conditions

The loop stops and waits for the user in exactly three situations:
1. A material contradiction surfaces in Stage 1.
2. A needed fact has no source to classify it against in Stage 2; it gets marked UNKNOWN rather than invented.
3. A request would silently overwrite an established version with no change log entry.

Everywhere else, the six stages run to completion in a single pass without a check-in.

---

## 4. Platform Setup

| | Claude | ChatGPT | Gemini |
|---|---|---|---|
| Where the loop lives | Project custom instructions, or pasted at the top of a long-running chat | Custom GPT "Instructions" field, or Custom Instructions in Settings | "Gem" system instructions, or a saved system prompt |
| Practical length limit | Generous; the full 27-section document plus this loop fits comfortably | Roughly 8,000 characters for a Custom GPT; the full document may need trimming to its operative rules, with the rest referenced as an uploaded file the GPT can read | Similarly limited; heavy documents work better uploaded as a reference file than pasted whole |
| Cross-session memory | Project knowledge and this platform's memory feature can hold locked canon, prior versions, and open flags between sessions | Memory (when enabled) and file uploads inside a Custom GPT serve the same purpose | Saved files inside a Gem, or a connected Drive document, serve the same purpose |
| Version control artifacts | Chat-native file creation and artifacts are well suited to Stage 5 output with embedded metadata | Canvas or file responses serve the same role | Canvas equivalent or generated documents serve the same role |
| Practical gap | None significant | The instruction file is large enough that Stage 1's "check against locked canon" may need the canon record uploaded as a separate reference file rather than kept in the instructions field itself | Same gap as ChatGPT; keep the operative loop in system instructions and the canon record as an attached reference |

**The one thing that does not transfer automatically:** none of the three platforms runs Stage 1 on its own initiative unless told to. A generic "continue the project" message will not, by itself, trigger a canon check on any of the three engines. The instructions should say outright: *before drafting anything substantial, check it against the established record and flag a conflict before proceeding.* Without that explicit trigger, all three platforms tend to default straight to Stage 3, skipping the check that the whole system depends on.

---

## 5. Known Failure Modes

- **Silent canon drift.** Over a long project, a model repeats an earlier invention (its own prior guess, not a locked fact) as though it were established. Guard: Stage 1 checks against the *approved record*, never against what the model itself said last time. A prior AI-generated statement is not canon merely because it appeared earlier in the conversation.
- **Skipped audit under time pressure.** A long task tempts the assistant to jump from Stage 3 straight to Stage 5. Guard: treat Stage 4 as non-optional for any deliverable tagged "formal" in Stage 0.
- **Version metadata forgotten on minor edits.** A one-line fix gets delivered without an edition bump or change log entry, breaking the record Stage 1 relies on next time. Guard: Stage 5 runs even on small, surgical edits, at whatever weight the edit warrants.

---

## 6. How This Repository Already Runs the Loop

This document is the general-purpose statement of the loop. One concrete implementation of it already exists here, in `docs/kaizar-operating-loop.md` — the autonomous Moltbook trigger loop. The mapping is worth recording, because the two documents describe the same discipline at different altitudes:

| Stage | Where it appears in the Kaizar loop |
|---|---|
| Stage 1, canon check | Step 8's canon firewall: a discovery affecting canon goes to `content/moltbook-research.md`'s "Canon Review Needed" section and stops there |
| Stage 2, classification | The same firewall's split between "Research Notes" (unverified, non-canon) and canon-affecting findings |
| Stage 3, execution | Steps 0-7, the engagement and publishing work |
| Stage 4, audit | Step 6's continuity stress test, explicitly "analyze, do not rewrite" |
| Stage 5, version and delivery | Step 10's weekly report committed to `reports/` as a dated file, so the record cannot fail silently |

The pause condition that loop enforces most strictly is the third one in Section 3: no trigger prompt in this repository is ever granted permission to edit `IseldoranSagasWiki.jsx` or `species.mjs` directly. An established fact is never overwritten without a human reviewing the change.

---

**Change Log**

*Edition 1, Version 1 — September 15, 2026.* Initial conversion of the Master Operating System into a six-stage agentic loop, with pause conditions, a platform-setup table for Claude, ChatGPT, and Gemini, and known failure modes. Section 6 added on filing to the repository, mapping the general loop onto the existing Kaizar operating loop already running here.

**Author:** KS Pierre
**Publisher:** KS Pierre
**Contributor:** Claude
