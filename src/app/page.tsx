import { resume } from "@content/index";
import { Cover } from "@/components/sections/Cover";
import { Story } from "@/components/sections/Story";
import type { NavLink } from "@/components/composites/SiteNav";

// Sections below the story are still the milestone 2 placeholders: parsed
// content as plain semantic HTML. Milestones 5 and 6 replace them.

// Durations for open-ended entries are fixed at build time (PLAN §6 item 23).
const now = new Date().toISOString().slice(0, 7);

// PRD §3 anchors, in page order.
const navLinks: NavLink[] = [
  { href: "#story", label: "Story" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  const { person, entries, eras, projects, skills } = resume;

  return (
    <>
      <Cover person={person} navLinks={navLinks} />

      <Story entries={entries} eras={eras} now={now} />

      {/* snap-start: the first snap point after the story, so a wheel gesture out of step 7 lands here (ADR 0006). */}
      <section id="projects" className="snap-start px-gutter py-section">
        <h2 className="text-section">Projects</h2>
        <ul className="mt-12 grid gap-8">
          {projects.map((project) => (
            <li key={project.slug}>
              <p className="text-mono-label text-fg-62">{project.category}</p>
              <h3 className="font-display text-3xl">{project.title}</h3>
              <p className="text-mono-tight text-fg-62">
                {project.stack.join(" · ")}
              </p>
              <p>{project.pitch}</p>
              {project.links.repo ? (
                <a
                  href={project.links.repo}
                  className="underline underline-offset-4"
                >
                  Repository
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="px-gutter py-section">
        <h2 className="text-section">Skills</h2>
        <dl className="mt-12 grid gap-6">
          {skills.map((group) => (
            <div key={group.label}>
              <dt className="text-mono-label text-fg-62">{group.label}</dt>
              <dd>{group.items.join(", ")}.</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="px-gutter py-section">
        <h2 className="text-section">Contact</h2>
        <p className="mt-6">{person.availability}</p>
        <ul className="mt-4 grid gap-2">
          <li>
            <a
              href={`mailto:${person.email}`}
              className="underline underline-offset-4"
            >
              {person.email}
            </a>
          </li>
          <li>
            <a
              href={person.links.github}
              className="underline underline-offset-4"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={person.links.linkedin}
              className="underline underline-offset-4"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a href="/resume" download className="underline underline-offset-4">
              Download résumé
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
