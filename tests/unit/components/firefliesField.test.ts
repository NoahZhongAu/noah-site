import { describe, expect, it } from "vitest";
import {
  advance,
  brightness,
  hexToRgb,
  particleCount,
  seed,
} from "@/components/composites/firefliesField";

describe("fireflies field", () => {
  it("seeds 24 particles from 768px and 10 below", () => {
    expect(particleCount(1280)).toBe(24);
    expect(particleCount(768)).toBe(24);
    expect(particleCount(390)).toBe(10);
    expect(seed(1280, 800)).toHaveLength(24);
    expect(seed(390, 800)).toHaveLength(10);
  });

  it("makes exactly a quarter of them big, and big ones larger and slower", () => {
    const field = seed(1280, 800, () => 0.5);
    const big = field.filter((p) => p.big);
    const small = field.filter((p) => !p.big);
    expect(big).toHaveLength(6);
    expect(Math.min(...big.map((p) => p.radius))).toBeGreaterThan(
      Math.max(...small.map((p) => p.radius)),
    );
    expect(Math.max(...big.map((p) => p.speed))).toBeLessThan(
      Math.min(...small.map((p) => p.speed)),
    );
  });

  it("keeps radius within 2 to 5.5 and the cycle within 2 to 5 seconds", () => {
    for (const p of seed(1280, 800)) {
      expect(p.radius).toBeGreaterThanOrEqual(2);
      expect(p.radius).toBeLessThanOrEqual(5.5);
      expect(p.cycle).toBeGreaterThanOrEqual(2);
      expect(p.cycle).toBeLessThanOrEqual(5);
    }
  });

  it("pulses brightness between 0.2 and 1", () => {
    const [p] = seed(1280, 800, () => 0.5);
    if (!p) throw new Error("no particle");
    const samples = Array.from({ length: 200 }, (_, i) =>
      brightness({ ...p, big: true }, i / 20),
    );
    expect(Math.min(...samples)).toBeGreaterThanOrEqual(0.2);
    expect(Math.max(...samples)).toBeLessThanOrEqual(1);
    expect(Math.max(...samples)).toBeGreaterThan(0.95);
  });

  it("wraps past the edges", () => {
    const [p] = seed(100, 100, () => 0.5);
    if (!p) throw new Error("no particle");
    p.x = -30;
    advance(p, 100, 100);
    expect(p.x).toBeGreaterThan(100);
    p.y = 130;
    advance(p, 100, 100);
    expect(p.y).toBeLessThan(0);
  });

  it("reads the token colour", () => {
    expect(hexToRgb("#ffd27a")).toEqual([255, 210, 122]);
    expect(hexToRgb(" #FFD27A ")).toEqual([255, 210, 122]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });
});
