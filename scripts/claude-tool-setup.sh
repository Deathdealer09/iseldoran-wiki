#!/usr/bin/env bash
# ============================================================
# Claude Code tool setup
#
# Run this in a normal terminal on the machine where you use
# Claude Code (NOT inside a Claude Code session itself).
# Requires: Claude Code CLI + Node/npm already installed.
#
# CLI >= 2.1 exposes `claude plugin ...` subcommands, so the
# plugin steps below run directly from this script instead of
# having to be pasted into a live session by hand.
#
# Commands verified against each project's own docs, July 2026.
# ============================================================

set -euo pipefail

# ------------------------------------------------------------
# Preflight
# ------------------------------------------------------------
if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: 'claude' CLI not found on PATH. Install Claude Code first." >&2
  exit 1
fi
echo "Using Claude Code: $(claude --version 2>/dev/null || echo unknown)"
echo ""

echo "== 1. Claude Mem (persistent memory across Claude Code sessions) =="
echo "    https://github.com/thedotmack/claude-mem"
npx claude-mem install

echo ""
echo "== 2. n8n-mcp (lets Claude build n8n automations) =="
echo "    Only useful if you actually run an n8n instance."
echo "    https://github.com/czlonkowski/n8n-mcp"
read -p "Set up n8n-mcp now? [y/N] " ans
if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
  claude mcp add n8n-mcp \
    -e MCP_MODE=stdio \
    -e LOG_LEVEL=error \
    -e DISABLE_CONSOLE_OUTPUT=true \
    -- npx n8n-mcp
  echo "    Added without n8n credentials. To point it at a real n8n instance later:"
  echo "    claude mcp remove n8n-mcp"
  echo "    claude mcp add n8n-mcp -e MCP_MODE=stdio -e N8N_API_URL=<url> -e N8N_API_KEY=<key> -- npx n8n-mcp"
else
  echo "    Skipped."
fi

echo ""
echo "== 3. [Redacted item from your list] =="
echo "    NOTE: this entry was blanked out in the source checklist, so there is"
echo "    nothing to install here. If you know what item 3 was meant to be, drop"
echo "    it in and wire it up below. Left as a deliberate placeholder."

# ------------------------------------------------------------
# Plugins (items 4-7)
#
# These install as Claude Code PLUGINS. On CLI >= 2.1 the
# `claude plugin marketplace add` / `claude plugin install`
# commands work straight from a terminal, so no live session
# is required. First install of each pulls the marketplace repo
# from GitHub and its code loads at the next session start.
#
# Restart Claude Code afterwards for the skills/hooks/agents to
# become active. Inspect with:  claude plugin list
#                                claude plugin details <name>
# Back out any of them with:     claude plugin uninstall <name>
# ------------------------------------------------------------
add_marketplace() {
  # Idempotent: adding an already-registered marketplace is a no-op, not a failure.
  claude plugin marketplace add "$1" || true
}

echo ""
echo "== 4. Obsidian Skills (only useful if you use Obsidian) =="
echo "    https://github.com/kepano/obsidian-skills"
add_marketplace kepano/obsidian-skills
claude plugin install obsidian@obsidian-skills

echo ""
echo "== 5. Everything Claude Code / ECC (large agent + skill + hook pack) =="
echo "    https://github.com/affaan-m/everything-claude-code"
add_marketplace affaan-m/everything-claude-code
claude plugin install everything-claude-code@everything-claude-code

echo ""
echo "== 6. Superpowers (brainstorm -> plan -> TDD -> review discipline) =="
echo "    https://github.com/obra/superpowers"
add_marketplace obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace

echo ""
echo "== 7. GSD / Get Shit Done (spec-driven workflow for long sessions) =="
echo "    CAUTION: the original GSD project went through a public trust and"
echo "    ownership dispute this year and the community fragmented into competing"
echo "    forks. This is the jnuyens fork, billed as a Claude-Code-native evolution"
echo "    of GSD. Installing it per your choice -- swap in a different fork if you"
echo "    would rather."
echo "    https://github.com/jnuyens/gsd-plugin"
add_marketplace jnuyens/gsd-plugin
claude plugin install gsd@gsd-plugin

# ------------------------------------------------------------
# Not included (informational only -- nothing to install)
# ------------------------------------------------------------
cat << 'NOTES'

== Not included ==
LightRAG: not a Claude Code plugin, a separate Python/Docker RAG
framework (https://github.com/HKUDS/LightRAG). Bigger project on
its own if you want it.

Awesome Claude Code: not installable, it's a curated link directory
(https://github.com/hesreallyhim/awesome-claude-code). Just browse it.

NOTES

echo ""
echo "All steps complete. Restart Claude Code so the newly installed plugins load."
echo "Verify with: claude plugin list"
