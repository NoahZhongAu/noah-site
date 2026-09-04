"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  advance,
  brightness,
  haloRadius,
  hexToRgb,
  seed,
  TAU,
  type Particle,
} from "./firefliesField";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

// Desktop layout only: under 768px the backdrop that holds the canvas is display:none (plan decision 5).
const queries = ["(prefers-reduced-motion: reduce)", "(max-width: 767px)"];

function subscribe(onChange: () => void) {
  const lists = queries.map((query) => matchMedia(query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

/** Desktop width, motion allowed, no Save-Data (ADR 0005); the server never wants it, so the HTML has no canvas. */
function getWanted() {
  const saveData =
    (navigator as NavigatorWithConnection).connection?.saveData === true;
  return !saveData && queries.every((query) => !matchMedia(query).matches);
}
const getServerWanted = () => false;

/**
 * Fireflies over the story backdrop (ADR 0005). Canvas 2D, no library. The
 * loop runs only while the canvas is on screen and the tab is visible;
 * resize re-seeds the field. `data-running` is for the tests.
 */
export function Fireflies() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wanted = useSyncExternalStore(subscribe, getWanted, getServerWanted);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;

    const [r, g, b] = hexToRgb(
      getComputedStyle(canvas).getPropertyValue("--firefly"),
    );
    const rgba = (alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let running = false;
    let inView = false;
    let frame = 0;

    const reseed = () => {
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
      particles = seed(width, height);
    };

    const draw = (time: number) => {
      if (!running) return;
      context.clearRect(0, 0, width, height);
      const seconds = time / 1000;
      for (const p of particles) {
        advance(p, width, height);
        const glow = brightness(p, seconds);
        const halo = haloRadius(p);
        const gradient = context.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          halo,
        );
        gradient.addColorStop(0, rgba(glow * 0.95));
        gradient.addColorStop(0.35, rgba(glow * 0.35));
        gradient.addColorStop(1, rgba(0));
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(p.x, p.y, halo, 0, TAU);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun === running) return;
      running = shouldRun;
      canvas.dataset.running = String(running);
      if (running) frame = requestAnimationFrame(draw);
      else cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.05 },
    );

    reseed();
    observer.observe(canvas);
    addEventListener("resize", reseed);
    document.addEventListener("visibilitychange", sync);
    canvas.dataset.running = "false";

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("resize", reseed);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [wanted]);

  if (!wanted) return null;

  return (
    <canvas
      ref={ref}
      className="fireflies pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    />
  );
}
