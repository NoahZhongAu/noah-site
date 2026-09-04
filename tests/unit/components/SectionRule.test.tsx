import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SectionRule } from "@/components/primitives/SectionRule";
import { installIntersectionObserver } from "../intersection";

afterEach(() => vi.unstubAllGlobals());

describe("SectionRule", () => {
  it("draws once it enters view and never undraws", () => {
    const io = installIntersectionObserver();
    const { container } = render(<SectionRule />);
    const svg = container.querySelector("svg");
    if (!svg) throw new Error("no svg");
    expect(svg).not.toHaveAttribute("data-drawn");

    act(() => io.intersect(svg, 0.3));
    expect(svg).toHaveAttribute("data-drawn");

    act(() => io.intersect(svg, 0));
    expect(svg).toHaveAttribute("data-drawn");
    // Disconnected after the first entrance: nothing left to observe.
    expect(io.count()).toBe(0);
  });

  it("is decorative", () => {
    installIntersectionObserver();
    const { container } = render(<SectionRule />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
