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

  test("dark mode by default; light mode is remembered", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
    // The first theme-color meta is the one browsers use.
    const firstThemeColor = () =>
      page.evaluate(() =>
        document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
      );
    expect(await firstThemeColor()).toBe("#0c0f10");
    const toggle = page.getByRole("button", { name: "Switch to light mode" });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await firstThemeColor()).toBe("#f4f3ef");
    await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    expect(await html.getAttribute("data-palette")).toBeNull();
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

// Regression: letters used to be split per character, so phones broke the
// surname mid-word ("BAGASTA / MA").
for (const width of [320, 375, 412]) {
  test(`hero name never breaks inside a word at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const words = await page.evaluate(() =>
      [...document.querySelectorAll("h1 .word")].map((word) => ({
        text: word.textContent,
        rows: new Set([...word.querySelectorAll(".char")].map((c) => (c as HTMLElement).offsetTop))
          .size,
        right: word.getBoundingClientRect().right,
      })),
    );
    expect(words.map((w) => w.text)).toEqual(["RAIHAN", "ADITITO", "BAGASTAMA"]);
    for (const word of words) {
      expect(word.rows, `${word.text} is split across lines`).toBe(1);
      expect(word.right, `${word.text} runs off screen`).toBeLessThanOrEqual(width);
    }
  });
}

test("skip link targets the main content on every page", async ({ page }) => {
  for (const path of ["/", "/work", "/work/lifty"]) {
    await page.goto(path);
    await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#main",
    );
    await expect(page.locator("main#main")).toHaveCount(1);
  }
});

test("archive shows type, my role and posters for UII projects", async ({ page }) => {
  await page.goto("/work");
  // Filter by project type: Desktop only shows Edu-Hub.
  await page.getByRole("button", { name: /^Desktop/ }).click();
  await expect(page.getByRole("heading", { name: "Edu-Hub" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "TourEase" })).toHaveCount(0);
  await expect(page.getByText(/Desktop app \(JavaFX\) ·/)).toBeVisible();
  await expect(page.getByText("UI/UX design in Figma.")).toBeVisible();
  // Hidden on desktop with a mouse (the cursor preview replaces it), so match by attribute.
  await expect(page.locator('img[alt="Edu-Hub: visual from the project"]')).toHaveCount(1);
  // Cover strip shows the type and year.
  await expect(page.locator("main .tabular-nums .sr-only").first()).toHaveText(/^\d{4}$/);
  await page.getByRole("button", { name: "View poster" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("img", { name: "Edu-Hub poster" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("about shows the profile photo and contact lists Instagram", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Portrait of Raihan Aditito Bagastama" })).toHaveCount(
    1,
  );
  await expect(page.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "href",
    "https://instagram.com/raihan_aditito",
  );
});

test("TABULA is listed in the archive", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { name: "TABULA" })).toBeVisible();
  await expect(page.getByText(/Learn-by-teaching web app/)).toBeVisible();
});

test("awards show certificates in a viewer", async ({ request, page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /View 2 certificates: TechSprint/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("img", { name: /team labulada/ })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("img", { name: /Raihan Aditito Bagastama/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: /View certificate: Informatics Expo/ }),
  ).toBeVisible();
  const cv = await request.get("/CV_Raihan_Aditito_Bagastama.pdf");
  expect(cv.status()).toBe(200);
});

test("command palette opens with Ctrl+K and jumps to a case study", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  await page.getByRole("textbox", { name: "Search commands" }).fill("lifty");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/lifty$/);
});

test("palette can open the SQL console", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Control+k");
  await page.getByRole("textbox", { name: "Search commands" }).fill("raihan.db");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: /raihan\.db/ })).toBeVisible();
});

test("work page switches between list, index and map views", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("tab", { name: /^Index/ }).click();
  const index = page.getByRole("region", { name: "Project index" });
  await expect(index.getByRole("link", { name: /KawalBijak/ })).toBeVisible();
  await expect(page).toHaveURL(/#index$/);

  await page.getByRole("tab", { name: /^Map/ }).click();
  const map = page.getByRole("region", { name: "Project map" });
  await expect(map.getByRole("link", { name: "Lifty, case study" })).toBeVisible();
  await expect(map.getByText(/PCA over \d+ features/)).toBeVisible();

  // A project without a case study opens its row in the list view.
  await map.getByRole("button", { name: "TourEase, show details" }).click();
  await expect(page.getByRole("heading", { name: "TourEase" })).toBeVisible();
});
