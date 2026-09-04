/**
 * The one SVG gradient every border-draw stroke references by id.
 * Defined once in the layout so section rules and buttons share it.
 */
export function EdgeGradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {/* stop-color must be a style, not an attribute: SVG presentation attributes do not resolve var(). */}
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0%"
            style={{ stopColor: "var(--fg)" }}
            stopOpacity="0"
          />
          <stop offset="20%" style={{ stopColor: "var(--fg)" }} />
          <stop offset="80%" style={{ stopColor: "var(--fg)" }} />
          <stop
            offset="100%"
            style={{ stopColor: "var(--fg)" }}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
    </svg>
  );
}
