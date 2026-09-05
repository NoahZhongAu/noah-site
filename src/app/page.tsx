import { resume } from "@content/index";
import { Cover } from "@/components/sections/Cover";
import { Story } from "@/components/sections/Story";
import { Footer } from "@/components/sections/Footer";
import type { NavLink } from "@/components/composites/SiteNav";

// Projects, Skills and Contact are steps of the timeline until milestones 5
// and 6 replace them in place (ADR 0007).

// Durations for open-ended entries and the footer year are fixed at build time (PLAN §6 item 23).
const now = new Date().toISOString().slice(0, 7);
const year = new Date().getFullYear();

// PRD §3 anchors, in page order.
const navLinks: NavLink[] = [
  { href: "#story", label: "Story" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  const { person, entries, eras, projects, skills, closing, footer } = resume;

  return (
    <>
      <Cover person={person} navLinks={navLinks} />

      <Story
        entries={entries}
        eras={eras}
        projects={projects}
        skills={skills}
        person={person}
        closing={closing}
        label={navLinks[0]?.label ?? "Story"}
        now={now}
      />

      <Footer name={person.name} year={year} footer={footer} />
    </>
  );
}
