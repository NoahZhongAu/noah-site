export type GlassSize = "sm" | "lg";

const sizes: Record<GlassSize, string> = {
  sm: "px-6 py-2.5 text-sm",
  lg: "px-14 py-5 text-base",
};

/** One class list for every glass pill, so a link and a button can never drift apart. */
export function glassClassName(size: GlassSize, className?: string): string {
  return [
    "liquid-glass inline-flex items-center justify-center rounded-pill font-body",
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
