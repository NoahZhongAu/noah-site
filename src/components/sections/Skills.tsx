import type { Closing, SkillGroup } from "@content/schema";

type Props = { groups: readonly SkillGroup[]; scene: Closing["skills"] };

/** The Skills step (ADR 0007): five groups in two columns on the left third; items as a sentence, not a tag cloud (PRD §4.4). */
export function Skills({ groups, scene }: Props) {
  return (
    <>
      <p className="text-mono-label mb-3.5 text-fg-62">{scene.eyebrow}</p>
      <h2 className="text-step-title mb-6">{scene.title}</h2>
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.label}>
            <dt className="text-mono-tight mb-1 text-fg-62">{group.label}</dt>
            <dd className="text-fg-80">{group.items.join(", ")}.</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
