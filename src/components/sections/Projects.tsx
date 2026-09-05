import type { Closing, Project } from "@content/schema";

type Props = { projects: readonly Project[]; scene: Closing["projects"] };

/** The Projects step (ADR 0007): a compact list. The in-place expand of PRD §4.3 is milestone 5. */
export function Projects({ projects, scene }: Props) {
  return (
    <>
      <p className="text-mono-label mb-3.5 text-fg-62">{scene.eyebrow}</p>
      <h2 className="text-step-title mb-6">{scene.title}</h2>
      <ul className="grid gap-5">
        {projects.map((project) => (
          <li key={project.slug}>
            <p className="text-mono-tight text-fg-62">{project.category}</p>
            <h3 className="font-display text-2xl leading-tight">
              {project.title}
            </h3>
            <p className="text-fg-80">{project.pitch}</p>
            {project.links.repo || project.links.live ? (
              <p className="text-mono-tight mt-1 flex gap-4">
                {project.links.repo ? (
                  <a
                    href={project.links.repo}
                    className="underline underline-offset-4"
                  >
                    {scene.repoLabel}
                  </a>
                ) : null}
                {project.links.live ? (
                  <a
                    href={project.links.live}
                    className="underline underline-offset-4"
                  >
                    {scene.liveLabel}
                  </a>
                ) : null}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
