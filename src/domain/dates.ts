import type { Entry } from "@content/schema";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type YearMonth = `${number}-${string}`;

function parse(yearMonth: string): { year: number; month: number } {
  const [y, m] = yearMonth.split("-");
  return { year: Number(y), month: Number(m) };
}

function label(yearMonth: string): string {
  const { year, month } = parse(yearMonth);
  return `${MONTHS[month - 1] ?? "???"} ${year}`;
}

/** Oldest first. Ties break by end (open-ended last), then title, so order is stable across runs. */
export function sortEntriesAscending<
  T extends Pick<Entry, "start" | "end" | "title">,
>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    if (a.start !== b.start) return a.start < b.start ? -1 : 1;
    if (a.end !== b.end) {
      if (a.end === "present") return 1;
      if (b.end === "present") return -1;
      return a.end < b.end ? -1 : 1;
    }
    return a.title.localeCompare(b.title, "en-AU");
  });
}

export function formatDateRange(start: string, end: string): string {
  return `${label(start)} to ${end === "present" ? "present" : label(end)}`;
}

/**
 * Inclusive of both months, so Jul 2024 to Aug 2024 is "2 mos". "present"
 * counts up to `now`, which the caller supplies so the function stays pure.
 */
export function formatDuration(
  start: string,
  end: string,
  now: string,
): string {
  const from = parse(start);
  const to = parse(end === "present" ? now : end);
  const months = Math.max(
    1,
    (to.year - from.year) * 12 + (to.month - from.month) + 1,
  );
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}
