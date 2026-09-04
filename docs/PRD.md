# Noah Zhong — Personal Résumé Site
## Requirements-to-Stack Map and Product Requirements Document

Version 1.1 · September 2026 (1.0 targeted Next.js 15; bumped to Next.js 16 on 2026-09-04, see docs/PLAN.md §1)

---

# Part A. Requirements-to-Stack Map

Every visual and structural requirement gathered so far, matched to the technology that delivers it and the reason that technology was picked over the alternatives. The stack is decided here; the PRD in Part B assumes it.

## A1. Visual requirements

| # | Requirement | Technology | Why this, and not something else |
|---|---|---|---|
| V1 | Full-screen cinematic illustrated video hero (night sky, figure at glowing laptop), looping, silent | Native `<video>` with `poster`, wrapped in a `HeroVideo` client component; poster via `next/image` | No library needed. The poster is what the browser measures for load speed; the video attaches only after the page is interactive, desktop only, and pauses off-screen. A video library would add weight for no gain. |
| V2 | Serif display headline with muted emphasis words; clean sans body; mono for labels | `next/font/google` self-hosting Instrument Serif, Inter, JetBrains Mono | `next/font` downloads the fonts at build and serves them from your own domain with zero layout shift. No runtime request to Google. |
| V3 | Liquid-glass nav pill and buttons (gradient rim, blurred fill) | Plain CSS utility class `.liquid-glass` using `backdrop-filter` and a masked `::before` gradient border | It is 15 lines of CSS. Any component library version of this would be heavier and less faithful to the reference. |
| V4 | Fade-rise stagger on hero text and buttons | Framer Motion (`motion/react`) `variants` with `staggerChildren` | The one animation library in the project. It also handles V7, so it earns its place. |
| V5 | Text scramble on the eyebrow line, plain white | Custom 40-line `useScramble` hook, `requestAnimationFrame` | Too small to justify a dependency. Renders the final string in HTML so screen readers and no-JS visitors see real text. |
| V6 | Border draw on section rules (on scroll-in) and on CTA hover | Inline SVG `stroke-dasharray` and `stroke-dashoffset` animated with CSS; scroll trigger via `IntersectionObserver` | Runs on the compositor thread. No JS per frame. |
| V7 | Project card expands in place, siblings dim, URL reflects the open card | Framer Motion `layout` and `layoutId` on the card; `useSearchParams` for `?project=slug` | `layoutId` is the cleanest implementation of a shared-element morph in React. URL state makes the expanded card linkable and gives the back button meaning. |
| V8 | Scroll-driven story timeline: each experience fills the screen one at a time; background crossfades through five computing-era illustrations as you scroll | `position: sticky` backdrop inside a tall section; one `100svh` step per entry; `IntersectionObserver` sets the active era; CSS `opacity` transition crossfades five `next/image` layers; optional `scroll-snap` | Zero scroll listeners, zero per-frame JavaScript. Opacity transitions are handled by the GPU. This is the simplest thing that cannot stutter. |
| V9 | Big, readable, pure-white type; colour or imagery reaching every pixel; no flat black bands between sections | Design tokens as CSS custom properties consumed by Tailwind v4 `@theme`; fixed full-viewport background layers; no section paints an opaque background | Tokens in one file mean one place to change. Fixed layers mean the backdrop is never "behind the hero only." |
| V10 | Reduced-motion compliance across every effect | `prefers-reduced-motion` media query in CSS; `useReducedMotion()` from Framer Motion in components | Content appears at its final state instantly. Video shows poster only. This is a hard acceptance gate, not a nice-to-have. |
| V11 | Responsive from 320px to 2560px | Tailwind breakpoints; fluid type via `clamp()`; timeline collapses to stacked cards under 768px | Pinned full-screen steps are hostile on phones; stacking is the honest mobile version. |

## A2. Structural requirements

