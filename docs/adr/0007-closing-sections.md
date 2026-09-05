# ADR 0007: Projects, Skills and Contact on the timeline pattern

Date: 2026-09-05
Status: Accepted (owner instruction before first deploy)

## Context

PRD §4.3 to §4.5 specify a card grid with an in-place morph and URL state for Projects, a bento grid for Skills, and a two-column Contact with a Turnstile-protected form behind `EmailSender`. Milestones 5 and 6 own those. The owner wants to deploy after milestone 4 with every section present, and asked for the three remaining sections to reuse the story timeline exactly rather than ship placeholders or a second implementation.

## Decision

Projects, Skills and Contact are three more full-screen steps of the one timeline, after the seven story entries, each with its own backdrop illustration under `public/closing/`. They share the sticky backdrop, the focus-pull transition (ADR 0006), the fireflies layer (ADR 0005), desktop scroll snap, the stacked cards under 768px, the reduced-motion and Save-Data branches, the dot rail and the counter, which now run over ten steps. Their `<li>` elements carry the PRD §3 anchors `projects`, `skills` and `contact`, so the nav is unchanged.

- **Projects** is a compact list: category in mono, title, pitch, links. No expand, no URL state. PRD V7 and §4.3 stay as milestone 5 work; `motion` is still not a dependency.
- **Skills** is a two-column list of the five groups on the left third, not the bento of §4.4.
- **Contact** is the heading, the availability line and three liquid-glass links: mailto, GitHub, LinkedIn. No form, no `/api/contact`, no Turnstile, no `EmailSender` yet (§4.5 and §7 stay milestone 6 work). The footer of §4.6 is built now and sits after the contact step as a snap target outside the story.

To let one component render ten steps of different content, `StoryTimeline` takes a list of backdrop layers and a list of steps that each name a layer id and carry their card as children. The story entries render through a `TimelineEntry` card; the closing steps render `Projects`, `Skills` and `Contact` cards. The active layer is marked `data-active` by the timeline from the active step's layer id, replacing the seven hard-coded `[data-era="N"]` selectors; the section still exposes `data-era` and `data-step` for CSS and the tests.

Every string these sections show (eyebrows, titles, link labels, footer note, alt text) lives in `content/` under `closing` and `footer`, validated by the schema.

## Consequences

- PRD §4.3, §4.4 and §4.5 are superseded for launch by this ADR; §4.6 is implemented. Milestones 5 and 6 replace the Projects and Contact steps in place, keeping the anchors.
- The heading order is `h1` cover, `h2` "Story", `h3` per entry, then `h2` for each closing step and `h3` per project.
- The sticky "Story" label fades out while a closing step is active, because those steps carry their own eyebrow.
- Three more 1920×1080 illustrations, each under 100KB, join the desktop request burst noted in the milestone 4 report; on phones they are card headers that mount only when near, like the eras.
