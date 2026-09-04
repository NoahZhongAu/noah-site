---
name: milestone
description: Run one PRD milestone end to end - read the plan, build it, verify it, write the report. Invoke as /milestone N.
---

You are running milestone **$ARGUMENTS** of docs/PRD.md §11.

Before touching code:

1. Read CLAUDE.md, docs/PLAN.md, and the milestone $ARGUMENTS entry in docs/PRD.md §11. Read every PRD section that milestone touches. Read the matching file in docs/references/ if there is one.
2. Read the previous milestone's report in docs/reports/ if it exists. Its "unsure about" list is your first job.
3. Write a short implementation plan for this milestone only: files you will create or change, in order, and the tests you will write. **Stop and wait for approval.**

After approval:

4. Create a branch `milestone/$ARGUMENTS-<short-name>`.
5. Build in small steps. After each step run `pnpm check`. Commit when green.
6. Write tests for domain logic and for any behaviour the PRD lists under §10 for this milestone.
7. When the milestone's acceptance criteria are met, run the `reviewer` subagent on the diff and fix everything it reports.
8. Run `pnpm check` and `pnpm e2e` one final time.
9. Write `docs/reports/milestone-$ARGUMENTS.md` with four headings: Works, Does not work, Assumed, Unsure about. Be blunt; a short honest report is worth more than a long reassuring one.
10. Stop. Do not start the next milestone. Do not push.

If at any point the PRD and reality conflict, stop and ask before building around it.
