import { Bullets } from "@/components/primitives/Bullets";

type Props = {
  title: string;
  org: string;
  location: string;
  dateRange: string;
  duration: string;
  bullets: readonly string[];
};

/** A story entry's card (PRD §4.2): date and duration in mono, title in serif, organisation, bullets. Four children, four stagger slots. */
export function TimelineEntry({
  title,
  org,
  location,
  dateRange,
  duration,
  bullets,
}: Props) {
  return (
    <>
      <p className="text-mono-label mb-3.5 text-fg-62">
        {dateRange} · {duration}
      </p>
      <h3 className="text-step-title mb-2">{title}</h3>
      <p className="mb-5 text-fg-80">
        {org}, {location}
      </p>
      <Bullets items={bullets} />
    </>
  );
}
