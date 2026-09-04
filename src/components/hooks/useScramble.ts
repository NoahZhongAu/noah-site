import { useEffect, useState } from "react";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Only letters and digits scramble; spaces, separators and punctuation hold their place so the line keeps its shape. */
function isScrambleable(char: string): boolean {
  return /[\p{L}\p{N}]/u.test(char);
}

function scrambleAt(text: string, progress: number): string {
  const chars = Array.from(text);
  const revealed = Math.floor(progress * chars.length);
  return chars
    .map((char, index) => {
      if (index < revealed || !isScrambleable(char)) return char;
      return glyphs[Math.floor(Math.random() * glyphs.length)] ?? char;
    })
    .join("");
}

/**
 * Text-scramble reveal for the cover eyebrow (PRD V5). Returns the final
 * string on the server and on the first client render so hydration matches
 * and no-JS visitors read real text; the reveal runs from the first frame
 * after mount, left to right, and always ends on the exact input. Reduced
 * motion skips it entirely.
 */
export function useScramble(text: string, durationMs = 1400): string {
  // null means "not scrambling": before the first frame, after the last, or under reduced motion.
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let start: number | null = null;
    let frame = requestAnimationFrame(tick);

    function tick(now: number) {
      start ??= now;
      const progress = Math.min(1, (now - start) / durationMs);
      setScrambled(progress === 1 ? null : scrambleAt(text, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      setScrambled(null);
    };
  }, [text, durationMs]);

  return scrambled ?? text;
}
