import Image from "next/image";

export type Layer = { id: number; image: string; alt: string };

type Props = { layers: readonly Layer[]; activeId: number };

/**
 * The illustrations stacked in the sticky backdrop: seven eras (PRD §4.2)
 * and three closing scenes (ADR 0007). The active one carries data-active
 * and the focus pull in globals.css does the rest. Decorative here: each
 * step's card header carries the illustration's alt text where it is content.
 */
export function EraBackdrop({ layers, activeId }: Props) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="era-layer"
          data-era-id={layer.id}
          data-active={layer.id === activeId ? "" : undefined}
        >
          <Image
            src={layer.image}
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
