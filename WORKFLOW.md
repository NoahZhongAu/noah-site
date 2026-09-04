# Workflow: building the site with Claude Code

Short answer to your question: yes, feed it the PRD. But not by pasting it into the chat. The PRD goes into the repo, a short `CLAUDE.md` points at it, and the first session is plan mode only. This folder is that setup, ready to drop in.

## 1. What is in this kit

```
CLAUDE.md                        project memory, under 100 lines, points to the PRD
.claude/settings.json            permissions: edits auto-approved, push and installs ask, destructive denied; format hook
.claude/hooks/format.sh          prettier + eslint --fix on every file Claude touches
.claude/agents/reviewer.md       read-only reviewer subagent that checks diffs against your rules
.claude/skills/milestone/        /milestone N runs one milestone with plan → build → verify → report
docs/PRD.md                      the PRD
docs/references/                 hero-v3.html, reference.html, video-hero.md, era guide
docs/adr/                        empty; decisions land here
docs/reports/                    empty; milestone reports land here
```

## 2. Setting up, once

```bash
npx create-next-app@latest noah-site --typescript --tailwind --app --src-dir --use-pnpm
cd noah-site
# copy everything from this kit into the project root, merging into the existing folders
chmod +x .claude/hooks/format.sh
echo ".claude/worktrees/" >> .gitignore
git add -A && git commit -m "chore: add PRD, references, and Claude Code configuration"
```

Then, in Claude Code, run `/init` once. It will read your CLAUDE.md and suggest additions from the scaffold (the exact pnpm scripts, for instance). Accept the useful ones, keep the file under 200 lines.

## 3. The first session: plan only

Start in plan mode so nothing gets written until you have read the plan.

```bash
claude --permission-mode plan
```

Paste this:

```
Read CLAUDE.md, docs/PRD.md in full, and every file in docs/references/.
Then write docs/PLAN.md containing:

1. The folder structure you will create, mapped to the four layers.
2. The content schema in TypeScript, matching PRD §5.
3. A component inventory: every primitive, composite, and section, one line each, with the props it takes.
4. Milestones 1 to 7 from PRD §11, each with concrete acceptance criteria and the tests you will write.
5. Every place where you think the PRD is ambiguous, contradictory, or wrong. Be specific.

Also write docs/adr/0001-stack.md recording the stack from PRD Part A, with the two alternatives you would have considered and why they lose.

Do not write any application code. Stop when both files exist.
```

Read PLAN.md properly. This is the most leveraged fifteen minutes in the whole project. Push back on anything over-engineered, answer its ambiguity list, and only then approve.

## 4. Every milestone after that

One milestone per session. Between milestones, `/clear`. This is not optional; it is the single habit that separates people who get good results from people who get drift.

```bash
claude                      # starts in acceptEdits per settings.json
/milestone 1
```

The skill makes it read the plan, propose the milestone's steps, and wait. Approve. It builds, runs `pnpm check` after every step, runs the reviewer on its own diff, writes the report, and stops.

Then you:

1. Read `docs/reports/milestone-N.md` first. The "Unsure about" section is where the bugs are.
2. Read the diff yourself. Not skim. Read. You are the senior on this project and the agent is a fast junior with no memory.
3. Run it in a browser. Take a screenshot of anything wrong and paste it into the next session with `Ctrl+V`. Claude reads screenshots well and it is the fastest way to fix visual bugs.
4. Open a PR, let CI run, merge. Preview deployment on Vercel is your second pair of eyes.
5. `/clear`, then `/milestone N+1`.

## 5. The tips that actually move you toward professional practice

**The repository is the source of truth, not the chat.** Every decision lives in a file: PRD, PLAN, ADRs, reports. Chat is where you steer; files are where you remember. If a decision only exists in a conversation, it does not exist.

**Keep CLAUDE.md short and make it earn every line.** It loads into every session, so a bloated one costs you context on every turn and gets ignored anyway. Rules and commands go in it. Architecture that can be read from the code does not. When Claude makes the same mistake twice, that is not a chat correction, that is a new line in CLAUDE.md.

**Plan, approve, build. Never skip the approve.** Plan mode exists so you can catch a bad structure before it costs you an hour of undoing. The tell-tale sign of amateur AI coding is a repo where the agent chose the architecture and nobody noticed until milestone four.

**Make verification the agent's job, with tools, not your job, with eyes.** `pnpm check` after every step. The format hook so it never spends a turn on whitespace. Playwright so it can open the page itself. The reviewer subagent so a fresh context reads the diff before you do. Every gate you automate is one you never have to remember.

**One milestone, one branch, one session.** Context degrades. A session that has been going for two hours and forty turns is measurably worse at following your rules than a fresh one. `/context` shows you the usage; at roughly half, `/compact`. At a milestone boundary, `/clear`. Do not push through.

**Ask, ask, then push back.** When the agent stops and asks, it is doing its job. When it does not stop and improvises a new dependency or a new abstraction, that is the moment to intervene. The PRD's forbidden list exists so you can point at a line rather than argue.

**Read every diff as if a stranger wrote it.** Because functionally one did. The questions to ask on every file: does this belong in this layer, could it be simpler, is there a reason for this abstraction, and would I be comfortable explaining this in an interview.

**Use the reviewer before you are the reviewer.** `@reviewer review the staged diff` costs nothing and catches the boring things (a stray `any`, a hardcoded colour, a scroll listener) so your attention goes to the things that need judgement.

**Deviations get an ADR before the code.** Not after. If the agent wants to use a library the PRD did not name, the ADR is where it argues the case and where you approve or deny. This is how professional teams stop scope creep, and it works just as well when the team is one person and an agent.

**Small commits, every one green.** `git log` should read like a story a reviewer can follow. If a commit message needs the word "and", it is two commits.

## 6. When it goes wrong

- **It keeps ignoring a rule.** The rule is in the wrong place or too vague. Move it higher in CLAUDE.md, make it a sentence with a verb, add a concrete example of the violation.
- **It is confidently wrong about the framework.** Ask it to fetch the docs (`nextjs.org` and `motion.dev` are allowed in settings). Do not let it guess at APIs.
- **It rewrote something you did not ask for.** `git checkout -- path` and tell it exactly what was out of scope. Then add the boundary to the milestone prompt next time.
- **Output quality dropped mid-session.** That is context rot. `/compact` or `/clear`, not "please try harder."
- **You are not sure the site actually works.** Neither is it. Run it. Screenshot it. Paste it back.
