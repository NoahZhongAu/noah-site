import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

// PRD §6: the PDF is hand-maintained, so CI proves it is present and sane.
const path = "public/resume/noah-zhong-resume.pdf";

describe("résumé PDF", () => {
  it("exists, is a PDF, and is under 1MB", () => {
    const size = statSync(path).size;
    expect(size).toBeGreaterThan(0);
    expect(size).toBeLessThan(1024 * 1024);
    expect(readFileSync(path).subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });
});
