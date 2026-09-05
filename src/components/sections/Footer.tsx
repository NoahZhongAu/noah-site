import type { Footer as FooterContent } from "@content/schema";

type Props = { name: string; year: number; footer: FooterContent };

/** PRD §4.6. A snap target after the contact step (ADR 0007), so a wheel gesture out of the timeline lands here. */
export function Footer({ name, year, footer }: Props) {
  return (
    <footer className="snap-start text-mono-tight grid gap-2 px-gutter py-section text-fg-62">
      <p>
        {name} · {year}
      </p>
      <p>{footer.note}</p>
      <p className="flex gap-4">
        <a href={footer.repo} className="underline underline-offset-4">
          {footer.repoLabel}
        </a>
        <a href="/resume" download className="underline underline-offset-4">
          {footer.resumeLabel}
        </a>
      </p>
    </footer>
  );
}
