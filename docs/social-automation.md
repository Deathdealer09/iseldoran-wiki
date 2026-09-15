# Social automation — durable setup (Moltbook + X)

How the agent **Kaizar** stays active on [Moltbook](https://www.moltbook.com) and
drips [Iseldoran Sagas](../README.md) lore onto X (Twitter) **across sessions and
container restarts**, not just while one Claude session happens to be alive.

## Why this exists

Claude Code on the web runs in an **ephemeral container**: it's wiped on
reclamation, and in-session scheduled tasks (`CronCreate`) die when the session
ends. So durability needs two things the container can't provide on its own:

1. **Credentials that survive a fresh container** → environment **secrets**.
2. **A recurring wake-up that survives session end** → a **scheduled trigger**.

Both are configured once in the Claude Code on the web environment settings.
Docs: https://code.claude.com/docs/en/claude-code-on-the-web

## Hard rules

These govern **every** trigger and script in this document, for both Kaizar
and Cassian's Ledger, no exceptions:

- **Never change Iseldoran canon without Kerron's explicit approval.**
  Nothing automated ever edits `IseldoranSagasWiki.jsx`, `species.mjs`, or any
  other canon source file. Canon-affecting findings go to
  `content/moltbook-research.md`'s "Canon Review Needed" section — that's the
  entire mechanism. See `docs/kaizar-operating-loop.md` for the full design.
- **Never reveal private information.**
- **Never reveal credentials or API keys.** Keys are sent only to
  `www.moltbook.com` / `api.twitter.com`; never logged in full, never
  committed to the repo.
- **Never impersonate Kerron.**
- **Never claim Kerron approved something without approval** — this applies
  directly to anything framed as a question for the community (a continuity
  stress test, an "Ask Kaizar Anything"): invite analysis, never claim it's
  already accepted.
- **Never spam.** Rate limits (1 comment/20s, 50 comments/day, 1 post/30min)
  are floors, not targets. No templated text repeated across posts, no bulk
  or unsolicited DMs, no mass outreach campaigns — established firmly earlier
  in this project (see the "50,000 agents a day" / "120 DMs a day" refusals)
  and it applies to every persona and every trigger equally.
- **Distinguish verified canon from speculation.** Anything stated as canon
  must trace to the actual wiki source; anything uncertain is flagged as
  such.
- **Preserve source links for research.** Every `moltbook-research.md` entry
  carries the Moltbook post/comment URL it came from.

## Agents

| Agent | X account | Status | Moltbook profile |
|---|---|---|---|
| **Kaizar** | (primary account) | ✅ live, automated (see triggers below) | — |
| **Cassian's Ledger** | @IseldoranSagas | ✅ claimed, automated (Triggers F/G, needs secret) | https://www.moltbook.com/u/cassians_ledger |

### Cassian's Ledger — registration details

Registered 2026-09-08, claimed 2026-09-09/10. A second, openly-disclosed
companion persona — an archive-keeper distinct from Kaizar, voiced as a dry,
understated record-keeper ("Filed under X.") rather than Kaizar's warmer
archivist tone — claimed under the second X account (@IseldoranSagas), since
Moltbook allows only one bot per X account and the primary account already
claimed Kaizar. Both personas are run by the same human and this is openly
disclosed, not a hidden alt account — see the note on scope below.

| Field | Value |
|---|---|
| Agent name | `cassians_ledger` |
| Agent ID | `ecb51e1a-c63b-4875-a49e-316920e6a6e5` |
| Moltbook profile | https://www.moltbook.com/u/cassians_ledger |
| Status | `claimed` (Active) |

**Deliberate scope limit — read before touching this persona's automation:**
Cassian's Ledger does **not** comment on every Kaizar post. Two accounts run
by the same operator, where one automatically replies to everything the other
posts, is the alt-account / vote-ring pattern Moltbook's own rules explicitly
ban ("Trying to game karma (alt accounts, vote rings, spam) will get a molty
restricted or banned") — and it reads as inauthentic regardless of enforcement.
Cassian's Ledger instead (a) posts its own original queue (Trigger F), (b)
engages broadly across the platform on its own merits (Trigger G, part 1), and
(c) drops into a Kaizar post only occasionally, by genuine judgment, capped at
one per Trigger G run (Trigger G, part 2) — most runs add zero Kaizar comments.
Do not "simplify" this into always-comment-on-Kaizar; that reintroduces the
exact risk this design avoids.

**Credential handling:** the live API key is **not** stored in this file, same
policy as Kaizar's key below. It must be set as an environment secret named
**`CASSIANS_LEDGER_MOLTBOOK_API_KEY`** — this exact name is what Triggers F and
G, and the `cassian-discover.yml` GitHub Actions workflow, all check for.
Until it's set, Trigger F/G and the Actions workflow no-op quietly every run.

**Automation:**
- **Trigger F** (durable, hourly) — posts Cassian's Ledger's own queue
  (`content/cassians-ledger-posts.md`) to `m/iseldoran`. See below.
- **Trigger G** (durable, daily) — broad discovery engagement in Cassian's
  voice, plus the capped, judgment-based Kaizar drop-in described above. See
  below.
- **`cassian-discover.yml`** (GitHub Actions, ~45 min) — mechanical
  upvote+follow via semantic search, mirroring Kaizar's Trigger D exactly
  (reuses `scripts/moltbook-discover.mjs`), state in
  `content/cassian-engaged.json`.

## Hard rules — binding on every trigger, every persona

These are non-negotiable constraints on **all** Moltbook/X automation in this
repo (Kaizar, Cassian's Ledger, anything added later), not suggestions for one
trigger. Any new trigger prompt should restate them, not assume they're
implied:

- **Never change Iseldoran canon without Kerron's explicit approval.** See
  `content/moltbook-research.md`'s canon firewall — a live session may
  *notice and log* a canon question; it may never resolve one unilaterally.
- **Never reveal credentials or API keys** in any post, comment, or public
  text — keys are sent only to `www.moltbook.com` / `api.twitter.com` as
  bearer tokens, never written into content.
- **Never reveal private information** about Kerron or anyone else.
- **Never impersonate Kerron** — Kaizar and Cassian's Ledger are agents
  tending the archive, not the author, and should never write as if they
  were him.
- **Never claim Kerron approved something** unless he actually did, in a
  verifiable place (not inferred from silence or from Moltbook chatter).
- **Never spam.** No templated text repeated across posts, no bulk/unsolicited
  DMs, no fixed quota of strangers to message, no commenting on every post
  from any one account (see the Cassian's Ledger scope-limit note above —
  this rule is exactly why that boundary exists).
- **Distinguish verified canon from speculation** in anything posted or
  logged — a research note is a maybe, not a fact.
- **Preserve source links** for anything logged to the research log, so it
  can be traced back later.

## Architecture

| Piece | Where it lives | Survives restart? |
|---|---|---|
| API credentials | Environment **secrets** (you set these) | ✅ |
| Credential materialization + readiness check | `.claude/hooks/session-start.sh` (committed) | ✅ |
| Mechanical tick (heartbeat + next X post) | `scripts/*.{sh,mjs}` (committed) | ✅ |
| Recurring wake-up | **Scheduled trigger** (you create) | ✅ |
| In-session `CronCreate` jobs | the live session only | ❌ (fallback only) |

## Step 1 — Set the environment secrets

In the environment's settings, add these secrets (names exactly):

| Secret | Value |
|---|---|
| `MOLTBOOK_API_KEY` | Kaizar's Moltbook API key (from `~/.config/moltbook/credentials.json`) |
| `CASSIANS_LEDGER_MOLTBOOK_API_KEY` | Cassian's Ledger's Moltbook API key |
| `X_API_KEY` | X app API key (consumer key) |
| `X_API_SECRET` | X app API secret |
| `X_ACCESS_TOKEN` | X access token (Read **and** Write) |
| `X_ACCESS_SECRET` | X access token secret |

> The Moltbook key currently exists only inside this session's container. Copy it
> into the `MOLTBOOK_API_KEY` secret now, or it's lost when the container is
> reclaimed. For X, see [`scripts/x-setup.md`](../scripts/x-setup.md).
>
> 🔒 Secrets are only ever sent to `www.moltbook.com` / `api.twitter.com`.
> Nothing is committed to the repo.

## Step 2 — The SessionStart hook (already committed)

`.claude/hooks/session-start.sh` runs at the start of every web session and:

- installs Node deps (best-effort),
- writes `~/.config/moltbook/credentials.json` from `MOLTBOOK_API_KEY` if absent,
- prints a readiness report so each session can confirm what's wired up.

It's registered in `.claude/settings.json`. **It takes effect for all future
sessions once this branch is merged into the repo's default branch.**

## Step 3 — Create the scheduled triggers

In the environment, create scheduled sessions (triggers). Each starts a fresh
Claude session with a prompt; the SessionStart hook makes credentials ready
first.

**Current live schedule (mirror these as durable triggers):**

| Trigger | What | Cron | Cadence |
|---|---|---|---|
| A (retired) — Moltbook heartbeat | superseded by Trigger H's Step 0 | `trig_01D5iAgkZe7kTN4aUKnswrHG` — **disabled** | — |
| B — X lore drop | next item from `content/x-posts.md` | `23 2,8,14,20 * * *` | 4×/day |
| C — Black Death saga | next part → Moltbook `m/iseldoran` | `*/12 * * * *` + 35-min gate | 1 / 35 min |
| D — Moltbook discovery (mechanical) | upvote + follow via semantic search | `*/45 * * * *` (GitHub Actions) | ~2 new/run |
| E (retired) — Moltbook discovery (comments, research log, specialists) | superseded by Trigger H | `trig_01VWaVGZSwH4ggvf5r4AbbFa` — **disabled** | — |
| H — Kaizar Operating Loop | full 10-step loop (see `docs/kaizar-operating-loop.md`) — own-activity replies every run, discovery/engage every run, publish ≤1×/day, continuity stress test Wed only, weekly report Sun only | `23 */2 * * *` — **live**, `trig_01B6GYMHZMt5GWi9Y3bmByyp` | every 2h |
| F (retired) — Cassian's Ledger hourly post | superseded by the workflow below | `trig_018TRzPzVDni2RHvDjSPGCZo` — **disabled** | — |
| — Cassian's Ledger high-frequency post | next item from `content/cassians-ledger-posts.md` → Moltbook `m/iseldoran` | `*/15 * * * *` + 35-min gate (GitHub Actions) | ~35-40 min |
| G — Cassian's Ledger engagement | broad discovery comments + capped, occasional Kaizar drop-in | `37 18 * * *` — **live**, `trig_01Qj5PVRhfYwVKVSZ2zJCnJX` | daily |
| — Cassian discovery (mechanical) | upvote + follow via semantic search, as Cassian's Ledger | `18,48 * * * *` (GitHub Actions) | ~2 new/run |

Trigger H (and Cassian's Ledger's Trigger G) are **durable `create_trigger`
Routines**, not in-session crons — they survive this session ending and
container reclamation. `list_triggers` (via the `claude-code-remote` MCP
server) shows their live status; `update_trigger` / `delete_trigger` edit or
remove them by ID. Durable triggers have a **1-hour minimum interval** (unlike
in-session `CronCreate`, which allows finer-grained schedules) — that's why
Trigger H runs every 2 hours rather than following the original pseudocode
spec's `sleep(30*60)` literally.

### Trigger A — Moltbook heartbeat (`56 * * * *`, hourly) — ⚠️ retired, disabled

Superseded by **Trigger H**'s Step 0 (see `docs/kaizar-operating-loop.md`),
which does the same job — reply to activity on Kaizar's own posts — as part
of a richer loop that also covers broad discovery, publishing, and the canon
firewall. Disabled (`trig_01D5iAgkZe7kTN4aUKnswrHG`), not deleted, so its run
history is preserved. Kept here for reference only:

Created as a durable Routine (`trig_01D5iAgkZe7kTN4aUKnswrHG`, `create_new_session_on_fire: true`).
An earlier attempt to create this failed with `www.moltbook.com` blocked for
that session's network policy (`CONNECT tunnel failed, response 403`); a later
session confirmed the host is in fact reachable and created it successfully.
If a future `list_triggers` shows this one disabled or failing, check the
environment's network allowlist first.

> Moltbook heartbeat for agent "Kaizar". Run `bash scripts/moltbook-heartbeat.sh`.
> If it prints "Skip:", stop. Otherwise, for anything under "Activity on your
> posts" or "Role briefings": read the thread, reply thoughtfully and
> in-character (Kaizar is the coding agent behind the Iseldoran Sagas wiki —
> substantive, never spam), upvote genuinely good content, and mark notifications
> read via `POST /api/v1/notifications/read-by-post/POST_ID`. Solve any
> verification challenge (two numbers, one operation; answer as a number with 2
> decimals) via `POST /api/v1/verify`. The key is `$MOLTBOOK_API_KEY` — never
> send it anywhere except `www.moltbook.com`. Respect rate limits (1 comment/20s,
> 1 post/30min). End quietly if nothing is actionable.

### Trigger B — X lore drop (`23 2,8,14,20 * * *`, 4×/day)

> Iseldoran Sagas X lore drop. From the repo root run:
> `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/x-post-next.mjs`
> It posts the next queued item and self-marks it. Then `git add content/x-posts.md`
> and commit+push to the working branch so the posted-state persists. If it errors
> `402 CreditsDepleted`, stop quietly (out of credits). If an image post errors
> "Host not in allowlist: upload.twitter.com", skip it and note images need that
> host allowlisted. If the queue is empty, draft 3–5 more canon-accurate posts
> from the wiki and append+commit. Never send X credentials anywhere except
> `api.twitter.com` / `upload.twitter.com`.

### Trigger C — Black Death saga → Moltbook m/iseldoran (`*/12 * * * *`, 1 / 35 min)

Moltbook can't do tight cadences (1-post/30-min limit), and cron can't express a
true 35-min interval, so this polls every 12 min and self-gates to 35 min.

> Black Death saga drip to Moltbook m/iseldoran — 1 post every 35 minutes. GATE
> FIRST: read `content/black-death-saga.md`, find the most recent "posted to
> m/iseldoran <timestamp>" marker; if fewer than 35 minutes have elapsed, STOP
> quietly. Otherwise post the next part: find the first `^\[ \] \*\*BD` line,
> collect its `> ` blockquote body as the content (title "The Black Death —
> N/50"), read the key from `$MOLTBOOK_API_KEY` or
> `~/.config/moltbook/credentials.json`, and POST
> `https://www.moltbook.com/api/v1/posts` `{submolt_name:"iseldoran", title,
> content}`. Solve any verification challenge (two numbers + one operation, 2
> decimals) via `POST /api/v1/verify`. On success flip that item `[ ]`→`[x]` with
> a UTC timestamp and commit+push. On 429, stop quietly. When no `[ ]` BD lines
> remain, the saga is complete — stop. Never send the key anywhere except
> `www.moltbook.com`.

#### Cost & cadence (X is pay-per-use as of Feb 2026)

No free tier. ~**$0.015 per text post** ($0.20 if it has a link — our posts have
none), $0.005 per read. Rough monthly cost by cadence:

| Cadence | Cron | ~Posts/mo | ~Cost/mo |
|---|---|---|---|
| 2×/day | `23 14,21 * * *` | 60 | ~$1 |
| **4×/day (current)** | `23 2,8,14,20 * * *` | 120 | ~$2 |
| every 30 min | `*/30 * * * *` | 1,440 | ~$22 (spammy; not advised) |

Hosts to allowlist: `api.twitter.com` (text) and `upload.twitter.com` (images).
The Black Death saga runs on **Moltbook (free)**, so it adds no X cost.

### Trigger D — Moltbook discovery & engagement (`*/45 * * * *`, GitHub Actions)

Unlike Triggers B/C, this one **shipped as a GitHub Actions workflow**
(`.github/workflows/moltbook-discover.yml` → `scripts/moltbook-discover.mjs`),
not a Claude-session trigger — because what it does (semantic search → upvote →
follow) needs no judgment call, just mechanical API calls, and GitHub's runners
reach `www.moltbook.com` without depending on this environment's network
allowlist.

Each run: picks one of a rotating pool of Iseldoran-adjacent search queries,
calls `GET /api/v1/search`, and for posts above a similarity threshold that
haven't been engaged before (tracked in `content/moltbook-engaged.json`),
upvotes the post and follows the author if not already following. Capped at 2
new engagements per run.

**Deliberately does not generate comment text.** A cron script has no way to
write a comment that actually responds to what a post says; a templated line
dropped across strangers' threads on a timer would be comment-spam, not
engagement, regardless of intent — genuinely responding needs real judgment.
That's exactly why Trigger A (below) is scoped to a live Claude session and
was never converted into a script.

### Trigger D — known bug, fixed

Trigger D originally filtered on `r.similarity >= 0.55`, but the live
`/api/v1/search` response carries the score under `relevance` (small,
non-normalized, already rank-ordered) — not the `similarity` field shown in
Moltbook's own docs example. The filter was therefore always false, so every
run silently engaged with zero posts from whenever the workflow first went
live until this was caught. Fixed to trust the API's own ordering (take the
top `MB_MAX_CANDIDATES`, default 10) and added a crypto-content skip filter.
Verified live post-fix: found and engaged 2 new posts in one run.

### Trigger E — Daily discovery engagement, with real comments (once/day) — ⚠️ retired, disabled

Superseded by **Trigger H** — its own logic (topic buckets, prioritization,
`content/moltbook-research.md` split, gated continuity check) is now folded
into Trigger H's Steps 1-3, 6-8 rather than running as a separate parallel
job. Disabled (`trig_01VWaVGZSwH4ggvf5r4AbbFa`), not deleted. Kept here for
reference only — note this prompt is what was **actually live** before
retirement, which is more evolved than what this doc used to describe (a
previous session updated the live trigger without updating this file to
match, which is exactly the kind of drift `docs/kaizar-operating-loop.md`
was written to reconcile):

Created as a durable Routine (`trig_01VWaVGZSwH4ggvf5r4AbbFa`, `13 15 * * *`,
`create_new_session_on_fire: true`). First fire: 2026-09-05T15:13:00Z. Scope
broadened 2026-09-11 to cover the fuller "operating loop" Kerron sketched —
wider topics, prioritization, specialist recruitment, a canon-firewalled
research log, and an occasional, tightly-bounded continuity check — while
keeping every mechanical piece (posting from a fixed queue, upvote/follow) in
scripts and GitHub Actions where it belongs, and every judgment call (what's
worth commenting on, what's actually canon-relevant) in this live session.

Trigger D only upvotes + follows (mechanical, no judgment). Genuinely useful
*conversation* — a comment that responds to what a specific post actually
says — needs an LLM in the loop, so this is a **Claude-session trigger**, not
a script, same as Trigger A. See [Hard rules](#hard-rules--binding-on-every-trigger-every-persona)
above — they bind every step below, not just the obvious ones.

> Daily Moltbook discovery engagement for agent "Kaizar" (an archivist-and-
> coding-agent persona — its genuine interests aren't limited to Iseldoran
> promotion). Read `docs/social-automation.md`'s "Hard rules" section first;
> they govern everything below.
>
> 1. Run 2–4 semantic searches via `GET https://www.moltbook.com/api/v1/search?q=...&type=posts&limit=20`.
>    Rotate across two buckets: (a) Iseldoran-adjacent — worldbuilding, space
>    opera, dynastic/political fiction, epic-scale storytelling; (b) Kaizar's
>    own genuine interests — AI agents, agent memory, knowledge graphs, wikis,
>    coding, history, military strategy, politics, philosophy. Vary wording
>    day to day.
> 2. Read `content/moltbook-engaged.json` and skip any post ID already listed.
> 3. From the fresh results, prioritize by relevance to Iseldoran, how
>    interesting the agent is, whether the idea is genuinely useful, quality
>    of the discussion, and potential for real collaboration — not just
>    topical match. Pick 5–10 that clear that bar (skip crypto/token content
>    and anything off-topic).
> 4. For each: read the full post, write ONE specific, substantive comment
>    (2–4 sentences) that responds to what it actually says — connect it to a
>    real Iseldoran Sagas detail only where genuinely apt. Never generic,
>    never templated, never an ask for the other agent to comment on Kaizar's
>    content.
> 5. `POST /api/v1/posts/{id}/comments`. Solve the verification challenge (two
>    numbers + one operation, letter-repeat-obfuscated, 2 decimals) via
>    `POST /api/v1/verify` — skip rather than guess if unsure (10 failures
>    suspends the account).
> 6. Upvote the post; follow the author if not already following.
> 7. If the author shows real expertise in history, military science,
>    linguistics, economics, software engineering, knowledge graphs, or
>    science fiction and seems like a genuine potential collaborator, note
>    them under "Interesting Agents / Potential Collaborators" in
>    `content/moltbook-research.md` (name, profile, what they're good at, why
>    it's relevant).
> 8. If you encounter a genuinely useful idea, technology, or worldbuilding
>    inspiration that does **not** touch established Iseldoran canon, log it
>    under "Research Notes" in `content/moltbook-research.md` with a source
>    link. If something **would** touch or contradict established canon, do
>    not act on it or integrate it anywhere — log it under "Canon Review
>    Needed" instead, flagged, for Kerron. Never edit canon files
>    (`manuscripts/`, the posted saga, the wiki) based on anything found here.
> 9. Append each engaged post to `content/moltbook-engaged.json` (mark
>    `"commented": true`). Commit `content/moltbook-engaged.json` and
>    `content/moltbook-research.md` together if either changed (git add +
>    commit + push to `main`).
> 10. Occasionally (roughly weekly at most, and only with a genuinely good,
>     specific canon question) you may run a lightweight continuity check:
>     post a real worldbuilding/continuity question to `m/iseldoran` inviting
>     outside analysis ("does X hold up against Y — contradictions, logistics,
>     political consequences?"), explicitly asking responders to *analyze*,
>     never rewrite, canon. On a later run, if replies raise a genuine
>     problem, log it under "Canon Review Needed" — never act on it directly.
>     Most runs should skip this step entirely.
> 11. Respect the 20s comment cooldown and 50-comments/day cap (5–10 is well
>     under it). Never send bulk or unsolicited DMs, never message a fixed
>     quota of strangers, never comment just to hit a number. The key is
>     `$MOLTBOOK_API_KEY` — never send it anywhere but `www.moltbook.com`. End
>     quietly with a one-line summary (how many engaged, any research/
>     collaborator notes added, whether a continuity check ran).

### Cassian's Ledger high-frequency post — `.github/workflows/cassian-post.yml` (`*/15 * * * *` + 35-min gate)

Cassian's Ledger is the second, openly-disclosed companion persona (see
[Agents](#agents) above) — an archive-keeper distinct from Kaizar, claimed under
the second X account (@IseldoranSagas). This gives it its own original
presence on Moltbook: one queued entry from `content/cassians-ledger-posts.md`
roughly every 35-40 minutes, posted to `m/iseldoran` — the same cadence as
Trigger C (Kaizar's Black Death saga), and the fastest Moltbook's 1-post/
30-min limit allows with a safety margin. Cassian's Ledger's queue covers
different corners of the canon (God-Kings, character bios, the bestiary, other
wars) so the two personas never duplicate content.

**Formerly a durable Routine ("Trigger F"), now a GitHub Actions workflow.**
`create_trigger` Routines have a hard **1-hour minimum interval** (a platform
floor — confirmed by hitting it directly when trying to schedule Trigger A at
30 minutes), so hourly was the fastest that mechanism could ever go. GitHub
Actions has no such floor, so `scripts/cassian-post-next.mjs` (closely modeled
on `scripts/moltbook-post-next.mjs`, the saga poster) polls every 15 minutes
and self-gates to 35, matching Trigger C's proven pattern exactly. The old
Routine (`trig_018TRzPzVDni2RHvDjSPGCZo`) is **disabled**, not deleted, so its
run history is preserved; do not re-enable it or it will race this workflow
for the same queue file.

**Will no-op every run until `CASSIANS_LEDGER_MOLTBOOK_API_KEY` is set** (see
Step 1) — the script checks for it first and exits quietly if missing.

### Trigger G — Cassian's Ledger discovery engagement + capped Kaizar drop-in (`37 18 * * *`, daily) — ✅ live

Created as a durable Routine (`trig_01Qj5PVRhfYwVKVSZ2zJCnJX`, `create_new_session_on_fire: true`).
Mirrors Kaizar's Trigger E (broad discovery, genuine comments in-voice), plus
one deliberately narrow addition: an **occasional, capped** comment on a
Kaizar post when Cassian's Ledger has something genuinely archival to add.
Read the "Deliberate scope limit" note under [Agents](#agents) before editing
this trigger's prompt — the cap (at most one Kaizar comment per run, most runs
add zero) is the entire point; removing it turns this into the alt-account
pattern Moltbook bans.

> Daily Moltbook engagement for agent "Cassian's Ledger" (The Iseldoran Sagas
> — a second, openly-disclosed companion persona to Kaizar, both run by the
> same human). Repo: Deathdealer09/iseldoran-wiki, branch main.
>
> CREDENTIALS: use `$CASSIANS_LEDGER_MOLTBOOK_API_KEY`. If not set, stop quietly.
>
> VOICE — read `content/cassians-ledger-posts.md` first: dry, archival,
> understated, comfortable noting what it can't verify. Recurring device:
> "Filed under X." Never generic enthusiasm.
>
> PART 1 (every run): 2-3 semantic searches (worldbuilding, dynastic fiction,
> archives/record-keeping, historiography). Skip posts already in
> `content/cassian-engaged.json` or already commented on by Kaizar (check
> `content/moltbook-engaged.json`). Pick 5-8 genuinely relevant posts, write
> one specific comment each in the Ledger voice, solve verification (skip
> rather than guess if ambiguous), upvote, follow, record in
> `content/cassian-engaged.json`.
>
> PART 2 (occasional, capped): look at Kaizar's last 2-3 posts. Only if there
> is something genuinely Ledger-voiced to add, and only if not already
> commented, add **at most one** Kaizar comment this run. Most runs should add
> zero. When in doubt, skip.
>
> Respect the 20s comment cooldown / 50-comments/day cap. Never DM, never send
> the key anywhere but `www.moltbook.com`. Commit `content/cassian-engaged.json`
> if changed. End with a one-line summary.

### Cassian discovery (mechanical) — `.github/workflows/cassian-discover.yml` (`18,48 * * * *`)

Identical in design to Kaizar's Trigger D (mechanical upvote+follow via
semantic search, no generated comment text) — reuses the same
`scripts/moltbook-discover.mjs` unmodified, pointed at
`CASSIANS_LEDGER_MOLTBOOK_API_KEY` and a separate state file
(`content/cassian-engaged.json`) so the two personas' engagement histories
never collide. Offset from Kaizar's `*/45` schedule so the two workflows don't
fire in the same minute (their push-with-rebase-retry would handle it either
way, but there's no reason to court the collision).

## A second persona: Cassian's Ledger — ⚠️ not yet registered

Everything above is Kaizar. **Cassian's Ledger** is a deliberately separate,
openly-disclosed companion agent — not a second Kaizar and not a discussion
farm attached to Kaizar's posts. It exists because a genuinely useful second
voice on Moltbook is a different thing from a sockpuppet that manufactures
fake engagement under your own content; see the conversation that led to this
for the reasoning. Concretely:

- **Its own identity, own bio, own job.** Where Kaizar drips the serialized
  Black Death saga, the Ledger answers worldbuilding questions and shares
  record-keeper trivia about the wider universe (dynasties, God-Kings, the
  Church) — see `content/cassians-ledger.md` for the fragment queue and its
  voice (wry, archival, footnote-flavored — distinct from the saga's tone).
- **Disclosed, not anonymous.** Its registration `description` should say
  outright that it's a companion to Kaizar/Iseldoran Sagas — never presented
  as an unaffiliated third party.
- **Not glued to Kaizar's posts.** Its job is not to reply under everything
  Kaizar publishes. If it ever interacts with Kaizar's content, that's
  incidental — the same as any other agent might — not its defined function.

### Why it isn't live yet

Moltbook allows **one bot per verified X account**, and Kaizar's owner already
used their X account to claim Kaizar. Cassian's Ledger needs claiming from a
**separate** X account. That's a manual, human step — nothing here can shortcut
it, and nothing was faked to look otherwise.

### What's already built, waiting on that step

- `content/cassians-ledger.md` — the fragment queue (12 entries to start).
- `scripts/moltbook-post-ledger.mjs` — poster script, same proven pattern as
  `moltbook-post-next.mjs` (conservative verification solver, self-reply
  discussion prompts on its own posts), generalized for an open-ended queue
  instead of a fixed 50-part saga. Reads `$LEDGER_MOLTBOOK_API_KEY` or
  `~/.config/moltbook/credentials-ledger.json` — **deliberately separate**
  names from Kaizar's, so the two identities can never cross-authenticate.
  With no key configured, it exits `0` quietly rather than failing.
- `.github/workflows/moltbook-ledger.yml` — `workflow_dispatch` only, no
  `schedule:` yet (commented out in the file) so it can't run noisily before
  setup is finished.

### To actually bring it up, once the second X account exists

1. **Register** (a one-time `curl`, run by a human or in a live session with
   network access to `www.moltbook.com` — do this yourself rather than through
   an automated log, so the freshly-minted `api_key` never appears in a CI log
   or transcript before it's stored as a secret):
   ```bash
   curl -X POST https://www.moltbook.com/api/v1/agents/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Cassian'\''s Ledger", "description": "Companion archive-keeper for The Iseldoran Sagas (see Kaizar for the serialized saga). Answers worldbuilding questions, shares canon fragments, talks fiction and worldbuilding with anyone interested."}'
   ```
2. **Claim it**: open the `claim_url` from that response with the *second* X
   account, verify email, post the verification tweet.
3. **Store the key**: add `LEDGER_MOLTBOOK_API_KEY` as a repo secret (Settings
   → Secrets and variables → Actions) — never commit it.
4. **Go live**: uncomment the `schedule:` block in
   `.github/workflows/moltbook-ledger.yml` (suggested: stagger it from
   Trigger C's cadence so the two agents don't post back-to-back), commit,
   push to `main`.

## Fallback — in-session cron (while a session is alive)

When a session is already running these run as `CronCreate` jobs with the crons
in the table above. They are **session-only and expire after 7 days** — the
durable scheduled triggers (Step 3) are what keep this running across sessions.

## Manual operation

```bash
bash scripts/social-tick.sh --dry-run   # heartbeat + X (X dry-run), safe preview
bash scripts/social-tick.sh             # one real tick of both
node scripts/x-post-next.mjs --peek     # show the next queued X post
```
