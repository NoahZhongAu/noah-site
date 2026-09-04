// Frame time of one era transition on a mid-range Android profile (ADR 0006).
//
//   pnpm build && pnpm frame-time
//
// Starts `next start` on its own port, opens a 1080×1920 viewport (the desktop
// layout, portrait) with Chrome DevTools CPU throttling at 4×, scrolls from
// step 1 to step 2 with fireflies running, and samples requestAnimationFrame
// deltas for the 1.1s focus pull. Prints average fps and the worst frame.
// Not a CI gate: the number goes in the milestone report. Under 50fps means
// --focus-blur drops from 18px to 10px before anything else is tried.
//
// Knobs, for finding what a low number is made of:
//   FRAME_CPU=4         CPU throttle rate (1 = none)
//   FRAME_BLUR=18       overrides --focus-blur for the run, in px
//   FRAME_FIREFLIES=on  "off" emulates Save-Data so no canvas mounts
//   FRAME_GPU=on        "off" runs headless. Headless Chromium rasterises in
//                       software, so a blur filter costs the same at 0px or
//                       18px and the page sits near 15fps whatever the CPU
//                       rate; that is not a phone profile. Headed uses the
//                       GPU compositor, which is what phones do, at 4x CPU.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";

const port = 3012;
const cpu = Number(process.env.FRAME_CPU ?? 4);
const blur = process.env.FRAME_BLUR;
const fireflies = process.env.FRAME_FIREFLIES !== "off";
const gpu = process.env.FRAME_GPU !== "off";
const server = spawn("pnpm", ["start", "--port", String(port)], {
  stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 2500));

const browser = await chromium.launch({ headless: !gpu });
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
if (!fireflies) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
}
const client = await context.newCDPSession(page);
await client.send("Emulation.setCPUThrottlingRate", { rate: cpu });

await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
if (blur) await page.addStyleTag({ content: `:root{--focus-blur:${blur}px}` });
console.log(
  `cpu ${cpu}x, blur ${blur ?? "18 (token)"}px, fireflies ${fireflies ? "on" : "off"}, gpu ${gpu ? "on" : "off"}`,
);
await page.evaluate(() =>
  document
    .querySelector("#story .story-step")
    ?.scrollIntoView({ behavior: "instant" }),
);
await page.waitForTimeout(2000);

const runs = [];
for (let run = 0; run < 3; run += 1) {
  const from = run % 2 === 0 ? 1 : 0;
  const to = from === 1 ? 2 : 1;
  await page.evaluate(
    (index) =>
      document
        .querySelectorAll("#story .story-step")
        [index]?.scrollIntoView({ behavior: "instant" }),
    from,
  );
  await page.waitForTimeout(1600);
  const sample = await page.evaluate((index) => {
    return new Promise((resolve) => {
      const deltas = [];
      let last = performance.now();
      const start = last;
      const tick = (now) => {
        deltas.push(now - last);
        last = now;
        if (now - start < 1200) requestAnimationFrame(tick);
        else resolve(deltas.slice(1));
      };
      document
        .querySelectorAll("#story .story-step")
        [index]?.scrollIntoView({ behavior: "instant" });
      requestAnimationFrame(tick);
    });
  }, to);
  const avg = sample.reduce((a, b) => a + b, 0) / sample.length;
  const worst = Math.max(...sample);
  const dropped = sample.filter((d) => d > 20).length;
  runs.push({ avg, worst, dropped, frames: sample.length });
  console.log(
    `run ${run + 1}: ${sample.length} frames, average ${(1000 / avg).toFixed(1)}fps (${avg.toFixed(1)}ms), worst ${worst.toFixed(1)}ms, ${dropped} frames over 20ms`,
  );
}
const best = runs.reduce((a, b) => (a.avg < b.avg ? a : b));
console.log(
  `\nbest run: ${(1000 / best.avg).toFixed(1)}fps average; gate is 50fps (ADR 0006)`,
);

await browser.close();
server.kill();
process.exit(0);
