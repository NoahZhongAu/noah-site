"use client";

import type { MouseEvent } from "react";
import { scrollToHash } from "@/components/hooks/scrollToHash";
import { GlassLink } from "@/components/primitives/GlassLink";
import { ResumeDownloadLink } from "./ResumeDownloadLink";

/** The two cover buttons (PRD §4.1). A client island so "Know more" can scroll without a hash jump. */
export function CoverActions() {
  const knowMore = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToHash("#story")) event.preventDefault();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <GlassLink href="#story" size="lg" onClick={knowMore}>
        Know more
      </GlassLink>
      <ResumeDownloadLink size="lg" />
    </div>
  );
}
