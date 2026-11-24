import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("first screen shows name, status and CV", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Raihan Aditito Bagastama" }),
    ).toBeVisible();
    await expect(page.getByText("Open to opportunities").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /CV/ }).first()).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });

  test("clock renders Nanjing time", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/\d{2}:\d{2}:\d{2} · Nanjing/)).toBeVisible();
  });

  test("copy email button gives feedback", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permission is Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const button = page.getByRole("button", { name: /copy email/i });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(page.getByRole("button", { name: /copied/i })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "raihanaditito@gmail.com",
    );
  });

  test("palette is applied before paint", async ({ page }) => {
    await page.goto("/");
    const palette = await page.evaluate(() => document.documentElement.dataset.palette);
    expect(["morning", "lab", "evening", "night"]).toContain(palette);
  });
});

test("CV link redirects to the PDF", async ({ request }) => {
  const res = await request.get("/cv", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toContain("/CV_Raihan_Aditito_Bagastama.pdf");
});

test("work archive filters by category", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1, name: "All projects" })).toBeVisible();
  await page.getByRole("button", { name: /^Mobile/ }).click();
  await expect(page.getByRole("heading", { name: /Lifty/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /NexaOrder/ })).toHaveCount(0);
});

test("case study renders and links to the next project", async ({ page }) => {
  await page.goto("/work/kawalbijak");
  await expect(page.getByRole("heading", { level: 1, name: "KawalBijak" })).toBeVisible();
  for (const section of ["Problem", "My role", "Architecture", "Results"]) {
    await expect(page.getByRole("heading", { level: 2, name: section })).toBeVisible();
  }
  await expect(page.getByRole("link", { name: /Next project/ })).toHaveAttribute(
    "href",
    "/work/lifty",
  );
});

test("unknown page shows the custom 404", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("0 rows returned")).toBeVisible();
});
