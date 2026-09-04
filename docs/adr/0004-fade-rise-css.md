# ADR 0004: Cover fade-rise in CSS, not Framer Motion

Date: 2026-09-05
Status: Accepted in autopilot, pending owner review

## Context

PRD V4 assigns the cover's fade-rise stagger to Framer Motion (`motion/react`) variants with `staggerChildren`. Milestone 3 built it that way first. Lighthouse mobile then scored 0.94 on three consecutive runs against the 0.95 gate in PRD §10, with the bio paragraph as the LCP element at 3.1s, of which 2.6s was render delay.

The cause is structural, not a tuning problem. A Framer entrance renders the headline, bio and buttons at `opacity: 0` in the server HTML and only reveals them after hydration. On Lighthouse's throttled phone, hydration lands at about 2.6s, so the largest text on the cover cannot paint before then. The poster does not rescue it: on a portrait viewport a 16:9 image under `object-cover` is credited only its intrinsic visible area, which is smaller than the bio, so on phones the LCP element is always text.

`docs/references/hero-v3.html`, which the PRD names as the visual specification for the cover, implements fade-rise as a CSS `@keyframes` animation with per-element delays. A CSS animation starts at first paint, so the text is an LCP candidate within one frame of first contentful paint.

## Decision

The cover fade-rise is a CSS keyframe animation on `.fade-rise`, with the delay set per item from a `--rise-order` custom property and the `--rise-stagger` and `--dur-rise` tokens. `FadeRiseItem` is a server component that sets the order; `FadeRiseGroup` is gone. Reduced motion disables the animation and shows the finished state, and no-JS visitors see the animation too, so the `<noscript>` override is gone as well.

**Amended 2026-09-05: the headline and bio do not rise at all.** The CSS version still starts them at `opacity: 0`, and Lighthouse does not count an element as an LCP candidate until it is painted at full opacity. On the throttled phone that put the eyebrow, the one line outside the stagger, at 2.8s to 3.0s as the LCP element and the score at 0.94 on two CI runs. So fade-rise now applies to the eyebrow and the buttons only; the headline and bio render at full opacity on the first frame and are the LCP candidates on every viewport. Alongside this, the unused weight 500 of Inter and JetBrains Mono is no longer requested, and the poster's preload link carries `fetchpriority="high"`.

`motion` is removed from `package.json` for now. Its only other use this milestone was `useReducedMotion` in `ScrambleText`, which now reads `matchMedia` inside the scramble hook, the same way `HeroVideo` and the scroll helper already do. PRD V7 still needs Framer for the project card morph; milestone 5 adds it back, and PLAN §7 should be read as "motion arrives in milestone 5".

## Consequences

- PRD V4 and A3 now say CSS for fade-rise; V7 keeps Framer for the card morph. The motion inventory in §8 is unchanged: fade-rise still exists, it is just driven by CSS.
- First-party JavaScript on `/` drops because no motion chunk ships until milestone 5.
- The stagger is 200ms and the rise 24px and 800ms, all tokens in `src/styles/tokens.css`. Two items rise: the eyebrow, then the buttons. The headline and bio are static.
- Milestone 7 still has to bring mobile LCP under 2.0s. With CSS fade-rise the number returns to the pre-milestone range, which is bound by font loading, not by this animation.
