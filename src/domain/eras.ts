import type { Era } from "@content/schema";

/** Steps are 1-based to match the PRD §4.2 table. Coverage is guaranteed by the schema. */
export function eraForStep<T extends Pick<Era, "fromStep" | "toStep">>(
  eras: readonly T[],
  step: number,
): T {
  const era = eras.find((e) => step >= e.fromStep && step <= e.toStep);
  if (!era) throw new RangeError(`No era covers step ${step}`);
  return era;
}
