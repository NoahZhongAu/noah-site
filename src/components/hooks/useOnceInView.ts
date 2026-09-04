import { useEffect, useState, type RefObject } from "react";

/**
 * True from the first time the element enters view, and never false again:
 * every entrance on the site fires once (PRD §8). The reference triggers at a
 * quarter visible with the bottom 8% of the viewport excluded, so a rule
 * sitting right at the fold does not draw before the reader reaches it.
 */
export function useOnceInView(
  ref: RefObject<Element | null>,
  threshold = 0.25,
  rootMargin = "0px 0px -8% 0px",
): boolean {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, seen, threshold, rootMargin]);

  return seen;
}
