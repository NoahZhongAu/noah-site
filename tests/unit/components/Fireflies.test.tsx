import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Fireflies } from "@/components/composites/Fireflies";
import { installIntersectionObserver } from "../intersection";

// jsdom has no 2D context; the loop only needs these calls to exist.
const context = {
  clearRect: vi.fn(),
  createRadialGradient: () => ({ addColorStop: vi.fn() }),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
};

function stubMedia(reduce: boolean, narrow = false) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduced-motion") ? reduce : narrow,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Fireflies", () => {
  it("renders no canvas under reduced motion, under Save-Data, or under 768px", () => {
    installIntersectionObserver();
    stubMedia(true);
    expect(render(<Fireflies />).container.querySelector("canvas")).toBeNull();

    stubMedia(false);
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
    expect(render(<Fireflies />).container.querySelector("canvas")).toBeNull();
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: undefined,
    });

    stubMedia(false, true);
    expect(render(<Fireflies />).container.querySelector("canvas")).toBeNull();
  });

  it("runs only while on screen and the tab is visible", () => {
    const io = installIntersectionObserver();
    stubMedia(false);
    const { container } = render(
      <div>
        <Fireflies />
      </div>,
    );
    const canvas = container.querySelector("canvas");
    if (!canvas) throw new Error("no canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas.dataset.running).toBe("false");

    act(() => io.intersect(canvas, 0.5));
    expect(canvas.dataset.running).toBe("true");

    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(canvas.dataset.running).toBe("false");

    hidden.mockReturnValue(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(canvas.dataset.running).toBe("true");

    act(() => io.intersect(canvas, 0));
    expect(canvas.dataset.running).toBe("false");
  });
});
