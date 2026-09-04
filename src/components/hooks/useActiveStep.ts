import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const noSubscription = () => () => undefined;

/**
 * Which timeline step is on screen (PRD §4.2): one IntersectionObserver at
 * threshold 0.6, no scroll listener. `active` drives the era, rail and
 * counter; `isShown` is true for every step that has been active, so entry
 * text focuses in once and stays; `inStory` is true while any step is at
 * least 60% visible, which is when scroll snap may be on.
 *
 * Until hydration every step counts as shown, so the server HTML and a
 * visitor without JavaScript read every entry at its final state.
 */
export function useActiveStep(count: number) {
  const elements = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [inStory, setInStory] = useState(false);
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

  const setRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      elements.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    const onScreen = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = elements.current.indexOf(entry.target as HTMLElement);
          if (index < 0) continue;
          if (entry.isIntersecting) {
            onScreen.add(index);
            setActive(index);
            setSeen((previous) =>
              previous.has(index) ? previous : new Set(previous).add(index),
            );
          } else {
            onScreen.delete(index);
          }
        }
        setInStory(onScreen.size > 0);
      },
      { threshold: 0.6 },
    );
    for (const element of elements.current) {
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [count]);

  const isShown = useCallback(
    (index: number) => !hydrated || seen.has(index),
    [hydrated, seen],
  );

  return { active, isShown, inStory, setRef };
}
