import type { Entry, Era } from "@content/schema";
import {
  formatDateRange,
  formatDuration,
  sortEntriesAscending,
} from "@/domain/dates";
import { eraForStep } from "@/domain/eras";
import { StoryTimeline } from "@/components/composites/StoryTimeline";
import type { StepData } from "@/components/composites/TimelineStep";

type Props = { entries: readonly Entry[]; eras: readonly Era[]; now: string };

/** PRD §4.2. Sorting, formatting and the era mapping happen here, on the server; the timeline receives strings (PLAN §6 item 27). */
export function Story({ entries, eras, now }: Props) {
  const steps: StepData[] = sortEntriesAscending(entries).map(
    (entry, index) => {
      const era = eraForStep(eras, index + 1);
      return {
        id: entry.id,
        title: entry.title,
        org: entry.org,
        location: entry.location,
        dateRange: formatDateRange(entry.start, entry.end),
        duration: formatDuration(entry.start, entry.end, now),
        bullets: entry.bullets,
        era: { image: era.image, alt: era.alt },
      };
    },
  );

  return <StoryTimeline steps={steps} eras={eras} />;
}
