import { resume } from "@content/index";
import {
  formatDateRange,
  formatDuration,
  sortEntriesAscending,
} from "@/domain/dates";
import { Cover } from "@/components/sections/Cover";
import type { NavLink } from "@/components/composites/SiteNav";

// Sections below the cover are still the milestone 2 placeholders: parsed
// content as plain semantic HTML. Milestones 4 to 6 replace them.

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
  const { person, entries, projects, skills } = resume;
  const steps = sortEntriesAscending(entries);

  return (
    <>
      <Cover person={person} navLinks={navLinks} />

      <section id="story" className="px-gutter py-section">
        <h2 className="text-section">Story</h2>
        <ol className="mt-12 grid gap-12">
          {steps.map((entry) => (
            <li key={entry.id} className="max-w-[60ch]">
              <p className="text-mono-label text-fg-62">
                {formatDateRange(entry.start, entry.end)} ·{" "}
                {formatDuration(entry.start, entry.end, now)}
              </p>
              <h3 className="font-display text-3xl">{entry.title}</h3>
              <p className="text-fg-80">
                {entry.org}, {entry.location}
              </p>
              <ul className="mt-4 list-disc pl-5">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" className="px-gutter py-section">
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
