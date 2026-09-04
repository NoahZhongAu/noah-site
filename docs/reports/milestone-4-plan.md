# Milestone 4 plan: Story timeline

Written 2026-09-05. Scope is PRD §11.4 as amended today: sticky eras with the focus-pull transition (ADR 0006), scroll snap on desktop, fireflies (ADR 0005), dot rail and counter, mobile stacking, observer. The seven era illustrations are already in `public/eras/` at 1920×1080 and 204 to 219KB each, so no gradient placeholders are needed. Sources read: CLAUDE.md, PRD §3, §4.2, §8, §10, PLAN §4, §5 (M4), §6 items 13, 21, 22, 23, 27, `timeline-demo.html` mode B, `reference.html` (rule and border draw), `era-illustrations-guide.md`, the milestone 3 report.

## From the milestone 3 report

- "Sections below the cover are still placeholders": this milestone replaces `#story`. Projects, Skills and Contact stay as they are.
- The nav-anchor e2e accepts "fully on screen at the end of the page" because Contact is short. Unchanged here, but the story is now seven screens tall, so that test also proves anchors land with snap on.
- The two one-off reduced-motion e2e flakes and the port-3000 reuse trap are noted; the story spec uses the same `networkidle` waits as the cover spec.
- LCP, autoplay control, Safari: milestone 7. Nothing in this milestone touches the cover.

## Design decisions to confirm

1. **Snap is enabled only while a step is at least 60% visible.** `scroll-snap-type: y mandatory` on `<html>` for the whole page would also snap the cover and Projects. `StoryTimeline` sets `data-snap` on `<html>` from the same `IntersectionObserver` that picks the active step, and CSS applies snap only under `html[data-snap]`, from 768px, and not under reduced motion. Entering the story re-snaps the viewport to step 1; leaving it turns snap off so Projects scrolls freely. No scroll listener.
2. **Section heading and rule live in the sticky chrome.** A separate heading block above a mandatory-snap section would be skipped or yanked. The `h2` ("Story", mono label) and the border-draw `SectionRule` sit top-left inside the sticky backdrop, next to the rail (left) and the counter (bottom right). The image layers and the canvas are `aria-hidden`; the `h2` is not.
3. **Entry text focuses in once.** The observer records every step it has activated; a seen step keeps its final state, so text does not blur out while a step scrolls away and does not re-fire on the way back. This is what §4.2 says; the demo re-fires, and the PRD wins.
4. **Seven `next/image fill` layers, lazy.** All seven are in the DOM. On desktop they load lazily as the story comes into view, about 1.4MB after the cover has painted; on mobile the backdrop is `display: none` so none of them download and each card's 16:9 header loads its own crop instead (PLAN §6 item 21, one DOM).
5. **Fireflies on mobile.** The canvas lives inside the sticky backdrop, which does not exist under 768px. Two options: (A) no fireflies on phones, the 10-particle count applies only to a narrow desktop-layout viewport; (B) a second placement, a canvas absolutely covering the whole stacked-card section on phones, 10 particles, under the card text. I recommend A: the mobile layout is "no sticky, no pinning", and a per-frame loop over a seven-card section costs battery on exactly the devices the frame-time gate worries about. **Decided: A, no fireflies on phones** (owner, 2026-09-05, at plan approval).
6. **No `scroll-snap-stop: always`.** The spec and the demo use `mandatory` with `start` alignment, which moves one step per wheel gesture on a mouse; a fast trackpad fling can skip a step. If one-per-gesture must be strict, `scroll-snap-stop: always` on each step is one line, added after you have felt it.

## Files, in order

1. `src/styles/tokens.css`: `--dur-era` 900ms to 1100ms; new `--dur-push` 14s, `--push-scale` 1.07, `--focus-blur` 18px, `--focus-scale` 1.06, `--focus-dim` 0.55, `--dur-text-focus` 700ms, `--text-focus-blur` 8px, `--text-focus-rise` 8px, `--text-focus-stagger` 100ms, `--firefly` #FFD27A, `--fg-28` (idle rail dot), `--glow` rgba(255,255,255,0.8), `--scrim-side`. `src/styles/globals.css`: the story rules (`[data-era]` layer states, push keyframes, text focus, rail, counter, snap under `html[data-snap]`, reduced-motion overrides). Styleguide lists the new tokens.
2. Primitives: `SectionRule` (client; the reference's 1px SVG line on the shared `#edge` gradient, draws once via `useOnceInView`), `Bullets` (the 9×1px `--fg-62` dash marker).
3. Hooks: `useOnceInView(ref)`; `useActiveStep(stepRefs)` returning `{ active, seen, inStory }` from one observer at threshold 0.6, default `active` 0 so the server renders step 1 and era 1.
4. Composites: `EraBackdrop` (seven layers plus the side and vertical scrims, `aria-hidden`), `Fireflies` (client, canvas 2D, the demo's script as a component, particle count from width, paused by its own observer at 5% and on `visibilitychange`, re-seeded on resize, renders nothing under reduced motion or Save-Data, exposes `data-running` for the tests), `TimelineRail` and `TimelineCounter` (decorative, `aria-hidden`), `TimelineStep` (one `100svh` snap-aligned step on desktop, a card with a 16:9 header under 768px; same DOM), `StoryTimeline` (client; owns the observer, writes `data-era` and `data-step` on the section and `data-snap` on `<html>`).
5. `sections/Story.tsx` (server): sorts entries, formats dates and durations in the domain, maps era per step with `eraForStep`, passes strings to `StoryTimeline` (PLAN §6 item 27). `src/app/page.tsx` replaces the placeholder `#story`.
6. `scripts/frame-time.mjs`: Playwright with CDP `Emulation.setCPUThrottlingRate(4)` at 1080×1920, scrolls one step, samples `requestAnimationFrame` deltas for the 1.1s transition with fireflies running, prints average fps and the worst frame. Run by hand (`pnpm frame-time`), not a CI gate; the number goes in the report. Under 50fps means blur drops to 10px per ADR 0006.
7. Tests, reviewer, report.

## Tests

Unit (Vitest): `useActiveStep` picks the step with ≥0.6 intersection, defaults to 0, accumulates `seen`, reports `inStory` false when nothing intersects (mocked `IntersectionObserver`); `Fireflies` seeds 24 particles at 1280px and 10 at 390px, renders nothing under reduced motion and under Save-Data, stops on `visibilitychange` (mocked 2D context); `SectionRule` adds the drawn state once and never removes it.

E2E (`tests/e2e/story.spec.ts`): desktop: `#story` is at least seven viewports tall and its backdrop computes `position: sticky`; scrolling to each step sets `data-era` 1 to 7, the counter reads `0N / 07` and the Nth rail dot is active; `html[data-snap]` is present mid-story and absent at the cover and at `#projects`; the active step's text computes opacity 1 and `filter: none` and a previously seen step stays at its final state; the era layers request only from 768px; fireflies canvas is present with `data-running` true, and false after scrolling to `#contact`. Phone at 390px: no sticky element in `#story`, seven cards with headers, no era layer request. Reduced motion: no `data-snap`, no blur on any layer, every step at its final state, era still switches, no canvas. Save-Data: no canvas. No JavaScript: era 1 visible and every entry readable. Axe: zero violations mid-story. Existing cover spec: nav anchors still land with snap on.

## Not in scope

- Projects, Skills, Contact sections and the footer.
- Portrait crops for the era images: the 16:9 headers use `next/image` from the same files.
- Screenshot baselines (milestone 7).
- No dependency is added. `motion` returns in milestone 5.
