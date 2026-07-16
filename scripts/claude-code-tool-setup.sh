#!/usr/bin/env bash
# ============================================================
# Claude Code tool setup
# Run this in a normal terminal on the machine where you use
# Claude Code (not inside a Claude Code session itself).
# Requires: Claude Code CLI + Node/npm already installed.
#
# Commands verified against each project's own docs, July 2026.
# ============================================================

set -e

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

cat << 'PLUGINS'

== 3. [Redacted item from your list] ==
    Nothing to install, the entry itself was blanked out.

== 4-7. These install as Claude Code PLUGINS, not shell commands ==
    /plugin marketplace add and /plugin install only work typed
    INSIDE a live Claude Code session. Run `claude` in this
    terminal to start one, then paste each pair of lines below
    at the prompt.

--- Obsidian Skills (only useful if you use Obsidian) ---
    https://github.com/kepano/obsidian-skills
/plugin marketplace add kepano/obsidian-skills
/plugin install obsidian@obsidian-skills

--- Everything Claude Code / ECC (large agent + skill + hook pack) ---
    https://github.com/affaan-m/everything-claude-code
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code

--- Superpowers (brainstorm -> plan -> TDD -> review discipline) ---
    https://github.com/obra/superpowers
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

--- GSD / Get Shit Done (spec-driven workflow for long sessions) ---
    CAUTION: the original GSD project went through a public trust
    and ownership dispute this year and the community fragmented
    into competing forks. This is the jnuyens fork, billed as a
    Claude-Code-native evolution of GSD. Confirm you're comfortable
    with that provenance before running it, or swap in a different
    fork if you'd rather.
    https://github.com/jnuyens/gsd-plugin
/plugin marketplace add jnuyens/gsd-plugin
/plugin install gsd@gsd-plugin

== Not included ==
LightRAG: not a Claude Code plugin, a separate Python/Docker RAG
framework (https://github.com/HKUDS/LightRAG). Bigger project on
its own if you want it.

Awesome Claude Code: not installable, it's a curated link directory
(https://github.com/hesreallyhim/awesome-claude-code). Just browse it.

PLUGINS

echo "Done with the shell-runnable steps. Open a Claude Code session for the rest."
