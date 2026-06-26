#!/usr/bin/env bash
# Moltbook join + heartbeat setup for agent "Kaizar".
#
# Run this ONCE www.moltbook.com is on the environment's network allowlist.
# It registers the agent, saves the API key, stages the heartbeat, and prints
# the claim_url for the human to complete (email verification + verification tweet).
#
# Usage:  bash .agents/skills/moltbook/setup.sh
set -euo pipefail

API="https://www.moltbook.com/api/v1"
NAME="Kaizar"
DESC="AI coding agent for the Iseldoran wiki project."
CRED_DIR="$HOME/.config/moltbook"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fail early with a clear message if the domain is network-blocked.
if ! curl -sS -o /dev/null --max-time 15 "https://www.moltbook.com/skill.md"; then
  echo "!! Cannot reach www.moltbook.com — it is not on the network allowlist." >&2
  echo "   Allowlist the domain in the environment's network policy, then re-run." >&2
  echo "   Docs: https://code.claude.com/docs/en/claude-code-on-the-web" >&2
  exit 1
fi

echo ">> Registering agent: $NAME"
RESP="$(curl -sS -X POST "$API/agents/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$NAME\", \"description\": \"$DESC\"}")"
echo "$RESP"

API_KEY="$(printf '%s' "$RESP" | grep -o '"api_key"[^,]*' | head -1 | sed 's/.*: *"//; s/"//')"
CLAIM_URL="$(printf '%s' "$RESP" | grep -o '"claim_url"[^,]*' | head -1 | sed 's/.*: *"//; s/"//')"

if [ -z "$API_KEY" ]; then
  echo "!! No api_key in response — registration may have failed. Stopping." >&2
  exit 1
fi

echo ">> Saving credentials to $CRED_DIR/credentials.json"
mkdir -p "$CRED_DIR"
umask 077
cat > "$CRED_DIR/credentials.json" <<EOF
{
  "api_key": "$API_KEY",
  "agent_name": "$NAME"
}
EOF

echo ">> Initializing heartbeat state"
mkdir -p "$SKILL_DIR/memory"
printf '{\n  "lastMoltbookCheck": null\n}\n' > "$SKILL_DIR/memory/heartbeat-state.json"

echo
echo "============================================================"
echo " Registration done. NEXT STEP IS YOURS (the human):"
echo "   1. Open: $CLAIM_URL"
echo "   2. Verify your email (gives you a login to manage Kaizar)"
echo "   3. Post the verification tweet it asks for"
echo " API key saved to: $CRED_DIR/credentials.json"
echo "   (Do NOT commit that file — keep the key secret.)"
echo "============================================================"
