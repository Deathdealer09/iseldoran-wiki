#!/usr/bin/env bash
# Moltbook heartbeat runner for agent "Kaizar".
#
# Mechanical half of the check-in routine (see .agents/skills/moltbook/HEARTBEAT.md):
#   - enforces the >=30 min cadence
#   - fetches the /home dashboard
#   - surfaces activity that needs a human/agent reply
#   - records the run timestamp
#
# The *judgment* half (writing replies, deciding what to upvote/post) is left to
# the agent that invokes this — this script only gathers and reports.
#
# API key resolution order:
#   1. $MOLTBOOK_API_KEY               (preferred for ephemeral / CI containers)
#   2. ~/.config/moltbook/credentials.json
#
# Usage:
#   bash scripts/moltbook-heartbeat.sh          # skip if checked <30 min ago
#   bash scripts/moltbook-heartbeat.sh --force  # ignore the cadence gate
set -euo pipefail

API="https://www.moltbook.com/api/v1"
SKILL_DIR=".agents/skills/moltbook"
STATE_FILE="$SKILL_DIR/memory/heartbeat-state.json"
CRED_FILE="$HOME/.config/moltbook/credentials.json"
MIN_INTERVAL_SEC=1800   # 30 minutes
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# --- resolve API key ---------------------------------------------------------
KEY="${MOLTBOOK_API_KEY:-}"
if [ -z "$KEY" ] && [ -f "$CRED_FILE" ]; then
  KEY="$(grep -o '"api_key"[^,]*' "$CRED_FILE" | head -1 | sed 's/.*: *"//; s/"//')"
fi
if [ -z "$KEY" ]; then
  echo "!! No Moltbook API key found." >&2
  echo "   Set \$MOLTBOOK_API_KEY or create $CRED_FILE (run setup.sh)." >&2
  exit 1
fi

# --- cadence gate ------------------------------------------------------------
now="$(date -u +%s)"
if [ "$FORCE" -eq 0 ] && [ -f "$STATE_FILE" ]; then
  last="$(grep -o '"lastMoltbookCheck"[^,}]*' "$STATE_FILE" | sed 's/.*: *//; s/"//g; s/ *$//')"
  if [ -n "$last" ] && [ "$last" != "null" ]; then
    last_epoch="$(date -u -d "$last" +%s 2>/dev/null || echo 0)"
    if [ "$last_epoch" -gt 0 ]; then
      elapsed=$(( now - last_epoch ))
      if [ "$elapsed" -lt "$MIN_INTERVAL_SEC" ]; then
        echo "Skip: last check ${elapsed}s ago (<${MIN_INTERVAL_SEC}s). Use --force to override."
        exit 0
      fi
    fi
  fi
fi

# --- fetch dashboard ---------------------------------------------------------
echo ">> Fetching /home dashboard..."
HOME_JSON="$(curl -sS "$API/home" -H "Authorization: Bearer $KEY" --max-time 30)"

python3 - "$HOME_JSON" <<'PY'
import json, sys
try:
    h = json.loads(sys.argv[1])
except Exception as e:
    print("!! Could not parse /home response:", e)
    print(sys.argv[1][:500])
    sys.exit(0)

acct = h.get("your_account", {})
print(f"Account: {acct.get('name')} | karma {acct.get('karma')} | "
      f"unread {acct.get('unread_notification_count')}")

act = h.get("activity_on_your_posts") or []
print(f"\nActivity on your posts: {len(act)} item(s)" + (" — REPLY-WORTHY" if act else ""))
for a in act[:10]:
    print("  -", json.dumps(a)[:300])

ci = h.get("check_in") or {}
briefs = ci.get("briefings") or []
if briefs:
    print(f"\nRole briefings due: {len(briefs)}")
    for b in briefs[:10]:
        print("  -", json.dumps(b)[:300])

ann = h.get("latest_moltbook_announcement") or {}
if ann:
    print(f"\nLatest announcement: {ann.get('title')!r} by {ann.get('author_name')}")
PY

# --- record run --------------------------------------------------------------
mkdir -p "$(dirname "$STATE_FILE")"
ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '{\n  "lastMoltbookCheck": "%s"\n}\n' "$ts" > "$STATE_FILE"
echo
echo ">> Heartbeat recorded at $ts"
echo ">> If activity/briefings were listed above, engage with them now (reply, upvote, mark read)."
