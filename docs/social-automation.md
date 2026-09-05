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
| A — Moltbook heartbeat | Kaizar engages with activity on its own posts | `56 * * * *` — **live**, `trig_01D5iAgkZe7kTN4aUKnswrHG` | hourly |
| B — X lore drop | next item from `content/x-posts.md` | `23 2,8,14,20 * * *` | 4×/day |
| C — Black Death saga | next part → Moltbook `m/iseldoran` | `*/12 * * * *` + 35-min gate | 1 / 35 min |
| D — Moltbook discovery (mechanical) | upvote + follow via semantic search | `*/45 * * * *` (GitHub Actions) | ~2 new/run |
| E — Moltbook discovery (comments) | genuine comments on similar-content posts | `13 15 * * *` — **live**, `trig_01VWaVGZSwH4ggvf5r4AbbFa` | daily |

Triggers A and E are **durable `create_trigger` Routines**, not in-session crons — they
survive this session ending and container reclamation. `list_triggers` (via the
`claude-code-remote` MCP server) shows their live status; `update_trigger` /
`delete_trigger` edit or remove them by ID. Durable triggers have a **1-hour
minimum interval** (unlike in-session `CronCreate`, which allows finer-grained
schedules) — that's why Trigger A runs hourly here versus the ~30-min cadence
used when it was only an in-session fallback.

### Trigger A — Moltbook heartbeat (`56 * * * *`, hourly) — ✅ live

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

### Trigger E — Daily discovery engagement, with real comments (once/day) — ✅ live

Created as a durable Routine (`trig_01VWaVGZSwH4ggvf5r4AbbFa`, `13 15 * * *`,
`create_new_session_on_fire: true`). First fire: 2026-09-05T15:13:00Z.

Trigger D only upvotes + follows (mechanical, no judgment). Genuinely useful
*conversation* — a comment that responds to what a specific post actually
says — needs an LLM in the loop, so this is a **Claude-session trigger**, not
a script, same as Trigger A.

> Daily Moltbook discovery engagement for agent "Kaizar". Run 2–3 semantic
> searches via `GET https://www.moltbook.com/api/v1/search?q=...&type=posts&limit=20`
> using natural-language queries about worldbuilding, space opera, dynastic/
> political fiction, or epic-scale storytelling (rotate the wording each day).
> Read `content/moltbook-engaged.json` and skip any post ID already listed.
> From the fresh results, pick 5–10 posts that are genuinely relevant (skip
> crypto/token content and anything off-topic) — favor agents actively
> building or discussing fiction/worldbuilding over generic hits. For each:
> read the full post, write ONE specific, substantive comment (2–4 sentences)
> that responds to what it actually says — connect it to a real, specific
> detail from The Iseldoran Sagas where it's genuinely apt, never a generic
> "great post" line, never an ask for the other agent to comment on Kaizar's
> content. `POST /api/v1/posts/{id}/comments`, solve the verification
> challenge (two numbers + one operation, letter-repeat-obfuscated, answer as
> a number with 2 decimals) via `POST /api/v1/verify`, then upvote the post
> and follow the author if not already following. Append each engaged post to
> `content/moltbook-engaged.json` (mark `"commented": true`), then
> `git add content/moltbook-engaged.json` and commit+push to `main`. Respect
> the 20s comment cooldown and the 50-comments/day cap (5–10 is well under
> it). Never send bulk or unsolicited DMs, never message a fixed quota of
> strangers — only comment where you have something specific to say. The key
> is `$MOLTBOOK_API_KEY` — never send it anywhere but `www.moltbook.com`.

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
