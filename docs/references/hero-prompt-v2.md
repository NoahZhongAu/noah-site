# Hero Section Spec — paste to your coding agent

Replaces Section 6.4 (the load sequence) and the hero portion of Section 6.5 in the build brief. Everything else in the brief still applies: layering rules, the reduced-motion rule, the token file, the quality gates.

**Reference implementation: `hero-v2.html`.** It is a working single file. Read its CSS and its shader. Where this spec and that file disagree, the file wins.

---

## Background: WebGL silk, not video

Do **not** use a video file. Render the flowing background with a WebGL fragment shader.

- Full-screen fixed canvas, `z-index: 1`, `width: 100%; height: 100%`.
- Beneath it at `z-index: 0`, a static CSS radial-gradient stack in the same colours, which stays visible if WebGL is unavailable or the shader fails to compile. Detect failure and `display: none` the canvas rather than showing black.
- Technique: 5-octave value-noise FBM with two levels of domain warping. `q = fbm(p + t)`, `r = fbm(p + 3.6q + t)`, `f = fbm(p + 3.8r)`. Mix four colours by `f`, `length(q)` and `r.x`.
- Colour stops: `#03040A` base, `#17268F` deep blue, `#64CEFB` light blue, `#6B3DDB` violet.
- Time multiplier `0.055`. Slower than it feels like it should be.
- **Render the canvas at 55% of viewport resolution** and let CSS scale it up. The image is soft so it is invisible, and it cuts fill-rate cost by roughly two thirds.
- Pause the render loop on `visibilitychange` when the tab is hidden.
- Under `prefers-reduced-motion: reduce`, draw exactly one frame at a fixed time value and stop the loop. Do not show a blank canvas.

Above the canvas, two fixed overlays:

- `z-index: 2` vignette: `radial-gradient(120% 85% at 50% 45%, transparent 40%, rgba(0,0,0,.72) 100%)` plus a top-and-bottom linear darkening. This is what makes the text readable.
- `z-index: 3` grain: inline SVG `feTurbulence`, `baseFrequency 0.9`, 3 octaves, `opacity .30`, `mix-blend-mode: overlay`.

Content sits at `z-index: 4`.

---

## Layout

Section is `min-height: 100svh`, a column flex container. Inner wrapper `max-width: 1400px`, centred, horizontal padding `clamp(20px, 4vw, 52px)`.

Three stacked bands:

1. **Nav**, `padding: 26px 0`
2. **Top row**, two columns, `padding-top: clamp(24px, 5vw, 64px)`
3. **Hero**, `flex: 1`, centred both axes, `text-align: center`

---

## Navigation

**Left:** logo mark plus name. Mark is a 22px circle, `2px solid #FFFFFF` border, containing an 8px filled white circle, centred with grid. Name in the display face at 600 weight, `1.0625rem`, `-0.02em` tracking.

**Centre-right:** links in a rounded pill.

```
border: 1px solid rgba(255,255,255,.18)
border-radius: 999px
padding: 11px 24px
gap: 26px
background: rgba(255,255,255,.045)
backdrop-filter: blur(10px)
```

Links: `0.875rem`, `rgba(255,255,255,.80)`, to full white on hover, `transition: color .2s`. Order: Home, Experience, Projects, Skills, Writing, Contact. Contact carries a 13px arrow icon that translates 3px right on hover.

**Below 1024px:** hide the pill, show a 42px circular hamburger button with the same border and background.

Every link needs a visible focus ring: `2px solid #64CEFB`, `offset 4px`.

---

## Top row

Two columns, `minmax(0,1fr) auto`, gap 32px, items aligned to start.

- Left, `max-width: 46ch`: *"I build and operate LLM agent systems inside customer operations, from first prototype through to production support, across the model, the API and the deployment."*
- Right, `text-align: right`, `max-width: 26ch`, `justify-self: end`: *"3 production systems shipped"*

Both `rgba(255,255,255,.80)`, `clamp(.875rem, 1.05vw, 1rem)`, `line-height 1.6`.

Below 1024px: single column, both left-aligned.

---

## Hero

**Eyebrow:** *"Open to 2027 graduate roles"*, mono, `clamp(11px, .95vw, 13px)`, uppercase, `.02em` tracking, `rgba(255,255,255,.80)`, margin-bottom `clamp(16px, 2vw, 26px)`.

**Headline**, two lines:

```
font-size:     clamp(3rem, 11.5vw, 9.5rem)
line-height:   0.85
letter-spacing:-0.045em
margin-bottom: clamp(28px, 3.6vw, 52px)
```

- Line 1 — `Noah Zhong` — solid `#FFFFFF`, weight 500
- Line 2 — `AI Engineer.` — weight 800, shiny gradient sweep, `display: block`

**Shiny gradient sweep**

```css
background-image: linear-gradient(100deg,
  #64CEFB 0%, #64CEFB 38%,
  #FFFFFF 50%,
  #64CEFB 62%, #64CEFB 100%);
background-size: 280% 100%;
background-position: 180% 0;
-webkit-background-clip: text; background-clip: text;
-webkit-text-fill-color: transparent;
animation: sweep 3s linear infinite;
```

`@keyframes sweep { to { background-position: -100% 0 } }`

In React, drive this with Framer Motion's `animate` on `backgroundPosition` with `repeat: Infinity, ease: "linear", duration: 3` if you want it in JS. CSS is cheaper and behaves identically, so prefer CSS and keep Framer Motion for the scroll reveals below the fold.

Under reduced motion, kill the animation and park `background-position` at `50% 0` so the text renders in a legible mid-gradient state.

**CTA button**

```
background: #000; hover #141414
border: 1px solid rgba(255,255,255,.14); hover .30
border-radius: 999px
padding: 16px 30px
font-size: .9375rem, weight 500
```

Label *"Download résumé"* plus a 16px arrow that translates 4px right on hover.

---

## What carries over from the rest of the brief

Your five motion techniques still apply below the fold. Two of them change:

- **Blur into focus** is now redundant. The shiny sweep is the hero's motion. Drop the blur-in rather than stacking two effects on one screen.
- **Constellation field** is replaced by the shader. Do not run both, they are the same idea rendered twice at double the cost.

Still in use, unchanged: **text scramble** (moved to the eyebrow line, plain white), **border draw** (section rules and buttons), **card expands in place** (projects).

---

## Acceptance

- [ ] No video file anywhere in the project.
- [ ] Canvas renders at 55% resolution; the loop pauses on a hidden tab.
- [ ] With WebGL disabled in devtools, the hero still looks intentional.
- [ ] Reduced motion shows a static frame and a static gradient, not a blank canvas or invisible text.
- [ ] LCP under 2.0s and Lighthouse 95+ on mobile, measured with the shader running.
- [ ] Every nav link and the CTA have visible focus rings.
