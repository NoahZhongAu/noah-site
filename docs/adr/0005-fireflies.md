# ADR 0005: Fireflies over the story backdrop

Date: 2026-09-05
Status: Accepted

## Context

PRD §8 lists the cover video and the era illustrations as the only imagery, and the motion inventory had no ambient effect. The illustrations are night scenes and, seen in `docs/references/timeline-demo.html`, they read as flat stills once the transition ends. The owner wants a small ambient life to the backdrop that matches the cinematic hero without adding a library or a per-frame cost the page cannot afford.

## Decision

A single `<canvas>` sits inside the sticky backdrop, above the era image and below the text and chrome, `aria-hidden="true"`, `pointer-events: none`. It draws fireflies with canvas 2D and no library, in under 3KB gzipped of first-party JavaScript.

- 24 particles from 768px, 10 below.
- Colour is one token, `--firefly` (#FFD27A). Each particle is a radial gradient from the colour at up to 95% alpha through 35% at a third of the radius to transparent at the edge, radius 2 to 5px, drawn at 3× as the halo.
- Slow sine drift with a slight upward bias and edge wrap 20px past each side. Brightness pulses from 20% to 100% on a 2 to 5s cycle with a random phase per particle. A quarter are larger, brighter and about half the speed.
- The loop is `requestAnimationFrame`, started by an `IntersectionObserver` on the backdrop at 5% and stopped when it leaves, and stopped on `visibilitychange` while the tab is hidden. Resize re-seeds the field.
- Not created under `prefers-reduced-motion: reduce` or when `navigator.connection.saveData` is on: the canvas is empty and costs nothing.

The exact drift, pulse and gradient stops are in the fireflies script of `docs/references/timeline-demo.html`, which is the visual reference.

## Consequences

- PRD §4.2, §8 and V8 are amended. The fireflies are an entry in the motion inventory; nothing else was added to it.
- This is the one place on the site with per-frame JavaScript. It runs only while the story backdrop is on screen and the tab is visible. The frame-time measurement in ADR 0006 is taken with fireflies running.
- No new dependency. No new component library or animation library.
- The layer is decorative: it is hidden from assistive technology, cannot take pointer events and the page is complete without it.
