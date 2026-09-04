"use client";

import { track } from "@vercel/analytics";
import type { ReactNode } from "react";
import { GlassLink } from "@/components/primitives/GlassLink";
import type { GlassSize } from "@/components/primitives/glass";

type Props = { size?: GlassSize; className?: string; children?: ReactNode };

/**
 * Every résumé download goes through /resume (PRD §6). The analytics event
 * fires and the navigation proceeds; nothing is awaited, so a blocked
 * analytics script never blocks the download.
 */
export function ResumeDownloadLink({
  size = "sm",
  className,
  children = "Download résumé",
}: Props) {
  return (
    <GlassLink
      href="/resume"
      download
      size={size}
      className={className}
      onClick={() => track("resume_download")}
    >
      {children}
    </GlassLink>
  );
}