| # | Requirement | Technology | Why this, and not something else |
|---|---|---|---|
| S1 | Single page: cover, story timeline, projects, skills, contact; nav anchors to each | Next.js 16 App Router, one route `/` statically generated; sections as server components with client islands for motion | The whole page is prebuilt HTML at deploy time. Only the interactive bits ship JavaScript. Fastest possible first paint. |
| S2 | Cover with name, role, one-liner, "Know more" scroll button, section nav | Section component; `scrollIntoView` with `behavior: smooth` respecting reduced motion | Nothing to add. |
| S3 | Story timeline runs oldest to newest, education included as milestones | Content-driven: every entry (job, degree, milestone) is one typed record with `kind`, `start`, `end`; the timeline sorts ascending. The hand-maintained PDF is reverse-chronological by convention and is not generated from this data. | One typed record per entry, sorted by a domain function. |
| S4 | Web résumé content lives in one place | `content/resume.ts` typed with Zod schemas in `content/schema.ts`; validated at build, build fails on invalid content. The PDF is a separate, hand-maintained file that the web never reads (see §6). | Editing the web résumé means editing one file and never touching a component. |
| S5 | Visitor can download Noah's official PDF résumé | Static file at `public/resume/noah-zhong-resume.pdf`, served by Next.js as a plain asset; a `/resume` redirect in `next.config` for a clean shareable link | Noah maintains the résumé himself. A static file has no runtime, no cold start, and nothing to break. |
| S6 | Contact form with real server-side validation, spam protection, and email delivery | Next.js Route Handler `app/api/contact/route.ts`; Zod schema shared with the client; honeypot field; Cloudflare Turnstile; Resend behind an `EmailSender` interface | Turnstile is free and needs no database, which rules out an IP rate limiter that would need Redis. Resend's free tier is 3,000 emails a month. The interface means Resend can be swapped in one file. |
| S7 | Download count for the résumé | `@vercel/analytics` custom event `resume_download` fired from the download link's click handler | Counting without a database. Vercel Analytics is free on Hobby. |
| S8 | Deployed on Vercel free tier from a public GitHub repo, preview per pull request | Vercel Hobby plan, GitHub integration, `main` to production | Free, no card, custom domain included. |
| S9 | Never feels stuck at runtime | Static page; no scroll listeners; compositor-only animations; video paused off-screen; one API route under 300ms | Performance is a consequence of the choices above, not a separate task. |
| S10 | Accessibility WCAG 2.1 AA; SEO complete | `eslint-plugin-jsx-a11y`; `@axe-core/playwright` in CI; Next Metadata API; `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`; JSON-LD `Person` in the root layout | All built into Next.js or standard plugins. No custom SEO library. |
| S11 | Code follows SOLID, KISS, DRY and a four-layer architecture | Folder structure mirrors the layers; `eslint-plugin-boundaries` enforces import direction; ADRs in `docs/adr/` | Rules that are enforced by the linter survive the next contributor. Rules in a README do not. |
| S12 | Tests and CI | Vitest and Testing Library for domain logic and the contact flow; Playwright for e2e and axe; Lighthouse CI with a budget; GitHub Actions | Every gate in Part B section 10 runs on every pull request. |

## A3. Final stack, in one place

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript strict, pnpm |
| Styling | Tailwind CSS v4, tokens as CSS custom properties |
| Fonts | Instrument Serif, Inter, JetBrains Mono via `next/font` |
| Motion | Framer Motion (`motion/react`) for reveals and the card morph; CSS for everything else |
| Content | Typed TS files validated by Zod at build |
| Résumé | Static PDF maintained by hand in `public/resume/` |
| Email | Resend behind `EmailSender` interface |
| Spam protection | Honeypot field plus Cloudflare Turnstile |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` |
| Quality | ESLint (typescript-eslint type-checked, jsx-a11y, boundaries), Prettier, Vitest, Playwright, axe, Lighthouse CI |
| Hooks | Husky plus lint-staged |
| Hosting | Vercel Hobby, GitHub |

---

# Part B. Product Requirements Document

## 1. Overview

A single-page personal résumé site for Noah Zhong, an AI Deployment Engineer and Monash Computer Science student in Melbourne, targeting Forward Deployed Engineer and Applied AI Engineer roles. The site has two jobs: make a strong first impression in under ten seconds, and hand a recruiter an official PDF résumé without friction. It is also a public codebase, so the code quality is part of the product.

### Goals

1. A visitor understands who Noah is and what he does within one screen.
2. A recruiter can download Noah's PDF résumé in one click.
3. The site loads fast on a mid-range phone and never stutters.
4. The repository reads as senior-quality engineering.

### Non-goals

No CMS, no authentication, no database, no blog, no comments, no internationalisation, no analytics dashboard. If any of these appear necessary, stop and ask.

## 2. Audience

**Primary:** technical recruiters and hiring managers at AI companies, spending 30 to 90 seconds, usually on desktop, often arriving from a LinkedIn or email link.

**Secondary:** engineers reading the public repository to judge code quality.

**Tertiary:** anyone on a phone following a shared link. They get the stacked layout and the poster image, not the video or the pinned timeline.

## 3. Information architecture

One route, `/`, with six sections in this order, each reachable by nav anchor:

1. **Cover** (`#top`)
2. **Story** (`#story`), the scroll-driven timeline
3. **Projects** (`#projects`)
4. **Skills** (`#skills`)
5. **Contact** (`#contact`)
6. **Footer**

