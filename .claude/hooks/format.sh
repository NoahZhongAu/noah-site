#!/usr/bin/env bash
# Runs after every Edit/Write. Formats and lint-fixes the touched file so
# Claude never has to spend a turn on whitespace, and so every diff is clean.
set -u
file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json|*.md)
    npx prettier --write "$file" >/dev/null 2>&1 || true
    ;;
esac
case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    npx eslint --fix "$file" >/dev/null 2>&1 || true
    ;;
esac
exit 0
