# Noah Zhong résumé site

Single-page Next.js 15 (App Router, TypeScript strict) personal site, deployed on Vercel Hobby from GitHub.

**The PRD is the source of truth: @docs/PRD.md.** Read it before any non-trivial work. If the code and the PRD disagree, say so and ask. Never silently pick one.

## Commands

- `pnpm dev` — local server
- `pnpm check` — typecheck + lint + format check + unit tests + build. **Must be green before any commit.**
- `pnpm test` / `pnpm e2e` — Vitest / Playwright
- `pnpm lint:fix` — ESLint and Prettier

## Architecture

Four layers. Dependencies point inward only. `eslint-plugin-boundaries` fails the lint on a violation.

```
content/          résumé data + Zod schemas      → imported by everything, imports nothing
src/domain/       pure functions, contact schema → no framework imports, no I/O
src/application/  EmailSender, contact handler   → may import domain
src/components/   primitives/ composites/ sections/
src/app/          routes, layout, one API route  → may import all of the above
```

## Rules that are not negotiable

- Résumé text never lives in a component. It comes from `content/` only.
- No hex colours or pixel literals in components. Tokens live in `src/styles/tokens.css`.
- Motion is exactly the inventory in PRD §8. Animate `transform`, `opacity`, `filter` only. Every entrance fires once. `prefers-reduced-motion` shows the finished state, not a broken one.
- **No scroll event listeners.** Use `IntersectionObserver` or CSS.
- `EmailSender` is the only abstraction. No DI containers, no repositories over static content, no state-management library, no barrel files, no second animation library.
- Rule of three before extracting anything shared.
- `strict: true`, `noUncheckedIndexedAccess`, zero `any`, no `@ts-ignore` without a one-line reason.
- Australian English in all copy (organise, colour, programme).
- Comments explain _why_. Never _what_.

## How we work

1. **Plan mode first** for every milestone. Propose, stop, wait for approval. No code until approved.
2. Build one milestone per session. Finish it green (`pnpm check`), then stop.
3. Any deviation from the PRD gets an ADR in `docs/adr/` **before** the code, not after.
4. End every milestone with `docs/reports/milestone-N.md`: what works, what does not, what was assumed, what you are unsure about. Be blunt.
5. Conventional Commits, small and focused. Never leave the repo in a non-building state.
6. If you cannot meet a gate, say so. Do not disable the rule, skip the test, or lower the threshold.

## References

Working reference implementations live in `docs/references/`. Read the relevant one before building its section; where a reference and the PRD disagree, the PRD wins on scope and the reference wins on visual detail.

- `hero-v3.html` — the cover: liquid glass, serif headline, fade-rise
- `reference.html` — type scale, section rhythm, border draw, card expand
- `video-hero.md` — the video component, poster-first loading
- `era-illustrations-guide.md` — what the five timeline images are

@AGENTS.md