Supporting routes:

- `/api/contact` (POST) — contact form handler
- `/resume` — permanent redirect to `/resume/noah-zhong-resume.pdf`, so the shareable link stays short and the file can be replaced without changing it
- `/opengraph-image` — generated social preview
- `/sitemap.xml`, `/robots.txt`
- `/styleguide` — development only, returns 404 in production

## 4. Section requirements

### 4.1 Cover

Full viewport height. Background is the illustrated night-scene video (V1) with poster fallback. Content, top to bottom:

- Navigation row: name at left as the logo; liquid-glass pill with Story, Projects, Skills, Contact; liquid-glass "Download résumé" button at right. Hamburger below 768px. The nav is in-flow inside the cover only and does not persist while scrolling; the timeline rail and the footer links cover navigation elsewhere.
- Eyebrow line in mono, white, text-scramble on load: `MELBOURNE · AI DEPLOYMENT ENGINEER · OPEN TO 2027 GRADUATE ROLES`
- Headline in Instrument Serif, two lines, emphasis words in muted grey: *AI systems, **deployed** where the work **actually happens.***
- One-paragraph bio, max 56 characters per line.
- Two liquid-glass buttons: **Know more** (smooth-scrolls to `#story`) and **Download résumé**.
- Fade-rise stagger: headline, then bio, then buttons, 200ms apart.

### 4.2 Story timeline

Purpose: tell the career as a forward-moving story and show breadth.

**Data:** every entry in `content/resume.ts` with `kind: "role" | "education" | "milestone"`, sorted ascending by start date. Expected entries: XJTLU 2022, Chengtian co-founding 2023, Suzhou tutoring and debate coaching 2024, CUHK-Shenzhen internship 2024, Monash 2025, Airbotix 2026, AIDC 2026. Seven steps at launch.

**Layout, desktop (768px and up):** a tall section whose height is `steps × 100svh`. A `position: sticky; top: 0; height: 100svh` backdrop holds seven era illustrations stacked absolutely, one per step. Each step is a `100svh` block containing one entry, vertically centred, left-aligned, max width 60ch: date range and duration in mono, role or degree title in serif, organisation, one to five bullets. A thin vertical rail at the left edge shows all steps as dots, the active one filled.

**Era backdrop:** seven illustrations, one per step, mapped by step range so the mapping can change without code. Era boundaries are configured in content, not hardcoded. Crossfade by opacity over 900ms when the active step changes. Every figure in every illustration is seen from behind or in silhouette, matching the hero.

| Era | Subject | Step (of 7, set in content) |
|---|---|---|
| 1 | Human computers at a row of desks with adding machines, 1940s | 1 |
| 2 | Turing-era relay machine, paper tape, one operator | 2 |
| 3 | Mainframe hall, von Neumann era, reel-to-reel cabinets and a console | 3 |
| 4 | Personal computing, a CRT with floppy disks and a modem | 4 |
| 5 | The laptop era: the cover scene, figure at the desk | 5 |
| 6 | The mobile era: the figure sitting in the meadow lit by a phone | 6 |
| 7 | Present-day: the same figure at the laptop beside a server cabinet | 7 |

