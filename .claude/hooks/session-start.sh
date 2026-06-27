#!/bin/bash
# SessionStart hook — prepares the repo for Claude Code on the web and
# materializes social-automation credentials from environment secrets so the
# Moltbook heartbeat and X posting work in a fresh, ephemeral container.
#
# Synchronous mode: the session waits for this to finish (guarantees readiness).
# Intentionally NOT using `set -e` — a single non-fatal failure (e.g. npm in a
# restricted network) must never block the session from starting.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# --- 1. Node dependencies (best-effort; container caches after first success) -
if [ -f package.json ]; then
  echo ">> Installing Node dependencies (npm install)…"
  npm install --no-audit --no-fund >/dev/null 2>&1 \
    && echo "   deps ready ✅" \
    || echo "   !! npm install failed (non-fatal; social scripts need no deps)"
fi

# --- 2. Materialize Moltbook credentials from the MOLTBOOK_API_KEY secret -----
# moltbook-heartbeat.sh prefers $MOLTBOOK_API_KEY, but writing the file keeps
# every other Moltbook call working too. Never echo the secret value.
if [ -n "${MOLTBOOK_API_KEY:-}" ] && [ ! -f "$HOME/.config/moltbook/credentials.json" ]; then
  mkdir -p "$HOME/.config/moltbook"
  ( umask 077
    printf '{\n  "api_key": "%s",\n  "agent_name": "Kaizar"\n}\n' "$MOLTBOOK_API_KEY" \
      > "$HOME/.config/moltbook/credentials.json" )
  echo ">> Moltbook credentials materialized from secret."
fi

# --- 3. Readiness report (names/status only — never secret values) ------------
echo ">> Social automation readiness:"
if [ -n "${MOLTBOOK_API_KEY:-}" ] || [ -f "$HOME/.config/moltbook/credentials.json" ]; then
  echo "   Moltbook (Kaizar): configured ✅"
else
  echo "   Moltbook (Kaizar): NOT configured — set the MOLTBOOK_API_KEY secret."
fi
if { [ -n "${X_API_KEY:-}" ] && [ -n "${X_API_SECRET:-}" ] \
     && [ -n "${X_ACCESS_TOKEN:-}" ] && [ -n "${X_ACCESS_SECRET:-}" ]; } \
   || [ -f "$HOME/.config/iseldoran-x/credentials.json" ]; then
  echo "   X/Twitter: configured ✅"
else
  echo "   X/Twitter: NOT configured — set X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET secrets (see scripts/x-setup.md)."
fi

# --- 4. Network egress readiness for the posting hosts ------------------------
# Posting needs these hosts on the environment's network allowlist. A blocked
# host shows up as a failed CONNECT (curl exit / HTTP 000) rather than a real
# HTTP status. This only probes reachability — it sends no credentials.
echo ">> Network egress (hosts must be on the allowlist to post):"
probe_host() {
  host="$1"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 6 "https://$host/" 2>/dev/null || true)"
  if [ -n "$code" ] && [ "$code" != "000" ]; then
    echo "   $host: reachable ✅"
  else
    echo "   $host: BLOCKED — add it to the environment network allowlist."
  fi
}
probe_host "api.twitter.com"
probe_host "www.moltbook.com"

exit 0
