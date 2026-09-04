/**
 * In-page navigation for nav anchors and "Know more" (PRD S2, PLAN N9).
 * Smooth unless the visitor prefers reduced motion, and the URL keeps the
 * hash so the section stays linkable. Returns false when the target is
 * missing so the caller can let the browser handle the click.
 */
export function scrollToHash(hash: string): boolean {
  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return false;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
  history.pushState(null, "", hash);
  return true;
}