**Layout, mobile (under 768px):** no sticky, no pinning. Entries stack as cards; each card's header is a 16:9 crop of its era illustration. Same content.

**Behaviour:** `IntersectionObserver` with `threshold: 0.6` marks the active step and updates a `data-era` attribute on the section. CSS reads that attribute to set layer opacity. Entry text fades in on opacity only, once. Section rule border-draws once when the section enters view. No scroll listeners anywhere.

### 4.3 Projects

Grid of cards, `auto-fit, minmax(340px, 1fr)`. Each card: category tag in mono, title in serif, stack line in mono, one-sentence pitch, "Click to expand" hint. Each card is an `<article>` whose header is a `<button>` trigger with `aria-expanded`; the detail panel and its links live inside the article, never inside the button.

Clicking a card sets `?project=slug`. The card animates with `layoutId` to span the full grid width and reveals its detail list and links (live, repo). Siblings fade to 34% opacity. Escape or a second click closes and clears the query. Focus moves into the expanded card on open and back to the trigger on close. Reduced motion: instant open, no animation.

Initial projects: the local RAG system over quant literature; the cardiovascular risk research project; the AIDC agent harness operations write-up; this site itself, with a link to the repo.

### 4.4 Skills

Bento grid, five groups matching the résumé: LLM & Agent Systems, Evaluation & Machine Learning, Languages, Backend & Data, Production & Delivery. The first group spans two columns. Each cell: group label in mono, items as a comma-separated sentence, not a tag cloud.

### 4.5 Contact

Two columns on desktop.

Left: headline *Let's build something.*, one line of availability, email as a liquid-glass button, GitHub and LinkedIn links.

Right: the form. Fields: name, email, message, a visually hidden honeypot field, and a Turnstile widget. Submit button border-draws on hover and focus. States: idle, submitting (button disabled, spinner), success (inline confirmation, form cleared), error (inline message explaining what to do; never the raw server error).

### 4.6 Footer

Name, year, "Built with Next.js, deployed on Vercel", link to the repository, link to `/resume`.

## 5. Content model

```ts
// content/schema.ts (Zod)
Person      { name, role, eyebrow, headline, location, email, links{github, linkedin}, bio, availability }   // ADR 0003
Entry       { id, kind: "role"|"education"|"milestone", title, org, location,
              start: YYYY-MM, end: YYYY-MM | "present", bullets: string[1..5],
              stack?: string[] }
Project     { slug, category, title, stack: string[], pitch, details: string[], links{live?, repo?} }
SkillGroup  { label, items: string[] }
Era         { id, image, alt, fromStep, toStep }
Resume      { person, entries, projects, skills, eras }
```

`content/resume.ts` exports one `Resume` object. `content/index.ts` parses it with the schema and throws a readable error listing every failing field. The build imports from `content/index.ts` only.

## 6. Résumé file

Noah maintains his official résumé outside this project and commits it as `public/resume/noah-zhong-resume.pdf`. The site does not generate, transform, or read it.

- Download buttons on the cover and in Contact link to `/resume`, which redirects permanently to the file. Links use the `download` attribute so the browser saves rather than opens where supported.
- The click handler fires the `resume_download` analytics event, then lets the navigation proceed.
- Replacing the résumé is a one-file commit. The filename never changes, so shared links keep working.
- CI checks the file exists and is a valid PDF under 1MB, so a preview deployment fails loudly if it goes missing.
- The web content in `content/resume.ts` and the PDF are edited separately. The README carries a one-line reminder to update both.

## 7. Backend specification

### 7.1 `POST /api/contact`

Request body validated against `domain/contact.schema.ts` (Zod), the same schema the client uses:

```
name: 2..80 chars · email: valid · message: 20..2000 chars
website: must be empty (honeypot) · turnstileToken: string
```

Sequence: read the honeypot field before any validation; if it is filled, log and return 200 silently → validate body → verify Turnstile token server-side → send notification email to `CONTACT_TO_EMAIL` with reply-to set to the visitor → return `{ ok: true }`. The honeypot check runs first so a bot never receives a 400 that names the field.

Errors: validation returns 400 with field errors; Turnstile failure returns 403 with a plain message; provider failure returns 502 with "Could not send right now, please email me directly at …" and logs the provider error server-side. Provider errors are never returned to the client.

