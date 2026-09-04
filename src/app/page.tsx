import { resume } from "@content/index";
import {
  formatDateRange,
  formatDuration,
  sortEntriesAscending,
} from "@/domain/dates";
import { parseEmphasis } from "@/domain/emphasis";

// Milestone 2: the parsed content as plain semantic HTML so the pipeline is
// proven end to end. Milestones 3 to 6 replace each section with its real one.

// Durations for open-ended entries are fixed at build time (PLAN §6 item 23).
const now = new Date().toISOString().slice(0, 7);

export default function Home() {
  const { person, entries, projects, skills } = resume;
  const steps = sortEntriesAscending(entries);

  return (
    <>
      <section
        id="top"
        className="flex min-h-svh flex-col justify-center gap-6 px-gutter"
      >
        <p className="text-mono-label">{person.eyebrow}</p>
        <h1 className="text-headline">{person.name}</h1>
        <p className="text-section">
          {parseEmphasis(person.headline).map((segment, i) =>
            segment.emphasis ? (
              <em key={i} className="text-fg-62 not-italic">
                {segment.text}
              </em>
            ) : (
              <span key={i}>{segment.text}</span>
            ),
          )}
        </p>
        <p className="max-w-measure">{person.bio}</p>
      </section>

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
