# Noah Zhong résumé site

A single-page personal site built with Next.js 16, TypeScript and Tailwind CSS v4, deployed on Vercel. The product requirements live in [docs/PRD.md](docs/PRD.md) and the implementation plan in [docs/PLAN.md](docs/PLAN.md). Architectural decisions are recorded in [docs/adr/](docs/adr/) and each milestone ends with a report in [docs/reports/](docs/reports/).

## Setup

Node 22 and pnpm 10, both pinned in `.nvmrc` and `package.json`.

```bash
nvm use
pnpm install
cp .env.example .env.local   # fill in the values you have
pnpm dev
```

`pnpm install` also installs the Husky pre-commit hook, which runs ESLint and Prettier on staged files.

## Scripts

| Script          | What it does                                                                          |
| --------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`      | Local server with hot reload.                                                         |
| `pnpm check`    | Typecheck, lint, format check, unit tests, build, JS budget. Must be green to commit. |
| `pnpm test`     | Vitest unit tests.                                                                    |
| `pnpm e2e`      | Playwright end-to-end tests against `next start`. Run `pnpm build` first.             |
| `pnpm lhci`     | Lighthouse CI, mobile, three runs, median must score 95 or better in every category.  |
| `pnpm js-size`  | Gzipped size of first-party scripts on `/`. Fails above 200KB.                        |
| `pnpm lint:fix` | ESLint and Prettier fixes.                                                            |

## Architecture

Four layers. Dependencies point inward only, enforced by `eslint-plugin-boundaries`.

```
content/          résumé data + Zod schemas      imported by everything, imports nothing
src/domain/       pure functions, contact schema no framework imports, no I/O
src/application/  EmailSender, contact handler   may import domain
src/components/   primitives/ composites/ sections/
src/app/          routes, layout, one API route  may import all of the above
```

`src/styles/tokens.css` is the only place a colour, duration or radius is written. Components use the tokens by name.

## Editing content

All résumé text lives in `content/resume.ts` and is validated by the Zod schema in `content/schema.ts` at build time. An invalid entry fails `pnpm build` with the path of the offending field. No component contains résumé text. (Arrives in milestone 2.)

## Replacing the résumé PDF

Overwrite `public/resume/noah-zhong-resume.pdf`. The `/resume` route redirects there, so the shareable link never changes. A unit test checks the file exists, is a PDF, and is under 1MB. (Redirect arrives in milestone 2.)

## Deploy

The site deploys from GitHub to Vercel. Every pull request gets a preview; `main` deploys to production. Set the variables from `.env.example` in the Vercel project. `/styleguide` is available in `pnpm dev` only and returns 404 in production builds.