Runtime: Node.js. Target under 300ms excluding the provider call.

### 7.2 `EmailSender` interface

```ts
// application/email/EmailSender.ts
interface EmailSender {
  send(msg: { to: string; replyTo?: string; subject: string; text: string; html?: string }): Promise<void>;
}
```

`ResendEmailSender` implements it. `FakeEmailSender` implements it for tests and records what it was asked to send. The route handler receives an `EmailSender` from a single factory in `application/email/index.ts`. Nothing outside that file imports the Resend SDK. This is the only deliberate abstraction in the project.

### 7.3 Environment variables

`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_SITE_URL`. All documented in `.env.example`. `.env*` git-ignored.

## 8. Visual system

Full specification lives in the reference files already produced: `hero-v3.html` and `video-hero.md` for the cover, `reference.html` for typography scale, section rhythm, and the border-draw and card mechanics. This section lists only what the PRD fixes.

**Tokens** (one file, `src/styles/tokens.css`, consumed by Tailwind `@theme`):

```
--bg: hsl(201 100% 13%)          --fg: #FFFFFF
--fg-80: rgba(255,255,255,.80)   --fg-62: rgba(255,255,255,.62)   floor for any text
--line: rgba(255,255,255,.18)    --line-soft: rgba(255,255,255,.09)
--glass: rgba(255,255,255,.045)
--font-display: Instrument Serif · --font-body: Inter · --font-mono: JetBrains Mono
--dur-fast 180ms · --dur-base 320ms · --dur-slow 620ms · --dur-draw 900ms · --dur-era 900ms
--ease-out cubic-bezier(.16,1,.3,1)
radius: 6px inputs, 12px cards, 999px pills
spacing: 4px scale, section rhythm 96px mobile / 160px desktop
```

**No accent colour.** The palette is white on `--bg`. The border-draw stroke is `--fg` fading to transparent at both ends; bullet markers are `--fg-62`. The violet and teal in `reference.html` do not apply to this project.

**Type scale:** headline `clamp(3rem, 8.5vw, 6rem)` serif 400, `line-height .95`, `letter-spacing -.03em`; section titles `clamp(2.5rem, 6vw, 4.5rem)`; body `clamp(17px, 1.15vw, 20px)`; mono labels 12 to 13px, `.02em` to `.18em` tracking.

**Backgrounds:** the cover video and the era illustrations are the only imagery. Sections between them sit on `--bg` with the same grain overlay, never on flat black.

**Motion inventory, complete:** fade-rise (cover), text scramble (cover eyebrow), border draw (section rules on enter, buttons on hover and focus), card morph (projects), era crossfade and entry fade (story). Nothing else. Any new effect requires a PRD change.

## 9. Architecture and code principles

**Layers and folders**

```
content/            content data and Zod schemas          (Content)
src/domain/         pure functions, contact schema         (Domain)
src/application/    email, contact handler, resume service (Application)
src/components/     primitives/ composites/ sections/      (Presentation)
src/app/            routes, layout, API route handler
public/hero, public/eras, public/resume
docs/adr/
```

Dependencies point inward only. `eslint-plugin-boundaries` fails the lint if presentation imports application, or anything imports a framework into domain.

**SOLID, as it applies here**

- Single responsibility: a section component composes; it does not format dates or fetch. Formatting lives in `domain/`.
- Open/closed: variants by props and composition. No boolean-flag components.
- Liskov: components wrapping native elements extend `ComponentProps<'element'>`.
- Interface segregation: a component receives the fields it uses, not the whole résumé.
- Dependency inversion: `EmailSender`. The one abstraction. Do not add others.

**DRY:** one source each for content, tokens, and the contact schema. Rule of three before any other abstraction.

**KISS, forbidden:** dependency injection containers, repository layers over static content, global state libraries, barrel files that hide the dependency graph, single-implementation abstractions other than `EmailSender`, and any second animation library.

**Documentation:** README with setup, scripts, how to edit content, how to replace the résumé PDF, deploy steps, and the layer diagram. One ADR per architectural decision, starting with `0001-stack.md` recording the choices in Part A.

