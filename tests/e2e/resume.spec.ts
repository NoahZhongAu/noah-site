import { expect, test } from "@playwright/test";

test("/resume redirects permanently to the PDF", async ({ request }) => {
  const redirect = await request.get("/resume", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers()["location"]).toContain(
    "/resume/noah-zhong-resume.pdf",
  );

  const pdf = await request.get("/resume");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString("latin1")).toBe("%PDF-");
});
