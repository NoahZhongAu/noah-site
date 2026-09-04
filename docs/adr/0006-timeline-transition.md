# ADR 0006: Story timeline transition, scroll snap and chrome

Date: 2026-09-05
Status: Accepted

## Context

PRD §4.2 specified a 900ms opacity crossfade between era layers and an opacity-only entry fade, and V8 left `scroll-snap` optional. PLAN §6 item 22 recommended against snap. The owner built four candidate transitions in `docs/references/timeline-demo.html` and chose mode B, "focus pull", with mandatory snap on desktop, after scrolling through all four with real entries.

## Decision

**Scroll snap, desktop only.** From 768px the document uses `scroll-snap-type: y mandatory` and every step has `scroll-snap-align: start`, so one wheel gesture moves one entry and each entry fills the screen. Under 768px there is no snap; entries stack as cards as §4.2 already specified. This overrides PLAN §6 item 22. Milestone 4 must confirm that nav anchors, "Know more" and the scroll helper still land on their sections with snap on, and that the cover and the sections after the story are not snapped to.

**Focus pull.** When the active step changes, the outgoing layer transitions to `filter: blur(18px) brightness(0.55)`, `transform: scale(1.06)`, opacity 0 over 1.1s. The incoming layer begins in that state and resolves to `blur(0)`, `scale(1)`, opacity 1 over 1.1s. The easing is `--ease-out` throughout.

**Push-in.** The active layer runs `scale(1)` to `scale(1.07)` over 14s, linear, `animation-fill-mode: forwards`, restarted on each activation.

**Entry text.** Date, title, organisation and bullets each go from opacity 0, `blur(8px)`, `translateY(8px)` to clear over 0.7s, staggered 100ms in that order, once per step.

**Chrome.** A vertical dot rail on the left; the active dot is filled `--fg`, scaled 1.5× and glows with a white shadow. A step counter bottom right in mono, tabular figures, `03 / 07`, current number in `--fg`, rest in `--fg-62`.

**Reduced motion.** No snap, no blur, no push-in, no fireflies, no stagger. Every step shows its final state and the era switches by instant opacity.

**What stays.** `IntersectionObserver` at threshold 0.6 sets the active step by writing `data-era` on the section. CSS reads it. No scroll listeners. Only `transform`, `opacity` and `filter` animate. Every duration and distance is a token.

## Frame-time gate

Two layers carry a blur filter at once during the 1.1s of a transition, and the fireflies canvas draws beneath the text throughout. Milestone 4 measures frame time during a transition on a mid-range Android profile (Chrome DevTools, 4× CPU throttle, 1080×1920 viewport) and reports the number. If it drops below 50fps the blur is reduced from 18px to 10px before any other change is tried. Any further change is a new ADR.

## Consequences

- PRD §4.2, §8 and V8 are amended to match. `--dur-era` changes from 900ms to 1100ms; new tokens for the push-in duration and scale, the blur radii, the text focus duration, distance and stagger.
- `filter` joins `opacity` and `transform` as an animated property on the backdrop. That is inside the rule in CLAUDE.md but it is the first use of blur in motion, hence the gate above.
- Snap changes how every in-page navigation feels while the story is on screen. The e2e tests that land nav anchors on their sections are the regression guard.
- The mobile layout is unchanged: no snap, no sticky, no push-in; the focus-pull CSS is desktop-only by media query, and cards show their 16:9 header at full opacity.
