import Image from "next/image";
import type { ReactNode } from "react";
import type { Layer } from "./EraBackdrop";

export type TimelineStepData = {
  id: string;
  /** PRD §3 anchor for the closing steps; story entries have none. */
  anchor?: string;
  layerId: number;
  /** A closing step (ADR 0007) carries its own eyebrow, so the sticky "Story" label hides. */
  closing?: boolean;
  children: ReactNode;
};

type Props = {
  step: TimelineStepData;
  layer: Layer;
  shown: boolean;
  near: boolean;
  setRef: (element: HTMLLIElement | null) => void;
};

/**
 * One step of the timeline. From 768px it is a full-height snap point whose
 * card focuses in once (data-shown, CSS in globals.css); under 768px it is a
 * card with a 16:9 header from its layer illustration. One DOM, CSS decides
 * (PLAN §6 item 21). The header is outside .story-card so the stagger counts
 * only the card's own children.
 *
 * The header image is not in the server HTML: it mounts once the card is
 * within a viewport (`near`), so a phone loading the cover never fetches
 * timeline images in the LCP window. The noscript copy is for no-JS visitors.
 */
export function TimelineStep({ step, layer, shown, near, setRef }: Props) {
  const header = (
    <Image
      src={layer.image}
      alt={layer.alt}
      fill
      sizes="100vw"
      className="object-cover"
    />
  );

  return (
    <li
      id={step.anchor}
      ref={setRef}
      className="story-step md:flex md:min-h-svh md:items-center md:pr-gutter md:pl-gutter-story"
      data-shown={shown ? "" : undefined}
    >
      <div className="md:hidden">
        <div className="relative aspect-video overflow-hidden rounded-card">
          {near ? header : <noscript>{header}</noscript>}
        </div>
      </div>
      <div className="story-card max-w-measure-step pt-6 md:pt-0">
        {step.children}
      </div>
    </li>
  );
}
