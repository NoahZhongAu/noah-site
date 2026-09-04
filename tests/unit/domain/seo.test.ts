import { describe, expect, it } from "vitest";
import type { Resume } from "@content/schema";
import { personJsonLd } from "@/domain/seo";

const resume: Resume = {
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
  projects: [
    {
      slug: "p",
      category: "c",
      title: "t",
      stack: ["s"],
      pitch: "p",
      details: ["d"],
      links: {},
    },
  ],
  skills: [
    { label: "A", items: ["one", "two"] },
    { label: "B", items: ["three"] },
    { label: "C", items: ["four"] },
    { label: "D", items: ["five"] },
    { label: "E", items: ["six"] },
  ],
  eras: [
    { id: 1, image: "/eras/era-1.jpg", alt: "a", fromStep: 1, toStep: 1 },
    { id: 2, image: "/eras/era-2.jpg", alt: "b", fromStep: 2, toStep: 2 },
    { id: 3, image: "/eras/era-3.jpg", alt: "c", fromStep: 3, toStep: 3 },
    { id: 4, image: "/eras/era-4.jpg", alt: "d", fromStep: 4, toStep: 4 },
    { id: 5, image: "/eras/era-5.jpg", alt: "e", fromStep: 5, toStep: 5 },
    { id: 6, image: "/eras/era-6.jpg", alt: "f", fromStep: 6, toStep: 6 },
    { id: 7, image: "/eras/era-7.jpg", alt: "g", fromStep: 7, toStep: 7 },
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
