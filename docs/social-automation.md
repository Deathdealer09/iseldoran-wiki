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
| A — Moltbook heartbeat | Kaizar engages with activity | `19,49 * * * *` | ~30 min |
| B — X lore drop | next item from `content/x-posts.md` | `23 2,8,14,20 * * *` | 4×/day |
| C — Black Death saga | next part → Moltbook `m/iseldoran` | `*/12 * * * *` + 35-min gate | 1 / 35 min |

### Trigger A — Moltbook heartbeat (`19,49 * * * *`, ~30 min)

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

### Trigger A — status: documented, not yet live ⚠️

Trigger A (Moltbook heartbeat — reply to activity on Kaizar's own posts,
judgment-based engagement) was designed from the start to require a real
Claude session, not a script (see `scripts/moltbook-heartbeat.sh`'s own header:
it only gathers data; "the judgment half... is left to the agent that invokes
this"). It has never actually been created as a live scheduled trigger.

Creating it today would hit the same wall this repo's own automation work
already ran into: this environment's network access level does not currently
allow `www.moltbook.com` (confirmed via repeated `curl` checks — `CONNECT
tunnel failed, response 403`, a policy denial, not a transient error). A
Routine spawning a fresh session in this same environment would fail the same
way. To make Trigger A real: allowlist `www.moltbook.com` for the environment
(Custom network access, see the top-level Claude Code on the web docs), then
create it with `create_trigger` (`create_new_session_on_fire: true`, cron
`19,49 * * * *`, the Trigger A prompt above).

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
