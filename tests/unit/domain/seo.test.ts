import { describe, expect, it } from "vitest";
import { personJsonLd, type PersonSource } from "@/domain/seo";

const resume: PersonSource = {
  person: {
    name: "Test Person",
    role: "Engineer",
    eyebrow: "EYEBROW",
    headline: "Head *line*",
    location: "Melbourne",
    email: "test@example.com",
    links: {
      github: "https://github.com/test",
      linkedin: "https://linkedin.com/in/test",
    },
    bio: "Bio.",
    availability: "Open.",
  },
  entries: [
    {
      id: "uni",
      kind: "education",
      title: "Degree",
      org: "University",
      location: "Melbourne",
      start: "2022-01",
      end: "2024-12",
      bullets: ["a"],
    },
    {
      id: "job",
      kind: "role",
      title: "Engineer",
      org: "Company",
      location: "Melbourne",
      start: "2025-01",
      end: "present",
      bullets: ["b"],
    },
  ],
  skills: [
    { label: "A", items: ["one", "two"] },
    { label: "B", items: ["three"] },
    { label: "C", items: ["four"] },
    { label: "D", items: ["five"] },
    { label: "E", items: ["six"] },
  ],
};

describe("personJsonLd", () => {
  it("builds a schema.org Person with the fields PRD §10 requires", () => {
    const ld = personJsonLd(resume, "https://example.com");
    expect(ld).toMatchObject({
      "@type": "Person",
      name: "Test Person",
      jobTitle: "Engineer",
      url: "https://example.com",
      sameAs: ["https://github.com/test", "https://linkedin.com/in/test"],
      worksFor: [{ "@type": "Organization", name: "Company" }],
      alumniOf: [{ "@type": "EducationalOrganization", name: "University" }],
      knowsAbout: ["one", "two", "three", "four", "five", "six"],
    });
  });
});
