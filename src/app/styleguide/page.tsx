import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colours = [
  "--bg",
  "--fg",
  "--fg-80",
  "--fg-62",
  "--line",
  "--line-soft",
  "--glass",
];

const values = [
  "--dur-fast",
  "--dur-base",
  "--dur-slow",
  "--dur-draw",
  "--dur-era",
  "--ease-out",
  "--radius-input",
  "--radius-card",
  "--radius-pill",
  "--space-section",
  "--gutter",
];

/** Parses tokens.css at render time so the guide shows real values without restating them. */
function readTokens(): Map<string, string> {
  const css = readFileSync(
    join(process.cwd(), "src/styles/tokens.css"),
    "utf8",
  );
  const tokens = new Map<string, string>();
  for (const match of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    const [, name, value] = match;
    if (name !== undefined && value !== undefined && !tokens.has(name)) {
      tokens.set(name, value.replace(/\s+/g, " ").trim());
    }
  }
  return tokens;
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-line-soft py-12">
      <h2 className="text-mono-label text-fg-62">{title}</h2>
      {children}
    </section>
  );
}

// Development only (PRD §3). notFound() at build time makes the route a 404 in production.
export default function Styleguide() {
  if (process.env.NODE_ENV === "production") notFound();
  const tokens = readTokens();

  return (
    <div className="mx-auto max-w-5xl px-gutter py-section">
      <h1 className="text-section mb-12">Styleguide</h1>

      <Block title="Colour tokens">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {colours.map((name) => (
            <li key={name} className="grid gap-2">
              <span
                className="block aspect-video rounded-card border border-line"
                style={{ background: `var(${name})` }}
              />
              <code className="text-mono-tight">{name}</code>
              <span className="text-mono-tight text-fg-62">
                {tokens.get(name)}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Motion, radius and rhythm tokens">
        <ul className="grid gap-2 md:grid-cols-2">
          {values.map((name) => (
            <li
              key={name}
              className="flex items-baseline gap-4 border-b border-line-soft py-2"
            >
              <code className="text-mono-tight w-40 shrink-0">{name}</code>
              <span className="text-mono-tight text-fg-62">
                {tokens.get(name)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-fg-62">
          Spacing is Tailwind&rsquo;s 4px scale. Section rhythm is 96px on
          mobile and 160px from 768px, exposed as{" "}
          <code className="text-mono-tight">py-section</code>.
        </p>
      </Block>

      <Block title="Type scale">
        <p className="text-headline">Headline serif</p>
        <p className="text-section">Section title</p>
        <p className="max-w-measure">
          Body copy at clamp(17px, 1.15vw, 20px). The site organises its colour
          as white on the one background, and the programme of motion is fixed
          in the PRD.
        </p>
        <p className="text-mono-label">Mono label, wide tracking</p>
        <p className="text-mono-tight">Mono label, tight tracking</p>
        <p className="font-display italic text-section">Italic display</p>
      </Block>

      <Block title="Focus ring">
        <p className="text-fg-62">
          Tab to the link. The ring is the only focus treatment on the site.
        </p>
        <p>
          <a
            href="#main"
            className="text-mono-tight underline underline-offset-4"
          >
            Focusable link
          </a>
        </p>
      </Block>

      <Block title="Background">
        <p className="text-fg-62">
          The wash and grain behind this page are the two fixed layers from{" "}
          <code className="text-mono-tight">BackgroundLayers</code>. Every
          section sits on them.
        </p>
      </Block>

      <Block title="Reduced motion">
        <p className="text-fg-62">
          With{" "}
          <code className="text-mono-tight">
            prefers-reduced-motion: reduce
          </code>{" "}
          every transition and animation resolves to its finished state. Later
          milestones add their primitives to this page as they land.
        </p>
      </Block>
    </div>
  );
}
