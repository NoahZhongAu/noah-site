# ADR 0003: `Person` content shape

Date: 2026-09-04
Status: Accepted

## Context

PRD §5 defined `Person { name, headline, location, email, phone, links, bio, availability }`. Building the content layer exposed three gaps, first raised in `docs/PLAN.md` §6 items 8, 12 and 33:

- The cover eyebrow (PRD §4.1) is fixed résumé copy, but CLAUDE.md forbids résumé text in components and the model had no field for it.
- JSON-LD `Person` (PRD §10) needs a `jobTitle`. The headline is a sentence with emphasis markers, not a title.
- `phone` was never rendered by any section, and a value in the content object would ship inside any client bundle that received `Person` whole.

## Decision

`Person` gains `eyebrow` and `role`, and loses `phone`. The owner approved this shape on 2026-09-04 when approving the milestone 2 plan, and separately directed "omit phone". The phone number stays in the hand-maintained PDF, which is the document a recruiter downloads.

PRD §5 is updated to match. This ADR was written after the schema landed, during the milestone 2 review, rather than before the code as CLAUDE.md requires. The milestone report records that lapse.

## Consequences

- `content/schema.ts` is the shape; `personJsonLd` reads `role` for `jobTitle`.
- Adding a phone number to the site in future is a content-model change and needs its own ADR.
