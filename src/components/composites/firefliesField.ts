/**
 * The fireflies field (ADR 0005), kept pure so the numbers can be tested
 * without a canvas. Values are the ones from timeline-demo.html.
 */
export type Particle = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  cycle: number;
  angle: number;
  big: boolean;
};

export const TAU = Math.PI * 2;
const WRAP = 20;
const HALO = 3;

export function particleCount(width: number): number {
  return width < 768 ? 10 : 24;
}

/** Every fourth particle is the larger, brighter, slower kind: exactly a quarter, whatever the count. */
export function seed(
  width: number,
  height: number,
  random: () => number = Math.random,
): Particle[] {
  return Array.from({ length: particleCount(width) }, (_, index) => {
    const big = index % 4 === 0;
    return {
      x: random() * width,
      y: random() * height,
      radius: big ? 4 + random() * 1.5 : 2 + random() * 2,
      phase: random() * TAU,
      speed: big ? 0.35 + random() * 0.25 : 0.6 + random() * 0.5,
      cycle: 2 + random() * 3,
      angle: random() * TAU,
      big,
    };
  });
}

/** One frame of drift: a slow turn, a sine wobble, a slight lift, and a wrap 20px past each edge. */
export function advance(p: Particle, width: number, height: number): void {
  p.angle += 0.004 * p.speed;
  p.x += Math.cos(p.angle) * p.speed * 0.9;
  p.y += Math.sin(p.angle * 1.3 + p.phase) * p.speed * 0.6 - 0.12;
  if (p.x < -WRAP) p.x = width + WRAP;
  if (p.x > width + WRAP) p.x = -WRAP;
  if (p.y < -WRAP) p.y = height + WRAP;
  if (p.y > height + WRAP) p.y = -WRAP;
}

/** Brightness 0.2 to 1 on the particle's own cycle; the big ones sit at the top of the range, the small ones a little under. */
export function brightness(p: Particle, seconds: number): number {
  const pulse =
    0.2 + 0.8 * (0.5 + 0.5 * Math.sin((seconds * TAU) / p.cycle + p.phase));
  return p.big ? pulse : pulse * 0.85;
}

export function haloRadius(p: Particle): number {
  return p.radius * HALO;
}

/** "#ffd27a" to [255, 210, 122], so the one colour stays a token in tokens.css. */
export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
