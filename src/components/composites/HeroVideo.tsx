"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";

type Props = { poster: string; sources: { mp4: string; webm: string } };

// navigator.connection is not in lib.dom; this narrows to the one field read (PLAN §6 item 20).
type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const queries = ["(prefers-reduced-motion: reduce)", "(max-width: 767px)"];

function subscribe(onChange: () => void) {
  const lists = queries.map((query) => matchMedia(query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

/** Desktop width, motion allowed, no Save-Data: the three conditions video-hero.md sets for the loop. */
function getWanted() {
  const saveData =
    (navigator as NavigatorWithConnection).connection?.saveData === true;
  return !saveData && queries.every((query) => !matchMedia(query).matches);
}

// The server never wants the video, so the HTML carries only the poster.
const getServerWanted = () => false;

/**
 * Cover background (PRD V1, video-hero.md). The poster is a next/image layer
 * and the LCP element. The <video> is not in the server HTML at all: it
 * mounts only once the client decides the visitor should get the loop, so
 * nothing downloads on first paint and a visitor without JavaScript sees
 * the poster, not an empty player with native controls. Once mounted it
 * pauses off-screen and when the tab is hidden.
 */
export function HeroVideo({ poster, sources }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const wanted = useSyncExternalStore(subscribe, getWanted, getServerWanted);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) {
        // Autoplay can be refused; the poster simply stays.
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [wanted]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={poster}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      {wanted ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          loop
          preload="none"
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
