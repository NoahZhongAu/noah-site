import type { Resume } from "@content/schema";

type JsonLd = Record<string, unknown>;

/** Schema.org Person for the root layout (PRD §10 SEO). */
/** Only the fields the schema.org Person needs (PRD §9: a function receives what it uses). */
export type PersonSource = Pick<Resume, "person" | "entries" | "skills">;

export function personJsonLd(resume: PersonSource, siteUrl: string): JsonLd {
  const { person, entries, skills } = resume;
  const current = entries.filter(
    (e) => e.kind === "role" && e.end === "present",
  );
  const schools = entries.filter((e) => e.kind === "education");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    email: `mailto:${person.email}`,
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: person.location },
    sameAs: [person.links.github, person.links.linkedin],
    worksFor: current.map((e) => ({ "@type": "Organization", name: e.org })),
    alumniOf: schools.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.org,
    })),
    knowsAbout: skills.flatMap((group) => group.items),
  };
}
