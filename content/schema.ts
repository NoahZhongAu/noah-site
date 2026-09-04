import { z } from "zod";

// Content imports nothing from src/. Validation that belongs to the data,
// such as era coverage, lives here rather than in domain (PLAN §6 item 13).

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-with-dashes");
const url = z.url();
const nonEmpty = z.string().trim().min(1, "Must not be empty");

/** Rejects unbalanced *emphasis* markers so the headline can never render a stray asterisk. */
const emphasised = nonEmpty.refine(
  (s) => (s.match(/\*/g) ?? []).length % 2 === 0,
  {
    message: "Unbalanced * emphasis markers",
  },
);

export const PersonSchema = z.object({
  name: nonEmpty,
  role: nonEmpty,
  eyebrow: nonEmpty,
  headline: emphasised,
  location: nonEmpty,
  email: z.email(),
  links: z.object({ github: url, linkedin: url }),
  bio: nonEmpty,
  availability: nonEmpty,
});

export const EntryKindSchema = z.enum(["role", "education", "milestone"]);

export const EntrySchema = z
  .object({
    id: slug,
    kind: EntryKindSchema,
    title: nonEmpty,
    org: nonEmpty,
    location: nonEmpty,
    start: yearMonth,
    end: z.union([yearMonth, z.literal("present")]),
    bullets: z.array(nonEmpty).min(1).max(5),
    stack: z.array(nonEmpty).min(1).optional(),
  })
  .refine((e) => e.end === "present" || e.end >= e.start, {
    message: "end is before start",
    path: ["end"],
  });

export const ProjectSchema = z.object({
  slug,
  category: nonEmpty,
  title: nonEmpty,
  stack: z.array(nonEmpty).min(1),
  pitch: nonEmpty,
  details: z.array(nonEmpty).min(1),
  links: z.object({ live: url.optional(), repo: url.optional() }),
});

export const SkillGroupSchema = z.object({
  label: nonEmpty,
  items: z.array(nonEmpty).min(1),
});

export const EraSchema = z
  .object({
    id: z.number().int().min(1).max(5),
    image: z.string().startsWith("/eras/"),
    alt: nonEmpty,
    fromStep: z.number().int().min(1),
    toStep: z.number().int().min(1),
  })
  .refine((e) => e.toStep >= e.fromStep, {
    message: "toStep is before fromStep",
    path: ["toStep"],
  });

export const ResumeSchema = z
  .object({
    person: PersonSchema,
    entries: z.array(EntrySchema).min(1),
    projects: z.array(ProjectSchema).min(1),
    skills: z.array(SkillGroupSchema).length(5),
    eras: z.array(EraSchema).length(5),
  })
  .superRefine((resume, ctx) => {
    reportDuplicates(
      resume.entries.map((e) => e.id),
      ["entries"],
      ctx,
    );
    reportDuplicates(
      resume.projects.map((p) => p.slug),
      ["projects"],
      ctx,
    );
    reportEraCoverage(resume.eras, resume.entries.length, ctx);
  });

function reportDuplicates(
  values: string[],
  path: string[],
  ctx: z.RefinementCtx,
) {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate "${value}"`,
        path: [...path, index],
      });
    }
    seen.add(value);
  });
}

/** Eras must cover steps 1..stepCount contiguously, in order, with no gaps or overlaps. */
function reportEraCoverage(
  eras: { fromStep: number; toStep: number }[],
  stepCount: number,
  ctx: z.RefinementCtx,
) {
  let expected = 1;
  eras.forEach((era, index) => {
    if (era.fromStep !== expected) {
      ctx.addIssue({
        code: "custom",
        message: `fromStep must be ${expected} to follow the previous era without a gap or overlap`,
        path: ["eras", index, "fromStep"],
      });
    }
    expected = era.toStep + 1;
  });
  if (expected - 1 !== stepCount) {
    ctx.addIssue({
      code: "custom",
      message: `Eras cover steps 1 to ${expected - 1} but there are ${stepCount} entries`,
      path: ["eras"],
    });
  }
}

export type Person = z.infer<typeof PersonSchema>;
export type Entry = z.infer<typeof EntrySchema>;
export type EntryKind = z.infer<typeof EntryKindSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Era = z.infer<typeof EraSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
