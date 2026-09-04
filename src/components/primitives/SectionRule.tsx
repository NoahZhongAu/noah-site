"use client";

import { useRef } from "react";
import { useOnceInView } from "@/components/hooks/useOnceInView";

type Props = { className?: string };

/** A 1px line on the shared #edge gradient that draws itself once when it enters view (PRD V6, reference.html). */
export function SectionRule({ className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const drawn = useOnceInView(ref);

  return (
    <svg
      ref={ref}
      className={["section-rule block h-px w-full overflow-visible", className]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 1400 1"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-drawn={drawn ? "" : undefined}
    >
      <line x1="0" y1="0.5" x2="1400" y2="0.5" />
    </svg>
  );
}
