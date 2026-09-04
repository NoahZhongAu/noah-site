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
 *
 * `isNear` is a second observer with a one-viewport margin: a card's header
 * image mounts only then, so the phone never requests story images while
 * the cover's fonts and poster are still loading (Lighthouse charged that
 * at 0.2s of LCP). Never true before hydration; the server HTML has no
 * header images and a noscript fallback carries them for no-JS visitors.
 */
export function useActiveStep(count: number) {
  const elements = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [inStory, setInStory] = useState(false);
  const [near, setNear] = useState<ReadonlySet<number>>(() => new Set());
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
    const nearObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = elements.current.indexOf(entry.target as HTMLElement);
          if (index < 0 || !entry.isIntersecting) continue;
          setNear((previous) =>
            previous.has(index) ? previous : new Set(previous).add(index),
          );
        }
      },
      { rootMargin: "100% 0px" },
    );
    for (const element of elements.current) {
      if (!element) continue;
      observer.observe(element);
      nearObserver.observe(element);
    }
    return () => {
      observer.disconnect();
      nearObserver.disconnect();
    };
  }, [count]);

  const isShown = useCallback(
    (index: number) => !hydrated || seen.has(index),
    [hydrated, seen],
  );
  const isNear = useCallback((index: number) => near.has(index), [near]);

  return { active, isShown, isNear, inStory, setRef };
}
