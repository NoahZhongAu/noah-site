import { ResumeSchema, type Resume } from "./schema";
import { resume as raw } from "./resume";

// The only module the app reads content from. Not a barrel: it validates.
const parsed = ResumeSchema.safeParse(raw);

if (!parsed.success) {
  const lines = parsed.error.issues.map(
    (issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new Error(`content/resume.ts is invalid:\n${lines.join("\n")}`);
}

export const resume: Resume = parsed.data;
