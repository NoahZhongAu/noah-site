import type { ComponentProps } from "react";
import { glassClassName, type GlassSize } from "./glass";

type Props = ComponentProps<"a"> & { size?: GlassSize };

/** The liquid-glass pill as a link (PRD V3). */
export function GlassLink({
  size = "sm",
  className,
  children,
  ...rest
}: Props) {
  return (
    <a className={glassClassName(size, className)} {...rest}>
      {children}
    </a>
  );
}
