# Milestone 3 plan: Cover

Written 2026-09-05 in autopilot. Scope is PRD §11.3: video component, poster, scramble, fade-rise, liquid glass, nav. Sources read: CLAUDE.md, PRD §4.1, §8, §10, §12, PLAN §4, §5 (M3), §6 items 5, 6, 7, 9, 19, 20, 29, `hero-v3.html`, `video-hero.md`, the milestone 2 report, and the Next 16 `next/image` docs.

## From the milestone 2 report

- "Unsure about" items (JSON-LD derivation, LinkedIn host, `z.email()` strictness, duration for education entries) all belong to milestones 4, 6 and 7. Nothing to act on here.
- The bracket placeholders in the two projects stay; projects are milestone 5.
- The hero assets the PRD asked Noah for are already committed: `hero-poster.jpg` 1280×720 at 48KB, `hero.mp4` 738KB, `hero.webm` 718KB. No gradient placeholder is needed.

## Files, in order

1. `pnpm add motion` (the one animation library, PRD A3).
2. `src/styles/tokens.css`: glass rim, glass blur, scrim and rise-distance tokens so no component or CSS rule carries a literal. `src/styles/globals.css`: `.liquid-glass` from hero-v3, the fade-rise no-JS and reduced-motion overrides.
3. Primitives: `VisuallyHidden`, `GlassLink`, `GlassButton` sharing one `glassClassName(size)` helper. Styleguide gains a glass block.
4. `src/components/hooks/useScramble.ts` and `composites/ScrambleText.tsx`. The final string is what the server renders; the animated twin is `aria-hidden` and only exists while scrambling.
5. `composites/FadeRiseGroup.tsx` and `FadeRiseItem.tsx` on `motion/react` variants, `staggerChildren` 0.2s, `useReducedMotion` for an instant finish.
6. `composites/HeroVideo.tsx` per video-hero.md with PLAN §6 items 19 and 20: `next/image fill preload` poster beneath a source-less `<video>`; sources attach after mount on desktop, motion-ok, non-Save-Data; `IntersectionObserver` and `visibilitychange` pause it.
7. `src/components/hooks/scrollToHash.ts`, `composites/SiteNav.tsx` (disclosure menu under 768px per PLAN §6 item 29), `composites/ResumeDownloadLink.tsx` with the `resume_download` event, `composites/CoverActions.tsx` for the two hero buttons.
8. `sections/Cover.tsx` wired to content; `src/app/page.tsx` replaces the placeholder `#top` section.
9. Tests, reviewer, report.

## Tests

Unit (Vitest): `useScramble` resolves to the exact string and never touches separators; `ResumeDownloadLink` calls `track("resume_download")` and does not prevent default; `SiteNav` hamburger toggles `aria-expanded`, Escape closes and returns focus.

E2E (Playwright, `tests/e2e/cover.spec.ts`): one `h1` with the headline; eyebrow resolves to the exact string; "Know more" lands on `#story`; each nav anchor lands on its section; no video request at 390px or under reduced motion; video request and off-screen pause on desktop; reduced motion shows every fade-rise item at opacity 1 with no transform; no horizontal scroll at 320px and 2560px; hamburger is keyboard operable; axe zero violations with the menu open.

## Decisions taken without asking (autopilot)

- Fade-rise stays on Framer Motion as PRD V4 says, even though hero-v3 does it in CSS. The no-JS gate is met by a `<noscript>` style override and the reduced-motion pre-hydration paint by a CSS override, both on the `.fade-rise` class. **Superseded the same day by ADR 0004:** the Framer version held the cover text at opacity 0 until hydration and put Lighthouse mobile at 0.94 with LCP at 3.1s, so fade-rise shipped as the reference's CSS keyframes, `FadeRiseGroup` and the `<noscript>` override were removed, and `motion` was taken out of `package.json` until milestone 5 needs it for the card morph.
- The reduced-motion check is a Playwright assertion on computed styles, not a pixel screenshot. Screenshot baselines are platform-specific and a macOS baseline would fail on the Linux CI runner. PRD §10's screenshot suite is milestone 7 work; the decision on Linux baselines belongs there.
- `MonoLabel` is deferred: the eyebrow is its only use this milestone and the `text-mono-label` utility already exists. Rule of three.
- `ResumeDownloadLink` has no `appearance` prop yet. Glass is the only appearance until milestone 6.
- No `usePrefersReducedMotion` hook. `HeroVideo` and `scrollToHash` read `matchMedia` at the moment they act; motion components use `useReducedMotion`.
