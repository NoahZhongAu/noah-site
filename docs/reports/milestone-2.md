# Milestone 2 report: Content and domain

Date: 2026-09-04. Branch `milestone/2-content`, five commits on top of `main`.

## Works

- `content/schema.ts` validates the whole résumé with Zod 4. Unique ids and slugs, balanced `*emphasis*` markers, `end` not before `start`, and contiguous era coverage of every step are all checked. The coverage check is inlined so `content/` imports nothing from `src/`.
- `content/index.ts` throws one error listing every failing path. Proven at build time: emptying the CUHK-Shenzhen bullets fails `pnpm build` with `entries.2.bullets: Too small: expected array to have >=1 items`.
- Domain functions and their tests: `sortEntriesAscending` (start ascending, then earlier end, `present` last, then title), `formatDateRange`, `formatDuration` (inclusive months, `now` passed in so the function is pure), `eraForStep`, `parseEmphasis` (round-trips, rejects unbalanced markers), `personJsonLd`, `ContactSchema`. 34 unit tests pass.
- `/resume` returns 308 to the PDF path and following it returns `application/pdf`, covered by an e2e test. A unit test checks the PDF exists, starts with `%PDF-` and is under 1MB.
- `page.tsx` renders every section from `content/` as plain semantic HTML with the PRD §3 anchor ids, so milestones 3 to 6 style real text. Axe still reports zero violations on it.
- The milestone 1 boundary test still cleans up correctly now that `src/domain/` holds real files.
- The reviewer's one substantive finding, that PRD §5 no longer matched the `Person` schema, is resolved by ADR 0003 and a PRD §5 update.
- Every commit on this branch went through the Husky pre-commit hook.

## Does not work

- **`docs/references/resume-draft.md` was never found.** The owner named it as the primary source for bullets, summary, skills and the two extra projects, but it is not in the working tree, on `origin/main`, or in Downloads. All entry text, the bio and the skills come from the PDF instead. When the draft appears, `content/resume.ts` is the only file to edit.
- **Bracket placeholders remain in `content/resume.ts`**, all in the two projects the PDF does not cover:
  - `quant-rag`: `stack` is `["[stack]"]`, `pitch` and the single `details` item are bracketed prompts.
  - `cardio-risk`: same three fields.
- **ADR 0003 was written after the schema, not before.** CLAUDE.md requires the ADR first. The shape had been approved in the milestone plan, but the PRD was not updated at that point and the reviewer caught it.

## Assumed

- `Person` has `eyebrow` and `role` and no `phone`, per the approved plan and the owner's "omit phone". Recorded in ADR 0003.
- Bullets were rewritten from the PDF in Australian English and capped at five. The XJTLU entry folds the museum internship into a bullet rather than adding a seventh entry, because PRD §4.2 fixes six steps. The construction and campus-delivery roles from the PDF are not on the timeline for the same reason.
- Era alt text is written from `docs/references/era-illustrations-guide.md`. The image files do not exist until milestone 4; the schema only checks the path prefix.
- `formatDuration` counts both end months inclusively, so July to August is "2 mos". Open-ended entries use the build month, so durations go stale between deploys (PLAN §6 item 23).
- Zod 4 is installed. Its `z.email()` and `z.url()` replace the string-method forms the plan sketched.
- The layout's title and description now come from content; the description is the availability line until milestone 7 writes proper metadata.
- The temporary page uses one arbitrary width, `max-w-[60ch]`, matching PRD §4.2's 60ch step width. Milestone 4 should make it a token if the value survives.

## Unsure about

- **JSON-LD `worksFor` and `alumniOf` derivation.** `personJsonLd` treats every open-ended `role` entry as current employment and every `education` entry as alma mater, including the in-progress Monash degree. That reads correctly today but is a convention, not a rule the schema enforces.
- **`sameAs` includes the LinkedIn URL exactly as supplied**, on the `au.linkedin.com` host. Some validators expect `www.linkedin.com`. Not verified against a structured-data tester.
- **`z.email()` strictness.** Zod 4's default email pattern is stricter than a plain regex. It accepts the owner's address, but the contact form in milestone 6 should be tested with addresses containing plus signs and subdomains.
- **Whether `formatDuration` should be shown for education entries at all.** The PRD shows "date range and duration in mono" for every step; a two-month internship reads fine, a four-year degree in progress less so. Milestone 4 decides.

## Dependencies added

- `zod` 4.5.4 — content validation at build and the shared contact schema (PRD A3, §5, §7.1).
