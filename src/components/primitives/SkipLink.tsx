/** First focusable element on the page; jumps keyboard users past the cover to the main landmark. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-input focus:bg-fg focus:px-4 focus:py-2 focus:text-bg text-mono-label"
    >
      Skip to content
    </a>
  );
}
