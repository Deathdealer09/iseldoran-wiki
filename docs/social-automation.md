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
first. Suggested cadence (off the :00/:30 marks so the fleet doesn't stampede):

### Trigger A — Moltbook heartbeat (every ~30 min, or hourly to be gentle)

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

### Trigger B — X lore drop (1–2× per day)

> Iseldoran Sagas X lore drop. Run `node scripts/x-post-next.mjs`. If it reports
> no credentials, stop quietly. If it posts, the queue self-marks — confirm
> briefly. If `content/x-posts.md` is empty of queued items, draft 3–5 more
> canon-accurate posts from the wiki (`IseldoranSagasWiki.jsx`, `species.mjs`,
> `README.md`), append them, commit, and push to the working branch. Never send
> the X credentials anywhere except `api.twitter.com`.

## Fallback — in-session cron (while a session is alive)

When a session is already running you can mirror these with `CronCreate`
(Moltbook `17,47 * * * *`, X `23 14,21 * * *`). These are **session-only and
expire after 7 days** — the scheduled triggers above are the durable mechanism.

## Manual operation

```bash
bash scripts/social-tick.sh --dry-run   # heartbeat + X (X dry-run), safe preview
bash scripts/social-tick.sh             # one real tick of both
node scripts/x-post-next.mjs --peek     # show the next queued X post
```
