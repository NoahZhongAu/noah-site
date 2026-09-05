import type { Closing, Person } from "@content/schema";
import { GlassLink } from "@/components/primitives/GlassLink";

type Props = {
  person: Pick<Person, "email" | "availability" | "links">;
  scene: Closing["contact"];
};

/** The Contact step (ADR 0007): heading, availability, three glass links. The form of PRD §4.5 is milestone 6. */
export function Contact({ person, scene }: Props) {
  return (
    <>
      <h2 className="text-step-title mb-4">{scene.title}</h2>
      <p className="mb-8 text-fg-80">{person.availability}</p>
      <ul className="flex flex-wrap gap-3">
        <li>
          <GlassLink href={`mailto:${person.email}`}>{person.email}</GlassLink>
        </li>
        <li>
          <GlassLink href={person.links.github} rel="me">
            {scene.githubLabel}
          </GlassLink>
        </li>
        <li>
          <GlassLink href={person.links.linkedin} rel="me">
            {scene.linkedinLabel}
          </GlassLink>
        </li>
      </ul>
    </>
  );
}
