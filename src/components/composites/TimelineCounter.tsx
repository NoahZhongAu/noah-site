type Props = { total: number; active: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** "03 / 07" bottom right, tabular figures (PRD §4.2). Decorative: the rail and counter restate what the step already says. */
export function TimelineCounter({ total, active }: Props) {
  return (
    <p
      className="story-counter text-mono-label absolute right-6 bottom-6 z-20 text-fg-62 tabular-nums md:right-8 md:bottom-10"
      aria-hidden="true"
    >
      <b className="font-normal text-fg">{pad(active + 1)}</b> / {pad(total)}
    </p>
  );
}
