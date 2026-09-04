import type { Resume } from "@content/schema";

type JsonLd = Record<string, unknown>;

/** Schema.org Person for the root layout (PRD §10 SEO). */
export function personJsonLd(resume: Resume, siteUrl: string): JsonLd {
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
