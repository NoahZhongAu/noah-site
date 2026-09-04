import type { Person } from "@content/schema";
import { parseEmphasis } from "@/domain/emphasis";
import { CoverActions } from "@/components/composites/CoverActions";
import { FadeRiseItem } from "@/components/composites/FadeRiseItem";
import { HeroVideo } from "@/components/composites/HeroVideo";
import { ScrambleText } from "@/components/composites/ScrambleText";
import { SiteNav, type NavLink } from "@/components/composites/SiteNav";

type Props = {
  person: Pick<Person, "name" | "eyebrow" | "headline" | "bio">;
  navLinks: NavLink[];
};

// Fixed asset paths (PRD §12), not résumé text.
const hero = {
  poster: "/hero/hero-poster.jpg",
  sources: { mp4: "/hero/hero.mp4", webm: "/hero/hero.webm" },
};

/** PRD §4.1. Full viewport, video behind, nav in flow at the top, copy centred in the rest. */
export function Cover({ person, navLinks }: Props) {
  return (
    <section id="top" className="relative flex min-h-svh flex-col">
      <HeroVideo poster={hero.poster} sources={hero.sources} />

      <div className="relative flex flex-1 flex-col">
        <SiteNav name={person.name} links={navLinks} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center md:py-20">
          {/* Only the eyebrow and the buttons rise. The headline and bio are
              the LCP candidates on every viewport, so they paint at full
              opacity on the first frame (ADR 0004). */}
          <FadeRiseItem>
            <p className="text-mono-label mb-8">
              <ScrambleText text={person.eyebrow} />
            </p>
          </FadeRiseItem>

          <div className="flex flex-col items-center">
            <h1 className="text-headline max-w-7xl">
              {parseEmphasis(person.headline).map((segment, index) =>
                segment.emphasis ? (
                  <em key={index} className="text-fg-62 not-italic">
                    {segment.text}
                  </em>
                ) : (
                  <span key={index}>{segment.text}</span>
                ),
              )}
            </h1>
            <p className="mt-8 max-w-measure text-fg-80">{person.bio}</p>
            <FadeRiseItem order={1} className="mt-12">
              <CoverActions />
            </FadeRiseItem>
          </div>
        </div>
      </div>
    </section>
  );
}
