import { expect, test } from "@playwright/test";

const noHorizontalOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("shows the rocket posting and applies by e-mail", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Kariyer · Roket Sistemleri Eğitmeni · Kayra");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Roket Sistemleri Eğitmeni");
  await expect(page.locator(".career-skill")).toHaveCount(4);
  await expect(page.locator(".career-meta div")).toHaveCount(4);
  const apply = page.locator(".career-apply").getByRole("link", { name: /info@kayra\.technology/ });
  await expect(apply).toHaveAttribute("href", "mailto:info@kayra.technology?subject=Ba%C5%9Fvuru%3A%20Roket%20Sistemleri%20E%C4%9Fitmeni");
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test("one header bar with the three Kayra sections, Kariyer current", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".site-header")).toHaveCount(1);
  const tabs = page.getByRole("navigation", { name: "Kayra bölümleri" });
  await expect(tabs.getByRole("link")).toHaveText(["Ar-Ge", "Eğitim", "Kariyer"]);
  await expect(tabs.getByRole("link", { name: "Ar-Ge" })).toHaveAttribute("href", "/");
  await expect(tabs.getByRole("link", { name: "Eğitim" })).toHaveAttribute("href", "/egitim");
  await expect(tabs.getByRole("link", { name: "Kariyer" })).toHaveAttribute("aria-current", "page");
  await expect(tabs).toBeVisible();
});

test("brand, fonts and emblem load from this deployment only", async ({ page, baseURL }) => {
  const self = new URL(baseURL).origin;
  const external = [];
  const failed = [];
  page.on("request", (request) => { if (new URL(request.url()).origin !== self && !request.url().startsWith("data:")) external.push(request.url()); });
  page.on("response", (response) => { if (response.status() >= 400) failed.push(response.url()); });
  await page.goto("./");
  await expect.poll(() => page.locator(".kayra-identity img").evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);
  const families = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
  expect(families).toEqual(expect.arrayContaining(["Kayra Sans", "Kayra Mono"]));
  expect(external).toEqual([]);
  expect(failed).toEqual([]);
});
