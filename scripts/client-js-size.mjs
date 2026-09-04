// PRD §10: first-party JavaScript on "/" must stay at or under the budget, gzipped.
// Next.js 16 no longer prints bundle sizes, so this reads the prerendered HTML
// and sums every first-party <script src>. The legacy noModule polyfill is
// skipped because modern browsers never download it.
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const DEFAULT_BUDGET_KB = 200;
const budgetArg = process.argv.find((a) => a.startsWith("--budget="));
const budgetKb = budgetArg
  ? Number(budgetArg.split("=")[1])
  : DEFAULT_BUDGET_KB;

const htmlPath = join(process.cwd(), ".next/server/app/index.html");
let html;
try {
  html = readFileSync(htmlPath, "utf8");
} catch {
  console.error(
    `client-js-size: ${htmlPath} not found. Run "pnpm build" first.`,
  );
  process.exit(2);
}

const scripts = [...html.matchAll(/<script\b([^>]*)>/g)]
  .map((m) => m[1])
  .filter((attrs) => !/\bnomodule\b/i.test(attrs))
  .map((attrs) => /\bsrc="([^"]+)"/.exec(attrs)?.[1])
  .filter((src) => src?.startsWith("/_next/static/"));

let total = 0;
const rows = [];
for (const src of new Set(scripts)) {
  const file = join(
    process.cwd(),
    ".next",
    src.replace(/^\/_next\//, "").split("?")[0],
  );
  statSync(file);
  const gz = gzipSync(readFileSync(file)).length;
  total += gz;
  rows.push([src.replace("/_next/static/", ""), gz]);
}

rows.sort((a, b) => b[1] - a[1]);
for (const [name, gz] of rows)
  console.log(`${(gz / 1024).toFixed(1).padStart(7)} KB  ${name}`);
const totalKb = total / 1024;
console.log(
  `\nclient-js-size: ${totalKb.toFixed(1)} KB gzipped across ${rows.length} scripts (budget ${budgetKb} KB)`,
);

if (totalKb > budgetKb) {
  console.error(
    `client-js-size: over budget by ${(totalKb - budgetKb).toFixed(1)} KB`,
  );
  process.exit(1);
}
