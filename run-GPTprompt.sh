#!/bin/bash

# --- Setup ---
workdir=$(pwd)  # assumes you run from project root
outfile="$workdir/gptPrompt"

# --- Always clear outfile first ---
> "$outfile"

# --- Detect vite version ---
vite_version="unknown"

# Check if node_modules/.bin/vite exists and get version
if [ -x "$workdir/node_modules/.bin/vite" ]; then
  vite_version=$("$workdir/node_modules/.bin/vite" --version 2>/dev/null)
else
  # fallback: detect from running vite process
  pid=$(ps -ef | grep vite | grep node | grep "$workdir" | grep -v grep | awk '{print $2}')
  if [ -n "$pid" ]; then
    cwd=$(readlink /proc/$pid/cwd)
    if [ -f "$cwd/node_modules/vite/package.json" ]; then
      vite_version=$(grep '"version"' "$cwd/node_modules/vite/package.json" | awk -F'"' '{print $4}')
    elif [ -f "$cwd/package.json" ]; then
      vite_version=$(grep '"vite"' "$cwd/package.json" | grep -v "plugin" | head -n1 | awk -F'"' '{print $4}')
    fi
  fi
fi

# --- System Info ---
{
  echo "Systeminfo:"
  echo "- VPS with $(grep PRETTY_NAME /etc/os-release | awk -F= '{print $2}' | tr -d '"')"
  echo "- Node version: $(node -v)"
  echo "- npm version: $(npm -v)"
  echo "- Vite version: $vite_version"
} >> "$outfile"

# --- Directory tree ---
{
  echo
  echo "Directory tree:"
  echo "."
  tree "$workdir" -d -I "node_modules" --prune | tail -n +2
} >> "$outfile"

# --- File list ---
{
  echo
  echo "Directory tree including files:"
  find "$workdir" -type f | grep -v "node_modules" | grep -v ".git"
} >> "$outfile"

# --- Project Info ---
{
  echo
  echo "Hey! I’m continuing work on my **WadoCalc Tao** project — a Node.js + React + Tailwind MMORPG calculator."
  echo
  echo "We've already built:"
  echo "- Multi-setup build system"
  echo "- Class and rune selectors for figure out the best build (theory crafting)"
  echo "- Stat summaries (with class + rune + aura support)"
  echo "- Filters using logical expressions like \`(Cr. Dmg AND HP) OR Skill CD\`"
  echo "- Search rune names, rune stones, auras or stats"
  echo "- Fuse.js fuzzy autocomplete for stats, runestones, rune names, auras"
  echo "- Stats Summary sidebar including"
  echo "- Complete Tailwind dark mode UI"
  echo
  echo "Project-Info:"
  echo "- Current Git Repo: https://github.com/waterchickenduc/wado-calc-tao.git"
  echo "- Current Branch: $(git branch --show-current)"
  echo
  echo "Book of honor:"
  echo "- Always send the full code with the full path, always patch the new stuff into the current code. If you don't have it, ask for it."
  echo "- No need for explanation."
  echo "- Always keep the functions already built in, even when we remove stuff for troubleshooting — we want to add them back later again."
  echo
} >> "$outfile"

# --- Static text (TBD) ---
{
  echo
  cat "$workdir/todo.md"
} >> "$outfile"

# --- Success message ---
echo "✅ Project overview generated at: $outfile"

# --- Auto-commit into git ---
echo "🚀 Auto-committing gptPrompt into git..."

git add "$outfile"
git commit -m "Update GPT project overview" || echo "⚠️ Nothing to commit (no changes)"
git push || echo "⚠️ Push failed (check your network or permissions)"

echo "✅ Done!"
