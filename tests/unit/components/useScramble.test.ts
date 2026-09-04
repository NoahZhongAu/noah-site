import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScramble } from "@/components/hooks/useScramble";

const text = "MELBOURNE · AI DEPLOYMENT ENGINEER · OPEN TO 2027 GRADUATE ROLES";
const chars = Array.from(text);
const duration = 1000;

// Frames are queued and fired by hand so each test owns the clock.
let frames: FrameRequestCallback[] = [];

function tick(now: number) {
  const pending = frames;
  frames = [];
  act(() => {
    for (const callback of pending) callback(now);
  });
}

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useScramble", () => {
  it("renders the final string before the first frame and after the last", () => {
    const { result } = renderHook(() => useScramble(text, duration));
    expect(result.current).toBe(text);

    tick(0);
    tick(duration / 2);
    tick(duration);
    expect(result.current).toBe(text);
    expect(frames).toHaveLength(0);
  });

  it("keeps separators, spaces and length intact while scrambling", () => {
    const { result } = renderHook(() => useScramble(text, duration));
    tick(0);
    tick(duration / 4);

    const shown = Array.from(result.current);
    expect(shown).toHaveLength(chars.length);
    chars.forEach((char, index) => {
      if (!/[\p{L}\p{N}]/u.test(char)) expect(shown[index]).toBe(char);
    });
  });

  it("reveals from the left in proportion to elapsed time", () => {
    const { result } = renderHook(() => useScramble(text, duration));
    tick(0);
    tick(duration / 2);

    const revealed = Math.floor(chars.length / 2);
    expect(Array.from(result.current).slice(0, revealed)).toEqual(
      chars.slice(0, revealed),
    );
  });

  it("does nothing under reduced motion", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    vi.stubGlobal("matchMedia", () => ({ ...reduce, matches: true }));
    const { result } = renderHook(() => useScramble(text, duration));
    expect(result.current).toBe(text);
    expect(frames).toHaveLength(0);
  });
});
