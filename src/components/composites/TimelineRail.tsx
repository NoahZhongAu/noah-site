type Props = { total: number; active: number };

/** The dot rail at the left edge (PRD §4.2); decorative, the steps themselves are the structure. */
export function TimelineRail({ total, active }: Props) {
  return (
    <ol
      className="story-rail absolute top-1/2 left-6 z-20 grid -translate-y-1/2 gap-3.5 md:left-8"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className="story-dot"
          data-active={index === active ? "" : undefined}
        />
      ))}
    </ol>
  );
}
