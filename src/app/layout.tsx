import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SkipLink } from "@/components/primitives/SkipLink";
import { BackgroundLayers } from "@/components/primitives/BackgroundLayers";
import { EdgeGradientDefs } from "@/components/primitives/EdgeGradientDefs";
import { resume } from "@content/index";
import "@/styles/globals.css";

// Every face here is preloaded with display swap, so text paints in the
// fallback on the first frame and swaps in place. Only weight 400 is
// referenced anywhere in the stylesheet; a weight that is declared but
// unused still costs an @font-face block per subset and can win the swap
// race for nothing. Instrument Serif ships 400 only (PLAN §6 item 30).
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-src",
});

const body = Inter({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-src",
});

const mono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-src",
});

// Milestone 7 completes the metadata; until then only the title and description come from content.
export const metadata: Metadata = {
  title: resume.person.name,
  description: resume.person.availability,
};

// Vercel serves both scripts from /_vercel/* on its platform only. Anywhere
// else (CI, Lighthouse, local start) they 404 and cost Best Practices points.
const onVercel = process.env.VERCEL === "1";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <SkipLink />
        <BackgroundLayers />
        <EdgeGradientDefs />
        <main id="main">{children}</main>
        {onVercel ? <Analytics /> : null}
        {onVercel ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
