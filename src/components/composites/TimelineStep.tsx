import Image from "next/image";
import { Bullets } from "@/components/primitives/Bullets";

export type StepData = {
  id: string;
  title: string;
  org: string;
  location: string;
  dateRange: string;
  duration: string;
  bullets: readonly string[];
  era: { image: string; alt: string };
};

type Props = {
  step: StepData;
  shown: boolean;
  near: boolean;
  setRef: (element: HTMLLIElement | null) => void;
};

/**
 * One entry (PRD §4.2). From 768px it is a full-height snap point whose text
 * focuses in once (data-shown, CSS in globals.css); under 768px it is a card
 * with a 16:9 header from its era illustration. One DOM, CSS decides
 * (PLAN §6 item 21). The header is outside .story-card so the stagger
 * counts date, title, organisation, bullets and nothing else.
 *
 * The header image is not in the server HTML: it mounts once the card is
 * within a viewport (`near`), so a phone loading the cover never fetches
 * story images in the LCP window. The noscript copy is for no-JS visitors.
 */
export function TimelineStep({ step, shown, near, setRef }: Props) {
  const header = (
    <Image
      src={step.era.image}
      alt={step.era.alt}
      fill
      sizes="100vw"
      className="object-cover"
    />
  );

  return (
    <li
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
        <p className="text-mono-label mb-3.5 text-fg-62">
          {step.dateRange} · {step.duration}
        </p>
        <h3 className="text-step-title mb-2">{step.title}</h3>
        <p className="mb-5 text-fg-80">
          {step.org}, {step.location}
        </p>
        <Bullets items={step.bullets} />
      </div>
    </li>
  );
}
