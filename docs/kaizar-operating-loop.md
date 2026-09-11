# The Kaizar Operating Loop

Kerron specified Kaizar's Moltbook behavior as a 10-step pseudocode loop
(discover → prioritize → engage → community → publish → continuity stress
test → recruit specialists → expand knowledge → reputation → weekly report),
plus a set of hard rules (now in `docs/social-automation.md`'s "Hard rules"
section — read that first, it governs everything below). This document is the
translation of that spec into what's actually running.

## Important: most of this already existed

Before building anything new, a check of the *live* trigger prompts (not just
this doc) turned up something worth recording: an earlier autonomous session
had already rewritten the old "Trigger E" into something that implemented
most of steps 1-4 and 7-9 — broader topic discovery beyond just Iseldoran,
judgment-based prioritization, a research/canon-review split, a gated
continuity-check step almost verbatim matching Kerron's "do not rewrite the
canon" instruction. It referenced `content/moltbook-research.md` and a "Hard
rules" section in `docs/social-automation.md` — **neither of which existed
yet**; the trigger prompt had been written before the supporting files were
created, so every run was reading instructions that pointed at nothing. Both
now exist (this session created them) so that already-good logic actually
works, rather than being silently rebuilt as parallel, differently-named
files.

**What was genuinely missing** and is new in this version: step 5 (generating
an original post from Kerron's list of formats, rather than only drawing from
a fixed pre-written queue) and step 10 (the weekly report). Step 4 (create
`m/iseldoran`) was already a no-op — the submolt exists.

## What replaced what

**Trigger H — Kaizar Operating Loop** retires **Trigger A** (hourly
reply-to-own-post-activity heartbeat) and the old **Trigger E** (daily
discovery) — both disabled, not deleted, so their run history is preserved.
Trigger A's job (check Kaizar's own recent posts for new comments, reply) is
now step 0 of this loop, run every firing. Triggers B (X), C (Black Death
saga), and D (mechanical discovery/upvote/follow) are untouched — distinct
and complementary, not overlapping.

**Cadence: every 2 hours**, not the 6 hours a "fits the heavy steps"
calculation alone would suggest. Reasoning: step 0 (reply to your own post's
comments) is time-sensitive — a real conversation partner waiting 6 hours for
a reply is a worse outcome than the discovery/publish steps running a bit
more often than strictly necessary. The heavy, expensive steps (publish,
stress test, report) are gated by their own conditions below so the 2-hour
cadence doesn't mean 12 posts and 12 stress tests a day — most firings do
only step 0 plus a light discovery pass.

## The loop, as implemented

Each firing works through these in order. Steps marked *(gated)* check a
condition first and usually do nothing.

0. **Observe own activity** (every firing — this is old Trigger A's job,
   folded in here). Check Kaizar's recent posts for new comments; reply
   specifically to what was said, upvote genuinely good replies, mark
   notifications read.
1. **Discover** — semantic search across Kerron's topic list (AI agents,
   worldbuilding, history, military strategy, politics, philosophy, fiction,
   coding, knowledge graphs, wikis, agent memory), rotating query wording.
2. **Prioritize** — judgment-based ranking (relevance to Iseldoran, how
   interesting the agent is, whether the idea is useful, discussion quality,
   collaboration potential) — not a scored formula, an actual read.
3. **Engage** — top ~5: a specific, substantive reply where there's real
   value to add; useful non-canon ideas go to `content/moltbook-research.md`'s
   "Research Notes"; genuinely interesting authors get followed.
4. **Community** — check `m/iseldoran` exists before ever trying to create it
   (it does — this step is permanently a no-op check now).
5. **Publish** *(gated: at most once per day)* — generate an original post
   from Kerron's format list (historical document, military communique,
   character dossier, historical controversy, philosophical question,
   worldbuilding question, wiki discovery, "Ask Kaizar Anything", continuity
   challenge), grounded in real wiki content — never invented facts presented
   as canon. Distinct from Trigger C/Cassian's Ledger's fixed pre-written
   queues; this one is generated fresh each time from the actual wiki source.
6. **Continuity stress test** *(gated: Wednesdays only, and only with a
   genuinely good, specific question)* — post a real canon question inviting
   the community to find contradictions, logistics problems, or political
   consequences — explicitly "analyze, do not rewrite" (Kerron's own
   wording). Real findings go to "Canon Review Needed", never applied
   directly. Most Wednesdays may still skip this if there's nothing good to
   ask.
7. **Recruit specialists** — folded into steps 1-3, not a separate campaign.
   An agent with real expertise (history, military science, linguistics,
   economics, software engineering, knowledge graphs, sci-fi) gets weighted
   higher in prioritization and, if genuinely a fit, logged under "Interesting
   Agents / Potential Collaborators" in `content/moltbook-research.md`.
   **No DMs, no outreach campaigns** — this project already drew a hard line
   against templated/bulk outreach (see the "50,000 agents a day" / "120 DMs
   a day" refusals earlier in this project); recruiting specialists doesn't
   get an exception. A specialist worth collaborating with is won by a
   genuinely good public reply, not a cold pitch.
8. **Expand knowledge / the canon firewall** — the load-bearing rule,
   enforced structurally:
   - Non-canon discoveries → `content/moltbook-research.md`, "Research Notes".
   - Canon-affecting discoveries (a contradiction, a suggested addition, a
     stress-test finding) → the same file's "Canon Review Needed" section
     **only**. This trigger's own instructions never grant it permission to
     edit `IseldoranSagasWiki.jsx` or `species.mjs` — it is never told to,
     only to log. Kerron reviews and applies changes manually, the same way
     every other canon change in this repo has been made.
9. **Reputation** — persona baked into the prompt: intelligent, curious,
   precise, independent, non-spammy, respectful — the voice already
   established for Kaizar throughout this project (distinct from Cassian's
   Ledger's dry/archival tone).
10. **Weekly intelligence report** *(gated: Sundays only)* — compiled from
    that day's real data (recent engagement, `moltbook-research.md`'s current
    entries, notable conversations) into
    `reports/kaizar-report-YYYY-MM-DD.md`, committed to the repo — the
    **reliable** channel. The trigger also carries a Gmail connector grant so
    it can *additionally* try emailing the report to Kerron directly, as a
    best-effort bonus, not the primary path:

    **Why not email-only:** a durable trigger's fired session is unattended —
    no human is present to approve a tool call if one needs interactive
    permission, and external connectors don't always behave identically in a
    headless context. A silently-failed email means a report simply never
    arrives with no visible failure. A committed file in the repo can't fail
    silently the same way — it's git, so it's either there or the commit step
    errors loudly. Treat the repo file as ground truth for "did the report
    get made"; treat an email arriving as a nice-to-have.

## Files this loop reads and writes

| File | Written by | Purpose |
|---|---|---|
| `content/moltbook-research.md` | Steps 3, 6, 7, 8 | research notes, canon review queue, and collaborator list — three sections, one file, matching what the pre-existing trigger logic already expected |
| `reports/kaizar-report-YYYY-MM-DD.md` | Step 10 (weekly) | the intelligence report |
| `content/moltbook-engaged.json` | Steps 1-3 | dedup so repeat runs don't re-engage the same post (shared with the old Trigger E's history) |

## Cost / rate notes

Moltbook posting/commenting is free (no per-post charge, unlike X) — the only
cost here is Kaizar's normal usage. A 2-hour cadence with ~5 engagements per
run, one post at most per day, and the heavy steps gated to weekly, stays
comfortably under every platform rate limit (1 comment/20s, 50/day, 1
post/30min).
