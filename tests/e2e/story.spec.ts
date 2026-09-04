import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { resume } from "../../content/index";

const total = resume.entries.length;
const eraImage = /\/eras\/era-\d\.jpg/;
const pad = (n: number) => String(n).padStart(2, "0");

function recordEraRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (eraImage.test(decodeURIComponent(request.url()))) {
      urls.push(request.url());
    }
  });
  return urls;
}

/** Scrolls step N (1-based) to the top the way a snap would leave it. */
function goToStep(page: Page, n: number) {
  return page.evaluate((n) => {
    document
      .querySelectorAll("#story .story-step")
      [n - 1]?.scrollIntoView({ behavior: "instant" });
  }, n);
}

function storyState(page: Page) {
  return page.evaluate(() => {
    const story = document.getElementById("story");
    const dots = [...document.querySelectorAll(".story-dot")];
    return {
      era: story?.dataset.era,
      step: story?.dataset.step,
      snap: document.documentElement.hasAttribute("data-snap"),
      counter: document.querySelector(".story-counter")?.textContent,
      activeDot: dots.findIndex((dot) => dot.hasAttribute("data-active")) + 1,
      running: document
        .querySelector("#story canvas")
        ?.getAttribute("data-running"),
    };
  });
}

/** Computed opacity and blur of each step's title, the second child of its card. */
function titleStyles(page: Page) {
  return page.locator("#story .story-card > h3").evaluateAll((titles) =>
    titles.map((title) => {
      const style = getComputedStyle(title);
      // A finished blur(0) is the same thing as none.
      const filter = style.filter === "blur(0px)" ? "none" : style.filter;
      return { opacity: style.opacity, filter };
    }),
  );
}

const finished = { opacity: "1", filter: "none" };

function layerFilters(page: Page) {
  return page
    .locator(".era-layer")
    .evaluateAll((layers) => layers.map((l) => getComputedStyle(l).filter));
}

test.describe("desktop", () => {
  test("is seven screens tall with a sticky backdrop and seven layers", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      height: document.getElementById("story")?.getBoundingClientRect().height,
      viewport: window.innerHeight,
      sticky: [...document.querySelectorAll("#story *")].filter(
        (el) => getComputedStyle(el).position === "sticky",
      ).length,
      layers: document.querySelectorAll(".era-layer").length,
      h2: document.querySelector("#story h2")?.textContent,
    }));
    expect(metrics.height).toBeGreaterThanOrEqual(
      total * (metrics.viewport - 1),
    );
    expect(metrics.sticky).toBeGreaterThanOrEqual(1);
    expect(metrics.layers).toBe(total);
    expect(metrics.h2).toBe("Story");
  });

  test("each step sets its era, counter and rail dot, and snap is on only inside the story", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect((await storyState(page)).snap).toBe(false);

    for (let n = 1; n <= total; n += 1) {
      await goToStep(page, n);
      await expect
        .poll(() => storyState(page))
        .toMatchObject({
          era: String(n),
          step: String(n),
          snap: true,
          counter: `${pad(n)} / ${pad(total)}`,
          activeDot: n,
        });
    }

    await page.evaluate(() =>
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "instant" }),
    );
    await expect.poll(() => storyState(page).then((s) => s.snap)).toBe(false);
  });

  test("entry text focuses in once and stays", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Step 1 is shown from the server; the rest are hidden until reached.
    const initial = await titleStyles(page);
    expect(initial[0]).toEqual(finished);
    expect(initial[1]?.opacity).toBe("0");

    await goToStep(page, 3);
    await expect
      .poll(() => titleStyles(page).then((s) => s[2]))
      .toEqual(finished);
    // Step 2 was skipped, step 3 is shown, step 1 is still shown.
    const after = await titleStyles(page);
    expect(after[0]).toEqual(finished);
    expect(after[1]?.opacity).toBe("0");

    await goToStep(page, 1);
    await page.waitForTimeout(100);
    expect((await titleStyles(page))[2]).toEqual(finished);
  });

  test("the active layer is sharp and the others are blurred", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await goToStep(page, 2);
    await expect
      .poll(() => layerFilters(page).then((f) => f[1]))
      .toBe("blur(0px) brightness(1)");
    const filters = await layerFilters(page);
    expect(filters[0]).toContain("blur(18px)");
    expect(filters[2]).toContain("blur(18px)");
  });

  test("fireflies run on screen and pause off screen", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await goToStep(page, 1);
    await expect
      .poll(() => storyState(page).then((s) => s.running))
      .toBe("true");
    await page.evaluate(() =>
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "instant" }),
    );
    await expect
      .poll(() => storyState(page).then((s) => s.running))
      .toBe("false");
  });

  test("passes axe mid-story", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await goToStep(page, 4);
    await expect.poll(() => storyState(page).then((s) => s.step)).toBe("4");
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("stacks cards with headers, nothing sticky, no canvas, no full-size era layer", async ({
    page,
  }) => {
    const requests = recordEraRequests(page);
    await page.goto("/", { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      sticky: [...document.querySelectorAll("#story *")].filter(
        (el) => getComputedStyle(el).position === "sticky",
      ).length,
      headers: [...document.querySelectorAll("#story .story-step img")].filter(
        (img) => (img as HTMLElement).offsetParent !== null,
      ).length,
      canvas: document.querySelectorAll("#story canvas").length,
      cards: document.querySelectorAll("#story .story-step").length,
    }));
    expect(metrics.sticky).toBe(0);
    expect(metrics.canvas).toBe(0);
    expect(metrics.cards).toBe(total);
    expect(metrics.headers).toBeGreaterThan(0);
    // Only card headers, sized for the viewport: no 1920px layer.
    expect(requests.every((url) => !/w=1920|w=2048|w=3840/.test(url))).toBe(
      true,
    );

    // The attribute may be set (a step is on screen); the CSS keeps snap off under 768px.
    await goToStep(page, 2);
    await expect.poll(() => storyState(page).then((s) => s.step)).toBe("2");
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollSnapType,
      ),
    ).toBe("none");
  });
});

test.describe("Save-Data", () => {
  test("draws no fireflies", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true },
      });
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#story canvas")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("no snap, no blur, no canvas, every step final, era still switches", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#story canvas")).toHaveCount(0);
    await goToStep(page, 3);
    await expect.poll(() => storyState(page)).toMatchObject({ era: "3" });
    expect(await layerFilters(page)).toEqual(Array(total).fill("none"));
    expect(
      (await titleStyles(page)).every(
        (s) => s.opacity === "1" && s.filter === "none",
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollSnapType,
      ),
    ).toBe("none");
  });
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows era 1 and every entry at its final state", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#story")).toHaveAttribute("data-era", "1");
    await expect(page.locator("#story .story-step")).toHaveCount(total);
    await goToStep(page, 5).catch(() => undefined);
    expect((await titleStyles(page)).every((s) => s.opacity === "1")).toBe(
      true,
    );
    await expect(page.locator("#story h3").nth(4)).toBeVisible();
  });
});
