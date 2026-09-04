type Props = { items: readonly string[]; className?: string };

/** A list with the short dash marker in --fg-62 (CLAUDE.md), never a disc. */
export function Bullets({ items, className }: Props) {
  return (
    <ul
      className={["bullets grid gap-2.5 text-fg-80", className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
