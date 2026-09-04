#!/usr/bin/env bash
# Autopilot: run PRD milestones back to back.
#
#   ./scripts/autopilot.sh 2 5      runs milestones 2, 3, 4, 5
#   ./scripts/autopilot.sh 3        runs milestone 3 only
#
# Each milestone is a fresh `claude -p` process, so context never carries over
# (the same effect as /clear). The agent builds, reviews, reports, and commits
# on a branch. This script pushes, opens the PR, waits for CI, merges, and
# moves on. It stops on the first failure so nothing bad compounds.
#
# Requires: claude, gh (logged in), pnpm, a clean main branch.

set -euo pipefail

FROM="${1:?usage: autopilot.sh FROM [TO]}"
TO="${2:-$FROM}"
LOG="docs/reports/autopilot.log"
mkdir -p docs/reports

log() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$*" | tee -a "$LOG"; }

# Refuse to start dirty or off main.
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or stash first." >&2; exit 1
fi
git checkout -q main
git pull -q --ff-only

for N in $(seq "$FROM" "$TO"); do
  log "=== Milestone $N: start ==="

  # 1. Let the agent build it. Fresh process, fresh context.
  OUT="$(claude -p "/milestone $N --auto" \
          --permission-mode acceptEdits \
          --output-format text 2>&1 | tee -a "$LOG")" || true

  BRANCH="$(printf '%s\n' "$OUT" | grep -E '^BRANCH=' | tail -1 | cut -d= -f2- || true)"
  if [ -z "$BRANCH" ]; then
    log "Milestone $N: agent did not print BRANCH=. Stopping."; exit 1
  fi
  if printf '%s\n' "$OUT" | grep -q '^STATUS=FAILED'; then
    log "Milestone $N: agent reported FAILED on $BRANCH. Stopping for review."; exit 1
  fi

  # 2. Push and open the PR. The agent never pushes; this script does.
  git checkout -q "$BRANCH"
  git push -u origin "$BRANCH"
  PR_URL="$(gh pr create --base main --head "$BRANCH" \
            --title "Milestone $N" \
            --body-file "docs/reports/milestone-$N.md")"
  log "Milestone $N: PR $PR_URL"

  # 3. Wait for CI. A red check stops the loop.
  if ! gh pr checks "$BRANCH" --watch --fail-fast; then
    log "Milestone $N: CI failed. Stopping. Fix on $BRANCH, then rerun from $N."; exit 1
  fi

  # 4. Merge and return to main.
  gh pr merge "$BRANCH" --squash --delete-branch
  git checkout -q main
  git pull -q --ff-only
  log "=== Milestone $N: merged ==="
done

log "Autopilot finished milestones $FROM to $TO."
