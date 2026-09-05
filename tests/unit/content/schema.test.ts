import { describe, expect, it } from "vitest";
import { ResumeSchema } from "@content/schema";

const era = (id: number, fromStep: number, toStep: number) => ({
  id,
  image: `/eras/era-${id}.jpg`,
  alt: `Era ${id}`,
  fromStep,
  toStep,
});

const entry = (id: string, start: string, end: string) => ({
  id,
  kind: "role" as const,
  title: `Title ${id}`,
  org: "Org",
  location: "Melbourne",
  start,
  end,
  bullets: ["One bullet"],
});

const valid = {
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
    entry("a", "2022-01", "2022-06"),
    entry("b", "2023-01", "2023-06"),
    entry("c", "2024-01", "2024-06"),
    entry("d", "2025-01", "2025-06"),
    entry("e", "2026-01", "2026-03"),
    entry("f", "2026-04", "2026-06"),
    entry("g", "2026-07", "present"),
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
  skills: Array.from({ length: 5 }, (_, i) => ({
    label: `G${i}`,
    items: ["x"],
  })),
  eras: [
    era(1, 1, 1),
    era(2, 2, 2),
    era(3, 3, 3),
    era(4, 4, 4),
    era(5, 5, 5),
    era(6, 6, 6),
    era(7, 7, 7),
  ],
  closing: {
    projects: {
      eyebrow: "Selected work",
      title: "Projects",
      image: "/closing/a.jpg",
      alt: "A",
      repoLabel: "Repository",
      liveLabel: "Live",
    },
    skills: {
      eyebrow: "Skills",
      title: "Skills",
      image: "/closing/b.jpg",
      alt: "B",
    },
    contact: {
      title: "Hello.",
      image: "/closing/c.jpg",
      alt: "C",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  footer: {
    note: "Note.",
    repo: "https://github.com/test/site",
    repoLabel: "Repository",
    resumeLabel: "Résumé",
  },
};

function pathsOf(input: unknown): string[] {
  const result = ResumeSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
}

describe("ResumeSchema", () => {
  it("accepts a valid résumé", () => {
    expect(ResumeSchema.safeParse(valid).success).toBe(true);
  });

  it("names the path of a bullet count violation", () => {
    const broken = structuredClone(valid);
    broken.entries[2]!.bullets = [];
    expect(pathsOf(broken)).toContain("entries.2.bullets");
  });

  it("reports every failing field at once", () => {
    const broken = structuredClone(valid);
    broken.person.email = "nope";
    broken.entries[0]!.start = "2022-13";
    broken.entries[1]!.end = "2022-01";
    const paths = pathsOf(broken);
    expect(paths).toEqual(
      expect.arrayContaining([
        "person.email",
        "entries.0.start",
        "entries.1.end",
      ]),
    );
  });

  it("rejects duplicate ids and slugs", () => {
    const broken = structuredClone(valid);
    broken.entries[1]!.id = "a";
    expect(pathsOf(broken)).toContain("entries.1");
  });

  it("rejects unbalanced headline emphasis", () => {
    const broken = structuredClone(valid);
    broken.person.headline = "one *two";
    expect(pathsOf(broken)).toContain("person.headline");
  });

  describe("era coverage", () => {
    it("rejects a gap", () => {
      const eras = [
        era(1, 1, 1),
        era(2, 3, 3),
        era(3, 4, 4),
        era(4, 5, 5),
        era(5, 6, 6),
      ];
      expect(pathsOf({ ...valid, eras })).toContain("eras.1.fromStep");
    });

    it("rejects an overlap", () => {
      const eras = [
        era(1, 1, 2),
        era(2, 2, 3),
        era(3, 4, 4),
        era(4, 5, 5),
        era(5, 6, 6),
      ];
      expect(pathsOf({ ...valid, eras })).toContain("eras.1.fromStep");
    });

    it("rejects coverage that stops short of the entry count", () => {
      const entries = [...valid.entries, entry("h", "2026-08", "present")];
      expect(pathsOf({ ...valid, entries })).toContain("eras");
    });

    it("rejects coverage that runs past the entry count", () => {
      const eras = [
        era(1, 1, 1),
        era(2, 2, 2),
        era(3, 3, 3),
        era(4, 4, 4),
        era(5, 5, 6),
      ];
      expect(pathsOf({ ...valid, eras })).toContain("eras");
    });

    it("rejects toStep before fromStep", () => {
      const eras = [
        era(1, 1, 1),
        era(2, 2, 2),
        era(3, 3, 3),
        era(4, 4, 3),
        era(5, 4, 5),
      ];
      expect(pathsOf({ ...valid, eras })).toContain("eras.3.toStep");
    });
  });
});

describe("closing scenes (ADR 0007)", () => {
  it("accepts the fixture", () => {
    expect(pathsOf(valid)).toEqual([]);
  });

  it("keeps closing images under /closing/ and the footer repo a URL", () => {
    const wrongImage = structuredClone(valid);
    wrongImage.closing.skills.image = "/eras/era-1.jpg";
    expect(pathsOf(wrongImage)).toContain("closing.skills.image");
    const wrongRepo = structuredClone(valid);
    wrongRepo.footer.repo = "not a url";
    expect(pathsOf(wrongRepo)).toContain("footer.repo");
  });
});
