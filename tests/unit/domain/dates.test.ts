import { describe, expect, it } from "vitest";
import {
  formatDateRange,
  formatDuration,
  sortEntriesAscending,
} from "@/domain/dates";

describe("sortEntriesAscending", () => {
  it("orders by start ascending and does not mutate the input", () => {
    const input = [
      { start: "2025-02", end: "present", title: "B" },
      { start: "2022-09", end: "2024-12", title: "A" },
    ];
    const sorted = sortEntriesAscending(input);
    expect(sorted.map((e) => e.title)).toEqual(["A", "B"]);
    expect(input[0]?.title).toBe("B");
  });

  it("on equal start, sorts present last and earlier end first, then by title", () => {
    const sorted = sortEntriesAscending([
      { start: "2024-01", end: "present", title: "Open" },
      { start: "2024-01", end: "2024-06", title: "Zed" },
      { start: "2024-01", end: "2024-06", title: "Alpha" },
      { start: "2024-01", end: "2024-03", title: "Short" },
    ]);
    expect(sorted.map((e) => e.title)).toEqual([
      "Short",
      "Alpha",
      "Zed",
      "Open",
    ]);
  });
});

describe("formatDateRange", () => {
  it("formats closed and open ranges", () => {
    expect(formatDateRange("2022-09", "2024-06")).toBe("Sep 2022 to Jun 2024");
    expect(formatDateRange("2026-07", "present")).toBe("Jul 2026 to present");
  });
});

describe("formatDuration", () => {
  it("counts both end months inclusively", () => {
    expect(formatDuration("2024-07", "2024-08", "2026-09")).toBe("2 mos");
    expect(formatDuration("2024-07", "2024-07", "2026-09")).toBe("1 mo");
  });

  it("rolls months into years at the boundary", () => {
    expect(formatDuration("2022-09", "2023-08", "2026-09")).toBe("1 yr");
    expect(formatDuration("2022-09", "2023-09", "2026-09")).toBe("1 yr 1 mo");
    expect(formatDuration("2022-09", "2024-12", "2026-09")).toBe("2 yrs 4 mos");
  });

  it("measures present against the supplied now", () => {
    expect(formatDuration("2026-07", "present", "2026-09")).toBe("3 mos");
  });
});
