import Image from "next/image";
import type { Era } from "@content/schema";

type Props = { eras: readonly Pick<Era, "id" | "image" | "alt">[] };

/**
 * Seven era illustrations stacked in the sticky backdrop (PRD §4.2). Which
 * one shows is CSS reading data-era on the section; the focus pull lives in
 * globals.css. The stack is decorative here: each entry's own card header
 * carries the illustration's alt text where it is content.
 */
export function EraBackdrop({ eras }: Props) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {eras.map((era) => (
        <div key={era.id} className="era-layer" data-era-id={era.id}>
          <Image
            src={era.image}
            alt=""
            fill
            sizes="100vw"
            fetchPriority="low"
          />
        </div>
      ))}
      <div className="era-scrim" />
    </div>
  );
}
