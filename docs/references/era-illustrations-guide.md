# Era Illustrations for the Story Timeline

## The idea: same night, same meadow, the machines change

The cover shows a figure at a desk in a wildflower meadow under a starry sky. The five era images keep **exactly that world** and change only the era: the same sky, the same flowers, the same horizon, but the desk holds a 1940s adding machine, then a relay machine stands in the field, then a mainframe, then a beige CRT, then the laptop from the cover.

Two reasons this works. It matches the cover by construction, because it *is* the cover's setting. And the crossfade becomes beautiful, because the sky and meadow stay still while only the machine dissolves from one era to the next.

## What is needed

Five still images, not video.

| File | Era | Size | Weight |
|---|---|---|---|
| `era-1.jpg` | Human computers, 1940s | 1920×1080 | ≤ 220KB |
| `era-2.jpg` | Electromechanical relay machine, 1940s | 1920×1080 | ≤ 220KB |
| `era-3.jpg` | Mainframe, 1960s | 1920×1080 | ≤ 220KB |
| `era-4.jpg` | Personal computer, 1990s | 1920×1080 | ≤ 220KB |
| `era-5.jpg` | Now: the cover scene, figure on the right | 1920×1080 | ≤ 220KB |

## Do the cover first, then use it as the reference for all five

This is the whole method. Finish the cover image, get it exactly right, then:

1. Upload the cover still as the **style and image reference** in the same tool. Leonardo: Image Guidance with Style Reference, strength high. Ideogram: Style Reference. Midjourney: `--sref` plus `--cref` is not needed since there are no faces.
2. Generate all five in one sitting, same model, same settings, same seed if the tool exposes one.
3. Make three or four candidates per era and choose for consistency with the cover, not for the prettiest single frame.

## The shared block

Paste this at the start of every era prompt. It describes the cover's world so the tool holds it constant.

```
Painterly anime illustration, wide cinematic 16:9 frame, night, outdoors.
Same setting as the reference image: a wildflower meadow of small orange and
yellow flowers in the foreground, a low horizon, and above it a vast
deep-blue night sky dense with soft stars and a faint diagonal milky way
band in the upper right. Hand-painted gouache texture, cel-shaded figures
with minimal line work, nostalgic 2000s anime film look, subtle film grain,
muted saturation. Deep navy shadows. Exactly one warm amber light source,
coming from the machine in the scene, lighting the flowers nearest to it and
the back of any figure. Every person is seen from behind, no faces.
Composition: the desk or machine and any figures sit in the RIGHT two thirds
of the frame; the LEFT third is open sky and shadowed meadow with nothing
bright in it, leaving room for text. Nothing photographic, no 3D render.
```

## The five scenes

### Era 1 — Human computers

```
[shared block]

SCENE: Three or four wooden desks set in a row across the meadow on the
right, each with a mechanical adding machine, open ledgers, and pencils.
Clerks in 1940s clothing sit with their backs to the viewer, heads bent,
working. One green-shaded desk lamp on the nearest desk is the warm source,
pooling light on paper and the backs of the chairs and the flowers at their
feet. The desks fade into shadow toward the left.
```

### Era 2 — The relay machine

```
[shared block]

SCENE: A wall-sized electromechanical machine stands in the meadow on the
right like a monolith: rotating drums, banks of relays, paper tape
threading through readers and fluttering slightly in the night air, thick
cables trailing into the flowers. A single figure in a wool jacket stands
with their back to the viewer, facing it. One amber work lamp mounted on the
machine is the warm source, catching the drum edges and the figure's
shoulders.
```

### Era 3 — The mainframe

```
[shared block]

SCENE: A row of tall 1960s mainframe cabinets stands across the meadow on
the right, reel-to-reel tape drives, small amber indicator lights blinking,
cables running down into the flowers. Two technicians in white coats seen
from behind stand at a console in front of the nearest cabinet, one pointing
at a panel. The console's lamp is the warm source; the indicator lights are
faint amber pinpricks receding into the dark on the right.
```

### Era 4 — The personal computer

```
[shared block]

SCENE: The small wooden desk from the reference image, placed in the meadow
on the right. On it, a bulky beige 1990s CRT monitor glows amber, lighting
the back of a figure's head, a keyboard, a scatter of floppy disks and a
manual. A coiled phone cord trails from a modem with one blinking light down
into the flowers. Stacks of books beside the desk.
```

### Era 5 — Now

```
[shared block]

SCENE: The reference image's scene almost exactly: the young man in a white
shirt seen from behind at the small wooden desk, the laptop glowing warm
yellow, stacks of books, the flowers catching the laptop light. The only
difference: the desk and figure are shifted to the right two thirds of the
frame so the left third is open starry sky and shadowed meadow.
```

If the tool will not move the figure, reuse the cover still itself for era 5 and let the final entry's text sit over the sky in the upper left, which is calm anyway. Ending the timeline on the exact frame the site opened with is not a compromise; it closes the loop.

## Negative prompt, for tools that take one

```
faces, eyes, looking at camera, text, letters, logos, watermarks,
photorealism, 3D render, lens flare, daylight, moon, city, indoor, walls,
ceiling, saturated colours, multiple light sources, bright objects on the
left side, extra limbs, distorted hands
```

## Keep these constant across all five, or the crossfade flashes

- Horizon at the same height, roughly the lower third line.
- Milky way band in the same place, upper right.
- Same overall brightness. If one image comes out brighter, darken it in Squoosh or the tool's editor before you accept it.
- Flowers the same colour and density in the foreground.
- One light source only. A second lamp anywhere breaks the set.

## After generating

1. Open each image full-screen and imagine three lines of white text on the left third. Anything bright under that text means regenerate or darken.
2. Put all five and the cover side by side. If one looks like a different artist or a different night, regenerate it with the others as reference.
3. Resize to 1920×1080 and compress with [Squoosh](https://squoosh.app), MozJPEG quality 72 to 78, target under 220KB each.
4. Name them `era-1.jpg` through `era-5.jpg` and place them in `public/eras/`.

Until they exist, the timeline shows flat gradient placeholders, so nothing blocks the build.
