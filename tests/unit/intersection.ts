import { vi } from "vitest";

type Callback = (entries: IntersectionObserverEntry[]) => void;

/**
 * A controllable IntersectionObserver for jsdom, which has none. Tests call
 * `intersect(element, ratio)` to deliver an entry to every observer watching
 * that element, the way the browser would at a threshold crossing.
 */
export function installIntersectionObserver() {
  const observers = new Set<{
    callback: Callback;
    targets: Set<Element>;
    options: IntersectionObserverInit | undefined;
  }>();

  class FakeObserver {
    private record;
    constructor(callback: Callback, options?: IntersectionObserverInit) {
      this.record = { callback, targets: new Set<Element>(), options };
      observers.add(this.record);
    }
    observe(target: Element) {
      this.record.targets.add(target);
    }
    unobserve(target: Element) {
      this.record.targets.delete(target);
    }
    disconnect() {
      observers.delete(this.record);
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
  }

  vi.stubGlobal("IntersectionObserver", FakeObserver);

  return {
    intersect(target: Element, ratio: number) {
      for (const observer of observers) {
        if (!observer.targets.has(target)) continue;
        const threshold = Number(observer.options?.threshold ?? 0);
        observer.callback([
          {
            target,
            intersectionRatio: ratio,
            isIntersecting: ratio >= threshold && ratio > 0,
          } as IntersectionObserverEntry,
        ]);
      }
    },
    count: () => observers.size,
    /** The first non-zero threshold among observers of the target, so a hook with a near observer at 0 still reports its real one. */
    thresholdOf: (target: Element) =>
      [...observers]
        .filter((o) => o.targets.has(target))
        .map((o) => o.options?.threshold)
        .find((t) => t !== undefined && Number(t) > 0),
  };
}
