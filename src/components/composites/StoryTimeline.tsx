"use client";

import { useEffect } from "react";
import { useActiveStep } from "@/components/hooks/useActiveStep";
import { SectionRule } from "@/components/primitives/SectionRule";
import { EraBackdrop, type Layer } from "./EraBackdrop";
import { Fireflies } from "./Fireflies";
import { TimelineCounter } from "./TimelineCounter";
import { TimelineRail } from "./TimelineRail";
import { TimelineStep, type TimelineStepData } from "./TimelineStep";

type Props = {
  steps: readonly TimelineStepData[];
  layers: readonly Layer[];
  label: string;
};

/**
 * The scroll-driven timeline (PRD §4.2, ADR 0005, 0006, 0007): the story
 * entries and the three closing steps in one list over one backdrop. Owns
 * the one observer through useActiveStep and writes data-era and data-step
 * on the section for CSS and the tests, data-closing while a closing step is
 * active so the sticky label hides, and data-snap on <html> while a step is
 * on screen so the cover and the footer never snap.
 *
 * Layout from 768px: a zero-height sticky header (h2 and rule, on top), a
 * sticky full-height backdrop (illustrations, fireflies, rail, counter), and
 * the steps pulled up by one viewport so they scroll over it. Under 768px the
 * header is in flow, the backdrop is display:none and the steps are cards.
 */
export function StoryTimeline({ steps, layers, label }: Props) {
  const { active, isShown, isNear, inStory, setRef } = useActiveStep(
    steps.length,
  );
  const current = steps[active];
  const activeLayerId = current?.layerId ?? layers[0]?.id ?? 1;
  const layerById = new Map(layers.map((layer) => [layer.id, layer]));

  useEffect(() => {
    document.documentElement.toggleAttribute("data-snap", inStory);
    return () => document.documentElement.removeAttribute("data-snap");
  }, [inStory]);

  return (
    <section
      id="story"
      className="relative"
      data-era={activeLayerId}
      data-step={active + 1}
      data-closing={current?.closing ? "" : undefined}
    >
      <header className="story-header px-gutter pt-section md:sticky md:top-0 md:z-30 md:h-0 md:overflow-visible md:pt-8">
        <h2 className="text-mono-label mb-4 text-fg-62">{label}</h2>
        <SectionRule />
      </header>

      <div className="hidden md:sticky md:top-0 md:block md:h-svh md:overflow-hidden">
        <EraBackdrop layers={layers} activeId={activeLayerId} />
        <Fireflies />
        <TimelineRail total={steps.length} active={active} />
        <TimelineCounter total={steps.length} active={active} />
      </div>

      <ol className="relative z-20 grid gap-12 px-gutter pt-8 pb-section md:mt-[-100svh] md:block md:gap-0 md:px-0 md:pt-0 md:pb-0">
        {steps.map((step, index) => {
          const layer = layerById.get(step.layerId);
          if (!layer) throw new Error(`Step ${step.id} names no layer`);
          return (
            <TimelineStep
              key={step.id}
              step={step}
              layer={layer}
              shown={isShown(index)}
              near={isNear(index)}
              setRef={setRef(index)}
            />
          );
        })}
      </ol>
    </section>
  );
}
