import type { ComponentProps } from "react";

/** Text for screen readers only; the sighted equivalent is drawn some other way. */
export function VisuallyHidden({ className, ...rest }: ComponentProps<"span">) {
  return <span className={["sr-only", className].join(" ")} {...rest} />;
}
