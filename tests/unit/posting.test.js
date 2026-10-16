import { describe, expect, it } from "vitest";
import { jobs } from "../../src/jobs.js";
import { sections } from "../../src/sections.js";
import { applyHref, applyOptions, bullet, pad } from "../../src/posting.js";

describe("posting helpers", () => {
  it("drops trailing list punctuation only", () => {
    expect(bullet("İstanbul'da ikamet eden,")).toBe("İstanbul'da ikamet eden");
    expect(bullet("Git kullanımı.")).toBe("Git kullanımı");
    expect(bullet("v1.0 sürümü")).toBe("v1.0 sürümü");
  });

  it("encodes the subject of the application mail", () => {
    expect(applyHref({ email: "info@kayra.technology", subject: "Başvuru: X" }))
      .toBe("mailto:info@kayra.technology?subject=Ba%C5%9Fvuru%3A%20X");
  });

  it("offers webmail compose links with recipient and subject prefilled", () => {
    const apply = { email: "info@kayra.technology", subject: "Başvuru: X" };
    const links = Object.fromEntries(applyOptions(apply).map((o) => [o.id, o.href]));
    const gmail = new URL(links.gmail);
    expect(gmail.origin).toBe("https://mail.google.com");
    expect(gmail.searchParams.get("view")).toBe("cm");
    expect(gmail.searchParams.get("to")).toBe("info@kayra.technology");
    expect(gmail.searchParams.get("su")).toBe("Başvuru: X");
    const outlook = new URL(links.outlook);
    expect(outlook.origin + outlook.pathname).toBe("https://outlook.live.com/mail/0/deeplink/compose");
    expect(outlook.searchParams.get("to")).toBe("info@kayra.technology");
    expect(outlook.searchParams.get("subject")).toBe("Başvuru: X");
    expect(links.app).toBe(applyHref(apply));
  });

  it("pads indexes to two digits", () => {
    expect(pad(1)).toBe("01");
    expect(pad(12)).toBe("12");
  });
});

describe("content", () => {
  it("has the rocket instructor posting with complete fields", () => {
    expect(jobs).toHaveLength(1);
    const [job] = jobs;
    expect(job.title).toBe("Roket Sistemleri Eğitmeni");
    expect(job.meta).toHaveLength(4);
    expect(job.skills).toHaveLength(4);
    for (const [, items] of job.skills) expect(items.length).toBeGreaterThan(0);
    expect(job.apply.email).toMatch(/@kayra\.technology$/);
  });

  it("links the same three sections as the corporate and education sites", () => {
    expect(sections.map((s) => [s.label, s.href])).toEqual([["Ar-Ge", "/"], ["Eğitim", "/egitim"], ["Kariyer", "/kariyer"]]);
  });
});