## 10. Non-functional requirements and acceptance gates

All enforced in CI on every pull request. A failing gate blocks merge.

**Performance**
- Lighthouse mobile: Performance, Accessibility, Best Practices, SEO all ≥ 95.
- LCP ≤ 2.0s (the poster image is the LCP element; verify in the Lighthouse trace).
- CLS ≤ 0.05. No layout shift from fonts, video, or animation.
- JavaScript shipped to the client ≤ 200KB gzipped on `/`, first-party scripts only: the legacy `noModule` polyfill and third-party scripts (Turnstile, Vercel Analytics) are excluded. Measured by `scripts/client-js-size.mjs` over the scripts referenced by the prerendered `/` HTML; a failing check in `pnpm check` and CI from milestone 1. (Was 120KB; raised 2026-09-04 because the empty Next.js 16 scaffold measures 136KB.)
- No scroll event listeners in the codebase. Grep for `addEventListener("scroll"` returns nothing.
- Video and any future canvas pause when off-screen and when the tab is hidden.

**Accessibility**
- axe reports zero violations on `/` in three states: initial, one project expanded, contact form with errors.
- Full keyboard traversal with visible focus on every interactive element.
- One `h1`, logical heading order, landmarks, skip link.
- Reduced motion: every effect disabled; the page must look finished, not broken. Screenshot test in Playwright.

**SEO**
- Title, description, canonical, Open Graph and Twitter tags, generated OG image, sitemap, robots, JSON-LD `Person` with `jobTitle`, `alumniOf`, `worksFor`, `knowsAbout`, `sameAs`.

**Security**
- All input validated server-side. Honeypot and Turnstile on the form. Static security headers and CSP via `headers()` in `next.config`, with `'unsafe-inline'` where the static page requires it (ADR 0002). No secrets in the client bundle. `pnpm audit` clean of high severity.

**Correctness**
- TypeScript strict with `noUncheckedIndexedAccess`; zero `any`; zero lint warnings; Prettier clean.
- Vitest: domain functions, contact handler with `FakeEmailSender` (happy path, validation failure, honeypot, provider failure).
- Playwright: cover renders, nav anchors work, timeline changes era on scroll, project expands and URL updates and Escape closes, form validation and success, `/resume` resolves to a PDF response.

## 11. Milestones

1. **Foundation** — repo, tooling, CI, tokens, fonts, layout shell, `/styleguide`. Gate: CI green on an empty page.
2. **Content and domain** — schemas, `resume.ts` populated, domain functions, tests. Résumé PDF committed and the `/resume` redirect wired.
3. **Cover** — video component, poster, scramble, fade-rise, liquid glass, nav.
4. **Story timeline** — sticky eras, steps, observer, mobile stacking. Placeholder gradients until illustrations arrive.
5. **Projects and Skills** — card morph with URL state, bento.
6. **Contact** — form, Turnstile, `EmailSender`, Resend.
7. **Hardening** — a11y pass, SEO pass, Lighthouse budget, reduced-motion screenshots, README and ADRs, production deploy.

Each milestone ends with typecheck, lint, tests, and build green, and a short written report of what works, what does not, and what was assumed.

## 12. Assets Noah supplies

- `public/hero/hero.mp4`, `hero.webm` (≤ 2.5MB), `hero-poster.jpg` (≤ 120KB, 1280×720)
- `public/eras/era-1.jpg` … `era-7.jpg`, 1920×1080, ≤ 220KB each, plus 16:9 crops for mobile card headers generated by `next/image`
- `public/resume/noah-zhong-resume.pdf`, his existing résumé, under 1MB
- Final web content with real numbers in place of every `[bracket]` in the résumé draft
- GitHub and LinkedIn URLs
- Resend account and verified sending domain; Turnstile site and secret keys; Vercel project linked to the repo

Until the illustrations arrive, the timeline uses five flat gradient placeholders in the era colours so the mechanics can be built and tested.

## 13. Open questions

1. Oldest-first ordering on the web timeline: confirmed 2026-09-04.
2. Seven eras, one per entry, illustrations supplied 2026-09-05. Mapping: era N is step N. It lives in content and can change without code.
