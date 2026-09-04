import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveStep } from "@/components/hooks/useActiveStep";
import { installIntersectionObserver } from "../intersection";

afterEach(() => vi.unstubAllGlobals());

/** Renders steps the way StoryTimeline does: refs attach in commit, before the observer effect runs. */
function Harness({ count }: { count: number }) {
  const { active, isShown, isNear, inStory, setRef } = useActiveStep(count);
  return (
    <ol data-active={active} data-in-story={inStory}>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          ref={setRef(index)}
          data-shown={isShown(index) ? "" : undefined}
          data-near={isNear(index) ? "" : undefined}
        />
      ))}
    </ol>
  );
}

function mount(count = 3) {
  const io = installIntersectionObserver();
  const { container } = render(<Harness count={count} />);
  const list = container.querySelector("ol");
  const steps = [...container.querySelectorAll("li")];
  if (!list) throw new Error("no list");
  const shown = () => steps.map((step) => step.hasAttribute("data-shown"));
  const near = () => steps.map((step) => step.hasAttribute("data-near"));
  return { io, list, steps, shown, near };
}

describe("useActiveStep", () => {
  it("starts on step 1, shows only step 1 once hydrated, and observes every step at 0.6", () => {
    const { io, list, steps, shown } = mount();
    expect(list.dataset.active).toBe("0");
    expect(list.dataset.inStory).toBe("false");
    expect(shown()).toEqual([true, false, false]);
    expect(io.count()).toBe(2);
    for (const step of steps) expect(io.thresholdOf(step)).toBe(0.6);
  });

  it("marks a step near, for its header image, before it is active", () => {
    const { io, steps, near, shown } = mount();
    const [, second] = steps;
    if (!second) throw new Error("steps");
    expect(near()).toEqual([false, false, false]);
    // A sliver in view: the near observer (threshold 0) fires, the 0.6 one does not.
    act(() => io.intersect(second, 0.1));
    expect(near()).toEqual([false, true, false]);
    expect(shown()).toEqual([true, false, false]);
  });

  it("activates the step that crosses the threshold and reports when none is on screen", () => {
    const { io, list, steps } = mount();
    const [, second, third] = steps;
    if (!second || !third) throw new Error("steps");

    act(() => io.intersect(second, 0.7));
    expect(list.dataset.active).toBe("1");
    expect(list.dataset.inStory).toBe("true");

    act(() => io.intersect(second, 0.5));
    expect(list.dataset.inStory).toBe("false");

    act(() => io.intersect(third, 1));
    expect(list.dataset.active).toBe("2");
    expect(list.dataset.inStory).toBe("true");
  });

  it("keeps every step it has shown, so text focuses in once and stays", () => {
    const { io, steps, shown } = mount();
    const [, second, third] = steps;
    if (!second || !third) throw new Error("steps");
    act(() => io.intersect(third, 1));
    act(() => io.intersect(third, 0));
    expect(shown()).toEqual([true, false, true]);
    act(() => io.intersect(second, 1));
    expect(shown()).toEqual([true, true, true]);
  });
});
