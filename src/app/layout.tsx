import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SkipLink } from "@/components/primitives/SkipLink";
import { BackgroundLayers } from "@/components/primitives/BackgroundLayers";
import { EdgeGradientDefs } from "@/components/primitives/EdgeGradientDefs";
import "@/styles/globals.css";

// Instrument Serif ships weight 400 only (PLAN §6 item 30). Do not request others.
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display-src",
});

const body = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body-src",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono-src",
});

// Placeholder until milestone 7 builds the full metadata from content.
export const metadata: Metadata = {
  title: "Noah Zhong",
  description: "Résumé site.",
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
