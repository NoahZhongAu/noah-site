"use client";

import { useEffect } from "react";
import type { Era } from "@content/schema";
import { eraForStep } from "@/domain/eras";
import { useActiveStep } from "@/components/hooks/useActiveStep";
import { SectionRule } from "@/components/primitives/SectionRule";
import { EraBackdrop } from "./EraBackdrop";
import { Fireflies } from "./Fireflies";
import { TimelineCounter } from "./TimelineCounter";
import { TimelineRail } from "./TimelineRail";
import { TimelineStep, type StepData } from "./TimelineStep";

type Props = { steps: readonly StepData[]; eras: readonly Era[] };

/**
 * The scroll-driven story (PRD §4.2, ADR 0005, 0006). Owns the one observer
 * through useActiveStep and writes data-era and data-step on the section for
 * CSS and the tests, and data-snap on <html> while a step is on screen so the
 * cover and the sections after the story never snap.
 *
 * Layout from 768px: a zero-height sticky header (h2 and rule, on top), a
 * sticky full-height backdrop (illustrations, fireflies, rail, counter), and
 * the steps pulled up by one viewport so they scroll over it. Under 768px the
 * header is in flow, the backdrop is display:none and the steps are cards.
 */
export function StoryTimeline({ steps, eras }: Props) {
  const { active, isShown, isNear, inStory, setRef } = useActiveStep(
    steps.length,
  );
  const era = eraForStep(eras, active + 1);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-snap", inStory);
    return () => document.documentElement.removeAttribute("data-snap");
  }, [inStory]);

  return (
    <section
      id="story"
      className="relative"
      data-era={era.id}
      data-step={active + 1}
    >
      <header className="px-gutter pt-section md:sticky md:top-0 md:z-30 md:h-0 md:overflow-visible md:pt-8">
        <h2 className="text-mono-label mb-4 text-fg-62">Story</h2>
        <SectionRule />
      </header>

      <div className="hidden md:sticky md:top-0 md:block md:h-svh md:overflow-hidden">
        <EraBackdrop eras={eras} />
        <Fireflies />
        <TimelineRail total={steps.length} active={active} />
        <TimelineCounter total={steps.length} active={active} />
      </div>

      <ol className="relative z-20 grid gap-12 px-gutter pt-8 pb-section md:mt-[-100svh] md:block md:gap-0 md:px-0 md:pt-0 md:pb-0">
        {steps.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            shown={isShown(index)}
            near={isNear(index)}
            setRef={setRef(index)}
          />
        ))}
      </ol>
    </section>
  );
}
