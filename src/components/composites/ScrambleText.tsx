"use client";

import { useScramble } from "@/components/hooks/useScramble";
import { VisuallyHidden } from "@/components/primitives/VisuallyHidden";

type Props = { text: string; className?: string };

/**
 * Server output is the plain final string. While the scramble runs, the
 * visible glyphs are hidden from assistive technology and the real text is
 * read instead, so nobody hears random letters.
 */
export function ScrambleText({ text, className }: Props) {
  const shown = useScramble(text);

  if (shown === text) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span aria-hidden="true">{shown}</span>
      <VisuallyHidden>{text}</VisuallyHidden>
    </span>
  );
}
