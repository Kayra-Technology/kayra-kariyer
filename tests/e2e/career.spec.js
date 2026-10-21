import { expect, test } from "@playwright/test";

const noHorizontalOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const titles = ["Roket Sistemleri Eğitmeni", "İnsansız Su Altı Sistemleri Eğitmeni", "Elektronik ve PCB Atölyeleri Eğitmeni"];

test("shows all three open positions, each with its own apply button", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Kariyer · Açık pozisyonlar · Kayra");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Açık pozisyonlar");
  const postings = page.locator(".career-job");
  await expect(postings.getByRole("heading", { level: 2 })).toHaveText(titles);
  for (const posting of await postings.all()) {
    await expect(posting.getByRole("button", { name: "Başvur" })).toBeVisible();
    await expect(posting.locator(".career-summary")).toBeVisible();
  }
  await expect(page.locator(".career-apply").getByRole("button", { name: "info@kayra.technology" })).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test("the full posting opens under each position", async ({ page }) => {
  await page.goto("./");
  const pcb = page.locator(".career-job").nth(2);
  await expect(pcb.getByRole("heading", { name: "Aranan nitelikler" })).toBeHidden();
  await pcb.getByText("İlanın tamamı").click();
  await expect(pcb.getByRole("heading", { name: "Aranan nitelikler" })).toBeVisible();
  await expect(pcb.locator(".career-skill")).toHaveCount(5);
  await expect(pcb.getByText("E-posta konusu: Elektronik ve PCB Atölyeleri Eğitmeni Başvurusu")).toBeVisible();
  const rov = page.locator(".career-job").nth(1);
  await rov.getByText("İlanın tamamı").click();
  await expect(rov.locator(".career-skill")).toHaveCount(0);
  await expect(rov.getByText("MAVLink haberleşme protokolü hakkında bilgi sahibi olmak")).toBeVisible();
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

test("each apply button fills in its own posting's subject", async ({ page }) => {
  await page.goto("./");
  const subjects = ["Başvuru: Roket Sistemleri Eğitmeni", "Başvuru: İnsansız Su Altı Sistemleri Eğitmeni", "Elektronik ve PCB Atölyeleri Eğitmeni Başvurusu"];
  for (const [index, expected] of subjects.entries()) {
    const posting = page.locator(".career-job").nth(index);
    await posting.getByRole("button", { name: "Başvur" }).click();
    const gmail = new URL(await posting.getByRole("link", { name: "Gmail ile yaz" }).getAttribute("href"));
    expect(gmail.searchParams.get("to")).toBe("info@kayra.technology");
    expect(gmail.searchParams.get("su")).toBe(expected);
    await page.keyboard.press("Escape");
  }
});

const subject = "Başvuru: Roket Sistemleri Eğitmeni";

test("apply menu offers Gmail, Outlook, the mail app and copying the address", async ({ page }) => {
  await page.goto("./");
  const hero = page.locator(".career-job").first();
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
  await hero.locator(".career-summary").click();
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

test("the header holds brand and tabs only; apply buttons sit with the postings", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".site-header .apply-menu")).toHaveCount(0);
  await expect(page.locator(".career-job").first().getByRole("button", { name: "Başvur" })).toBeVisible();
});
