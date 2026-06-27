# X (Twitter) auto-posting — setup

Posts Iseldoran Sagas lore from `content/x-posts.md` to X via the API v2
`POST /2/tweets` endpoint, signed with OAuth 1.0a (no external dependencies).

## 1. Get X API credentials

1. Create / open an app at the [X Developer Portal](https://developer.x.com/).
2. The app must have **Read and Write** permissions (set this *before* generating
   tokens — if you change it after, regenerate the access token + secret).
3. Attach the app to a **Project** (required for API v2 posting).
4. Collect four values:
   - **API Key** (consumer key)
   - **API Key Secret** (consumer secret)
   - **Access Token**
   - **Access Token Secret**

> Free tier currently allows a limited number of posts/month per app — enough for
> a steady lore-drop cadence. Long posts (>280 chars) require X Premium on the
> posting account; otherwise keep items at/under 280.

## 2. Provide the credentials (pick one)

**A. Local credentials file (preferred — kept out of git):**

```bash
mkdir -p ~/.config/iseldoran-x
cat > ~/.config/iseldoran-x/credentials.json <<'JSON'
{
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET",
  "access_token": "YOUR_ACCESS_TOKEN",
  "access_secret": "YOUR_ACCESS_SECRET"
}
JSON
chmod 600 ~/.config/iseldoran-x/credentials.json
```

**B. Environment variables** (better for ephemeral / web containers — set them as
environment **secrets** so they survive new sessions):

```bash
export X_API_KEY=...
export X_API_SECRET=...
export X_ACCESS_TOKEN=...
export X_ACCESS_SECRET=...
```

On Claude Code on the web, add these as secrets in the environment config so a
fresh container has them — see
https://code.claude.com/docs/en/claude-code-on-the-web

> 🔒 The credentials are only ever sent to `api.twitter.com`. Never commit the
> credentials file. Never paste secrets into chat.

## 3. Use it

```bash
# Show the next queued item without posting:
node scripts/x-post-next.mjs --peek

# Validate end-to-end without sending (signs with your real creds):
node scripts/x-post-next.mjs --dry-run

# Post the next queued item and mark it [x] in content/x-posts.md:
node scripts/x-post-next.mjs

# Post arbitrary text directly:
node scripts/x-post.mjs "Some one-off tweet"
```

After a successful post the queue line flips from `[ ]` to `[x] … — posted <timestamp>`.

## 4. Cadence

A good lore-drop rhythm is 1–2 posts/day. Either run `x-post-next.mjs` from a
scheduler (cron / GitHub Action / Claude scheduled task), or post manually when
you want. Don't over-post: spacing keeps the feed from looking automated.
