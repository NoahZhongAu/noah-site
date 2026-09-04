---
name: milestone
description: Run one PRD milestone end to end - read the plan, build it, verify it, write the report. Invoke as /milestone N, or /milestone N --auto to skip the approval pause (used by scripts/autopilot.sh).
---

You are running milestone **$ARGUMENTS** of docs/PRD.md §11. If the arguments contain `--auto`, you are in autopilot: do not pause for approval at step 3, make reasonable decisions yourself, and record every decision under "Assumed" in the report.

Before touching code:

1. Read CLAUDE.md, docs/PLAN.md, and the milestone entry in docs/PRD.md §11. Read every PRD section that milestone touches. Read the matching file in docs/references/ if there is one.
2. Read the previous milestone's report in docs/reports/ if it exists. Its "Unsure about" list is your first job.
3. Write a short implementation plan for this milestone only: files you will create or change, in order, and the tests you will write. **If not in autopilot, stop and wait for approval.** In autopilot, write the plan to docs/reports/milestone-N-plan.md and continue.

Then:

4. Confirm you are on main and it is clean. Create a branch `milestone/N-<short-name>`.
5. Build in small steps. After each step run `pnpm check`. Commit when green.
6. Write tests for domain logic and for any behaviour the PRD lists under §10 for this milestone.
7. When the milestone's acceptance criteria are met, run the `reviewer` subagent on the diff and fix everything it reports.
8. Run `pnpm check` and `pnpm e2e` one final time.
9. Write `docs/reports/milestone-N.md` with four headings: Works, Does not work, Assumed, Unsure about. Be blunt; a short honest report is worth more than a long reassuring one. Commit it.
10. Print the branch name on its own line as the last line of your output, in the form `BRANCH=milestone/N-<short-name>`. Then stop. Do not push. Do not start the next milestone.

If the PRD and reality conflict and you are not in autopilot, stop and ask. In autopilot, choose the option that adds no dependency and no abstraction, and flag it under "Unsure about".

If any gate cannot be made green, do not weaken the gate. Write what failed in the report, commit, print `BRANCH=` and `STATUS=FAILED`, and stop.
