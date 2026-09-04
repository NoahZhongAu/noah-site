import type { CSSProperties, ReactNode } from "react";

type Props = { children: ReactNode; order?: number; className?: string };

/**
 * One step of the cover's fade-rise (PRD V4, ADR 0004). The animation lives
 * in globals.css; this only sets the item's place in the stagger. Server
 * rendered, so the entrance starts at first paint and fires once.
 */
export function FadeRiseItem({ children, order = 0, className }: Props) {
  const style = { "--rise-order": order } as CSSProperties;
  return (
    <div
      className={["fade-rise", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
