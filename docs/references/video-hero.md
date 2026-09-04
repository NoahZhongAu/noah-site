# Video Hero: make your own asset, wire it correctly

## 1. Generate the video (10 minutes, any AI video tool)

Paste this into Kling, Runway Gen-4, Hailuo, or Veo. Ask for 8 to 10 seconds, 16:9, and a **seamless loop** if the tool offers it.

```
Painterly anime-style illustration, wide cinematic shot. A young man seen
from behind sits at a desk outdoors at night, working on a laptop whose
screen glows warm yellow and lights his white shirt. Stacks of books beside
him. Foreground: a meadow of small orange and yellow wildflowers catching the
laptop light. Background: a vast deep-blue night sky, dense with soft stars,
a faint band of milky way. Subtle motion only: stars twinkle slowly, flowers
sway gently in a light breeze, the laptop glow flickers almost imperceptibly.
Camera locked, no pan, no zoom. Studio Ghibli meets Makoto Shinkai, muted
palette, film grain, no text, no logos, no faces visible.
```

Then:

- Export at 1920×1080, then transcode to **1280×720, H.264, no audio track, target 1.5 to 2.5MB**. `ffmpeg -i in.mp4 -vf scale=1280:-2 -an -c:v libx264 -crf 28 -movflags +faststart hero.mp4`
- Also export a **WebM** (`-c:v libvpx-vp9 -crf 34 -b:v 0`) for browsers that prefer it.
- Grab a single frame as **`hero-poster.jpg`**, 1280×720, around 80KB. This is what loads first and what mobile sees.

Put all three in `public/hero/`.

---

## 2. Wire it so it does not wreck your Lighthouse score

A video background costs you nothing on desktop if you do these five things. Skip any one and it becomes your LCP element and you lose the 95.

```tsx
// components/sections/HeroVideo.tsx
"use client";
import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // 1. Respect the user. Reduced motion or Save-Data → poster only.
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as any).connection?.saveData === true;
    // 2. Phones get the poster. A 2MB loop over 4G for a résumé is rude.
    const small = matchMedia("(max-width: 767px)").matches;
    if (reduce || saveData || small) return;

    // 3. Only attach sources now, so nothing downloads on first paint.
    const mp4 = document.createElement("source");
    mp4.src = "/hero/hero.mp4"; mp4.type = "video/mp4";
    const webm = document.createElement("source");
    webm.src = "/hero/hero.webm"; webm.type = "video/webm";
    v.append(webm, mp4);
    v.load();
    v.play().catch(() => {}); // autoplay can be refused; the poster stays

    // 4. Pause when the hero scrolls away or the tab hides.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.1 }
    );
    io.observe(v);
    const vis = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster="/hero/hero-poster.jpg"   // 5. Poster is the LCP element, not the video
      muted playsInline loop
      preload="none"
      aria-hidden="true"
    />
  );
}
```

Add to the page `<head>`: `<link rel="preload" as="image" href="/hero/hero-poster.jpg" fetchpriority="high">` so the poster paints immediately.

**Why this works:** the poster is an 80KB JPEG that loads instantly and *is* your largest-contentful-paint. The video starts downloading only after the page is interactive, and only on devices where it is welcome. Lighthouse measures the poster, not the loop.

---

## 3. What this replaces in the brief

If you go with a video hero, delete the shader and the constellation from Section 6. The prompt you copied had this right: "the video provides all visual depth." Keep the scrim (a 35% top-and-bottom darkening so the text reads), the liquid-glass buttons, and the fade-rise stagger. Everything below the fold stays as specified.

---

## 4. If you would rather not generate a video at all

The still frame alone, with a canvas starfield twinkling over it, gets about 85% of this effect for 80KB total. Same illustration prompt, but ask the image tool for a still. I can build that version if you want it.
