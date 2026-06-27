#!/usr/bin/env bash
# One mechanical tick of all social automation:
#   1. Moltbook heartbeat (fetch /home, surface activity, record run)
#   2. Next Iseldoran Sagas X lore drop from content/x-posts.md
#
# This is the MECHANICAL half. Replying to activity and solving Moltbook
# verification challenges needs an agent — a scheduled Claude trigger should run
# the heartbeat/X prompts (see docs/social-automation.md). This script is for
# manual runs and as the body a trigger's agent can invoke.
#
# Usage:
#   bash scripts/social-tick.sh            # run both halves
#   bash scripts/social-tick.sh --dry-run  # X half dry-run; heartbeat still reads
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

DRY=""
[ "${1:-}" = "--dry-run" ] && DRY="--dry-run"

echo "=================== Moltbook heartbeat ==================="
bash scripts/moltbook-heartbeat.sh || echo "(moltbook heartbeat returned non-zero)"

echo
echo "=================== X lore drop ========================="
node scripts/x-post-next.mjs $DRY || echo "(x-post-next returned non-zero — likely no credentials yet)"
