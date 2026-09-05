import type {
  Closing,
  Entry,
  Era,
  Person,
  Project,
  SkillGroup,
} from "@content/schema";
import {
  formatDateRange,
  formatDuration,
  sortEntriesAscending,
} from "@/domain/dates";
import { eraForStep } from "@/domain/eras";
import type { Layer } from "@/components/composites/EraBackdrop";
import { StoryTimeline } from "@/components/composites/StoryTimeline";
import { TimelineEntry } from "@/components/composites/TimelineEntry";
import type { TimelineStepData } from "@/components/composites/TimelineStep";
import { Contact } from "./Contact";
import { Projects } from "./Projects";
import { Skills } from "./Skills";

type Props = {
  entries: readonly Entry[];
  eras: readonly Era[];
  projects: readonly Project[];
  skills: readonly SkillGroup[];
  person: Pick<Person, "email" | "availability" | "links">;
  closing: Closing;
  label: string;
  now: string;
};

/**
 * The whole timeline (PRD §4.2, ADR 0007): the story entries, then Projects,
 * Skills and Contact as three more steps over their own scenes. Sorting,
 * formatting and the era mapping happen here, on the server; the timeline
 * receives strings and rendered cards (PLAN §6 item 27).
 */
export function Story({
  entries,
  eras,
  projects,
  skills,
  person,
  closing,
  label,
  now,
}: Props) {
  const scenes = [
    { anchor: "projects", scene: closing.projects },
    { anchor: "skills", scene: closing.skills },
    { anchor: "contact", scene: closing.contact },
  ];
  const layers: Layer[] = [
    ...eras.map(({ id, image, alt }) => ({ id, image, alt })),
    ...scenes.map(({ scene }, index) => ({
      id: eras.length + index + 1,
      image: scene.image,
      alt: scene.alt,
    })),
  ];

  const storySteps: TimelineStepData[] = sortEntriesAscending(entries).map(
    (entry, index) => ({
      id: entry.id,
      layerId: eraForStep(eras, index + 1).id,
      children: (
        <TimelineEntry
          title={entry.title}
          org={entry.org}
          location={entry.location}
          dateRange={formatDateRange(entry.start, entry.end)}
          duration={formatDuration(entry.start, entry.end, now)}
          bullets={entry.bullets}
        />
      ),
    }),
  );

  const closingSteps: TimelineStepData[] = [
    <Projects key="projects" projects={projects} scene={closing.projects} />,
    <Skills key="skills" groups={skills} scene={closing.skills} />,
    <Contact key="contact" person={person} scene={closing.contact} />,
  ].map((card, index) => {
    const anchor = scenes[index]?.anchor ?? String(index);
    return {
      id: anchor,
      anchor,
      layerId: eras.length + index + 1,
      closing: true,
      children: card,
    };
  });

  return (
    <StoryTimeline
      steps={[...storySteps, ...closingSteps]}
      layers={layers}
      label={label}
    />
  );
}
