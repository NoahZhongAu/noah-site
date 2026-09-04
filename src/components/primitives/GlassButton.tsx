import type { ComponentProps } from "react";
import { glassClassName, type GlassSize } from "./glass";

type Props = ComponentProps<"button"> & { size?: GlassSize };

/** The liquid-glass pill as a native button (PRD V3). */
export function GlassButton({
  size = "sm",
  type = "button",
  className,
  ...rest
}: Props) {
  return (
    <button type={type} className={glassClassName(size, className)} {...rest} />
  );
}
