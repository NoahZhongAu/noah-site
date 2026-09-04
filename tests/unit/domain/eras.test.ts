import { describe, expect, it } from "vitest";
import { eraForStep } from "@/domain/eras";

const eras = [
  { id: 1, fromStep: 1, toStep: 2 },
  { id: 2, fromStep: 3, toStep: 3 },
  { id: 3, fromStep: 4, toStep: 6 },
];

describe("eraForStep", () => {
  it("maps every step in a range to its era", () => {
    expect(eraForStep(eras, 1).id).toBe(1);
    expect(eraForStep(eras, 2).id).toBe(1);
    expect(eraForStep(eras, 3).id).toBe(2);
    expect(eraForStep(eras, 6).id).toBe(3);
  });

  it("throws for a step outside every range", () => {
    expect(() => eraForStep(eras, 7)).toThrow(RangeError);
    expect(() => eraForStep(eras, 0)).toThrow(RangeError);
  });
});
