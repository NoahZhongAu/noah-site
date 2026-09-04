import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { resume } from "../../content/index";

const { eyebrow, headline } = resume.person;
const video = /\/hero\/hero\.(webm|mp4)$/;
const sections = ["story", "projects", "skills", "contact"];

function recordVideoRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (video.test(new URL(request.url()).pathname)) urls.push(request.url());
  });
  return urls;
}

function topOf(page: Page, id: string) {
  return page.evaluate(
    (id) => document.getElementById(id)?.getBoundingClientRect().top ?? NaN,
    id,
  );
}

/** True once the section is at the top, or fully on screen with the page scrolled as far as it goes. */
function landedOn(page: Page, id: string) {
  return page.evaluate((id) => {
    const top = document.getElementById(id)?.getBoundingClientRect().top ?? NaN;
    const atEnd =
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight;
    return top < 2 || (atEnd && top >= 0 && top < window.innerHeight);
  }, id);
}

/** Computed opacity and transform of each fade-rise item; polled, because without JS or reduced motion the CSS animation still has to finish. */
function fadeRiseStyles(page: Page) {
  return page.locator(".fade-rise").evaluateAll((items) =>
    items.map((item) => {
      const style = getComputedStyle(item);
      // A finished translateY(0) computes to the identity matrix, which is the same thing as none.
      const identity = "matrix(1, 0, 0, 1, 0, 0)";
      return {
        opacity: style.opacity,
        transform: style.transform === identity ? "none" : style.transform,
      };
    }),
  );
}
// The eyebrow and the buttons; the headline and bio never rise (ADR 0004).
const fadeRiseFinished = [1, 2].map(() => ({
  opacity: "1",
  transform: "none",
}));

/** The LCP text must be painted on the first frame: full opacity, no animation, no fade-rise ancestor. */
function lcpTextPaintsAtOnce(page: Page) {
  return page.evaluate(() =>
    ["h1", "#top h1 + p"].map((selector) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        opacity: style.opacity,
        animation: style.animationName,
        rises: el.closest(".fade-rise") !== null,
      };
    }),
  );
}
const paintedAtOnce = [1, 2].map(() => ({
  opacity: "1",
  animation: "none",
  rises: false,
}));

async function isPaused(page: Page) {
  return page
    .locator("#top video")
    .evaluate((el) => (el as HTMLVideoElement).paused);
}

test.describe("desktop", () => {
  test("renders the cover from content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(headline.replaceAll("*", ""));
    // The scramble ends on the exact string with no hidden twin left behind.
    const eyebrowLine = page.locator("#top p").first();
    await expect(eyebrowLine).toHaveText(eyebrow);
    await expect(eyebrowLine.locator("[aria-hidden]")).toHaveCount(0);
  });

  test("headline and bio are visible on the first frame", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Checked immediately, not polled: a value that is only right later is the bug.
    expect(await lcpTextPaintsAtOnce(page)).toEqual(paintedAtOnce);
  });

  test("Know more scrolls to the story", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Know more" }).click();
    await expect.poll(() => topOf(page, "story")).toBeLessThan(2);
    expect(new URL(page.url()).hash).toBe("#story");
  });

  test("every nav anchor lands on its section", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Site" });
    for (const id of sections) {
      const label = id.charAt(0).toUpperCase() + id.slice(1);
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect.poll(() => landedOn(page, id)).toBe(true);
      expect(new URL(page.url()).hash).toBe(`#${id}`);
    }
  });

  test("video attaches, then pauses off-screen and when the tab hides", async ({
    page,
  }) => {
    const requests = recordVideoRequests(page);
    await page.goto("/");
    await expect.poll(() => requests.length).toBeGreaterThan(0);
    await expect.poll(() => isPaused(page)).toBe(false);

    await page.evaluate(() =>
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "instant" }),
    );
    await expect.poll(() => isPaused(page)).toBe(true);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => isPaused(page)).toBe(false);

    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect.poll(() => isPaused(page)).toBe(true);
  });

  for (const width of [320, 2560]) {
    test(`fills the viewport with no horizontal scroll at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        cover:
          document.getElementById("top")?.getBoundingClientRect().height ?? 0,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.cover).toBeGreaterThanOrEqual(metrics.innerHeight - 1);
    });
  }
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("requests no video", async ({ page }) => {
    const requests = recordVideoRequests(page);
    await page.goto("/", { waitUntil: "networkidle" });
    expect(requests).toEqual([]);
    await expect(page.locator("#top video")).toHaveCount(0);
  });

  test("hamburger is keyboard operable and the open menu passes axe", async ({
    page,
  }) => {
    await page.goto("/");
    // Located by role alone because its accessible name flips to "Close menu" once open.
    const toggle = page
      .getByRole("navigation", { name: "Site" })
      .getByRole("button");
    await expect(toggle).toHaveAccessibleName("Open menu");
    // Skip link, logo, then the hamburger: the pill and desktop download are display:none here.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Story", exact: true }),
    ).toBeFocused();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();

    // A real tap as well: the poster layer beneath must never intercept it.
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("Save-Data", () => {
  test("requests no video", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true },
      });
    });
    const requests = recordVideoRequests(page);
    await page.goto("/", { waitUntil: "networkidle" });
    expect(requests).toEqual([]);
    await expect(page.locator("#top video")).toHaveCount(0);
  });
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the poster and every line of copy at its final state", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#top video")).toHaveCount(0);
    await expect(page.locator("#top img").first()).toBeVisible();
    await expect(page.locator("#top p").first()).toHaveText(eyebrow);
    await expect(page.locator("h1")).toBeVisible();
    const cover = page.locator("#top");
    await expect(cover.getByRole("link", { name: "Know more" })).toBeVisible();
    // The nav's and the hero's; the mobile menu's copy is display:none at this width.
    await expect(
      cover.getByRole("link", { name: "Download résumé" }),
    ).toHaveCount(2);

    await expect.poll(() => fadeRiseStyles(page)).toEqual(fadeRiseFinished);
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("requests no video", async ({ page }) => {
    const requests = recordVideoRequests(page);
    await page.goto("/", { waitUntil: "networkidle" });
    expect(requests).toEqual([]);
  });

  test("shows the finished state with no scramble or fade-rise", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const eyebrowLine = page.locator("#top p").first();
    await expect(eyebrowLine).toHaveText(eyebrow);
    await expect(eyebrowLine.locator("[aria-hidden]")).toHaveCount(0);

    await expect.poll(() => fadeRiseStyles(page)).toEqual(fadeRiseFinished);
  });
});
