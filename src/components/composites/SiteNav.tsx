"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { scrollToHash } from "@/components/hooks/scrollToHash";
import { VisuallyHidden } from "@/components/primitives/VisuallyHidden";
import { ResumeDownloadLink } from "./ResumeDownloadLink";

export type NavLink = { href: `#${string}`; label: string };

type Props = { name: string; links: NavLink[] };

/**
 * Cover navigation (PRD §4.1): name as the logo, a glass pill of section
 * anchors from 768px, the download button, and a hamburger below 768px that
 * opens a disclosure panel (PLAN §6 item 29). The panel closes on link
 * click, Escape and outside click; there is no focus trap because the page
 * behind it stays usable.
 */
export function SiteNav({ name, links }: Props) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const go = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToHash(event.currentTarget.hash)) event.preventDefault();
    setOpen(false);
  };

  const anchorClass =
    "block rounded-pill px-4 py-2 text-sm text-fg-62 hover:text-fg focus-visible:text-fg";

  return (
    <nav
      ref={navRef}
      aria-label="Site"
      className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 md:px-8"
    >
      <a
        href="#top"
        onClick={go}
        className="font-display text-3xl leading-none tracking-tight"
      >
        {name}
      </a>

      <ul className="liquid-glass hidden rounded-pill p-1 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={go} className={anchorClass}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <ResumeDownloadLink />
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="liquid-glass rounded-pill p-2.5 md:hidden"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <VisuallyHidden>{open ? "Close menu" : "Open menu"}</VisuallyHidden>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" />
          )}
        </svg>
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="liquid-glass absolute inset-x-6 top-full z-10 rounded-card p-2 md:hidden"
      >
        <ul className="grid gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={go} className={anchorClass}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 border-t border-line-soft pt-3">
            <ResumeDownloadLink className="w-full" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
