import { describe, expect, it } from "vitest";
import { parseEmphasis } from "@/domain/emphasis";

describe("parseEmphasis", () => {
  it("splits marked phrases into segments and round-trips the text", () => {
    const input = "AI systems, *deployed* where the work *actually happens.*";
    const segments = parseEmphasis(input);
    expect(segments).toEqual([
      { text: "AI systems, ", emphasis: false },
      { text: "deployed", emphasis: true },
      { text: " where the work ", emphasis: false },
      { text: "actually happens.", emphasis: true },
    ]);
    expect(
      segments.map((s) => (s.emphasis ? `*${s.text}*` : s.text)).join(""),
    ).toBe(input);
  });

  it("returns one plain segment when there are no markers", () => {
    expect(parseEmphasis("plain")).toEqual([
      { text: "plain", emphasis: false },
    ]);
  });

  it("rejects unbalanced markers", () => {
    expect(() => parseEmphasis("one *two")).toThrow(SyntaxError);
  });
});
