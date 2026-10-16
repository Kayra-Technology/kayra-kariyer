import { expect, test } from "@playwright/test";

const noHorizontalOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("shows the rocket posting and applies by e-mail", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Kariyer · Roket Sistemleri Eğitmeni · Kayra");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Roket Sistemleri Eğitmeni");
  await expect(page.locator(".career-skill")).toHaveCount(4);
  await expect(page.locator(".career-meta div")).toHaveCount(4);
  await expect(page.locator(".career-apply").getByRole("button", { name: "info@kayra.technology" })).toBeVisible();
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

const subject = "Başvuru: Roket Sistemleri Eğitmeni";

test("apply menu offers Gmail, Outlook, the mail app and copying the address", async ({ page }) => {
  await page.goto("./");
  const hero = page.locator(".career-hero");
  const toggle = hero.getByRole("button", { name: "Başvur" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const gmail = new URL(await hero.getByRole("link", { name: "Gmail ile yaz" }).getAttribute("href"));
  expect(gmail.searchParams.get("to")).toBe("info@kayra.technology");
  expect(gmail.searchParams.get("su")).toBe(subject);
  await expect(hero.getByRole("link", { name: "Gmail ile yaz" })).toHaveAttribute("target", "_blank");
  const outlook = new URL(await hero.getByRole("link", { name: "Outlook ile yaz" }).getAttribute("href"));
  expect(outlook.searchParams.get("subject")).toBe(subject);
  await expect(hero.getByRole("link", { name: "Mail uygulamasıyla aç" }))
    .toHaveAttribute("href", "mailto:info@kayra.technology?subject=Ba%C5%9Fvuru%3A%20Roket%20Sistemleri%20E%C4%9Fitmeni");
  expect(await noHorizontalOverflow(page)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(hero.getByRole("link", { name: "Gmail ile yaz" })).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.locator(".career-summary").click();
  await expect(hero.getByRole("link", { name: "Gmail ile yaz" })).toBeHidden();
});

test("copying the address puts it on the clipboard and says so", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./");
  const section = page.locator(".career-apply");
  await section.getByRole("button", { name: "info@kayra.technology" }).click();
  await section.getByRole("button", { name: "Adresi kopyala" }).click();
  await expect(section.getByRole("status")).toHaveText("Adres kopyalandı.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("info@kayra.technology");
  const box = await section.locator(".apply-menu-panel").boundingBox();
  const width = await page.evaluate(() => window.innerWidth);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
});

test("phones keep the header to brand and tabs; the hero holds the apply button", async ({ page, isMobile }) => {
  test.skip(!isMobile, "header button is shown on wide screens");
  await page.goto("./");
  await expect(page.locator(".site-header .apply-menu")).toBeHidden();
  await expect(page.locator(".career-hero").getByRole("button", { name: "Başvur" })).toBeVisible();
});
