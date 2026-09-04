# ADR 0001: Technology stack

Date: 2026-09-04
Status: Accepted (records PRD Part A; the Next.js version is 16, not the 15 the PRD was drafted against)

## Context

A single-page résumé site with one interactive API route, a scroll-driven timeline, a project card morph, and a contact form with spam protection and email delivery. Requirements that shape the choice, from PRD §1 and §10:

- Prebuilt HTML on every visit; LCP under 2.0s on a mid-range phone; Lighthouse 95 or better in all four categories.
- WCAG 2.1 AA, complete SEO, a generated social image.
- One small server function for the contact form, nothing else server-side. No database.
- Free hosting with previews per pull request.
- The repository is read by engineers at AI companies as a code sample, so the stack should be one they recognise and the architecture should be visible in the folder tree.
- Owner maintains résumé content in one typed file and the PDF by hand.

## Decision

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router, TypeScript strict, pnpm | Static generation of `/`, Route Handlers for the one API, Metadata API, `opengraph-image`, `sitemap`, `robots`, `next/font` and `next/image` all built in. Turbopack default. Vercel first-class. |
| Styling | Tailwind CSS v4 with tokens as CSS custom properties | Tokens in one file consumed by `@theme`; utilities for layout; plain CSS for the few effects (`.liquid-glass`, border draw, era crossfade). |
| Fonts | Instrument Serif, Inter, JetBrains Mono via `next/font/google` | Self-hosted at build, zero layout shift, no runtime request. |
| Motion | `motion/react` (Framer Motion) for fade-rise and the card morph; CSS for everything else | One animation library. `layout` is the cleanest in-place morph in React. Scroll effects use `IntersectionObserver` and CSS, never per-frame JavaScript. |
| Content | Typed TypeScript objects validated by Zod at build | Invalid content fails the build with the offending path. One file to edit. |
| Résumé | Static PDF in `public/resume/`, `/resume` redirect | Nothing to generate, nothing to break, a short shareable link. |
| Email | Resend behind an `EmailSender` interface | Free tier is enough; the interface keeps the SDK in one file and gives tests a fake. |
| Spam | Honeypot plus Cloudflare Turnstile | Free, no database, no rate-limiter state. |
| Analytics | `@vercel/analytics` custom event, `@vercel/speed-insights` | Download counting without a database. |
| Quality | ESLint flat config (typescript-eslint type-checked, jsx-a11y, boundaries), Prettier, Vitest, Playwright, axe, Lighthouse CI, Husky, lint-staged | Every PRD §10 gate has a tool that fails CI. |
| Hosting | Vercel Hobby from a public GitHub repo | Free, previews per PR, custom domain. |

## Alternatives considered

### Alternative A: Astro with React islands

Astro ships zero JavaScript by default and renders the cover, timeline text, skills and footer as pure HTML. Interactive parts (video attach, scramble, project morph, form) become React islands. Static output, Vercel adapter, content collections with Zod validation built in.

Why it loses:

- The site needs three React islands with shared state and `motion/react` `layout` animations anyway, so the JavaScript saving on this page is small, and the island boundary adds a second mental model.
- The contact route, generated OG image, sitemap and robots need the Vercel adapter and Astro endpoints; all work, but each is a second way of doing something Next does with a file convention.
- The audience judges the repository. Next App Router is the framework those readers know; an Astro layout with React islands invites "why not Next" instead of "this is clean".
- PRD Part A had already chosen Next. Reopening it needs a stronger reason than a smaller bundle on a page that is dominated by a poster image and a video.

### Alternative B: Vite + React single-page app, contact form on a separate serverless function

A plain Vite React app deployed as static files, with `api/contact` as a standalone Vercel or Cloudflare function. Smallest possible framework surface, fastest builds, no framework version churn.

Why it loses:

- No prerendering out of the box. A client-rendered page has an empty HTML shell, which hurts LCP, SEO and the no-JavaScript reading of the cover; adding `vite-plugin-ssr` or a prerender step reintroduces a framework's worth of configuration.
- Metadata, Open Graph image generation, sitemap, robots, font self-hosting and responsive images all need separate libraries or hand-written scripts. Each is a small thing; together they are more code than the site itself.
- Two deploy targets (static assets and a function) with two configurations, for a project whose PRD asks for one repository that reads as simple.

### Component-level alternatives rejected in passing

| Instead of | Rejected | Why |
|---|---|---|
| Framer Motion | GSAP | Imperative API, larger, and its ScrollTrigger tempts scroll listeners the PRD forbids. |
| Framer Motion | CSS only | Would meet the budget more easily but loses the `layout` morph quality. Revisit after M3 if the JS budget cannot be met (PLAN §6 item 1). |
| Tailwind v4 | CSS Modules | Tokens and rhythm are easier to keep consistent with `@theme`; the few bespoke effects stay in plain CSS either way. |
| Resend | Nodemailer over SMTP | Needs a mailbox with SMTP credentials and gives no delivery visibility. |
| Turnstile | IP rate limiting | Needs Redis or a KV store, which the PRD's no-database rule excludes. |
| Turnstile | hCaptcha | Visible challenge by default; Turnstile is invisible for most visitors. |
| Static PDF | Generated PDF from content | Two renderers to keep in sync for a document the owner already maintains elsewhere. |

## Consequences

- Next.js 16 changes several assumptions in the PRD (Suspense around `useSearchParams`, `preload` instead of `priority`, no `next lint`, generated route types before `tsc`, no bundle-size output). PLAN §1 lists each with its handling.
- The measured framework floor is 136KB of gzipped JavaScript on an empty page, above the PRD's 120KB budget. The budget needs restating (PLAN §6 item 1) before Milestone 1 can enforce it.
- A strict nonce CSP is not available on a static page. The security headers will be static and `script-src` will include `'unsafe-inline'`; ADR 0002 will record that in Milestone 7.
- Every dependency added is named in PLAN §7. Anything not on that list needs its own ADR before it is installed.
