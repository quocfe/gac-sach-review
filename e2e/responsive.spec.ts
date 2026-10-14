import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

for (const width of [320, 768]) {
  test(`narrow and tablet layouts contain their content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/discover",
      "/books/atomic-habits",
      "/books/de-men-phieu-luu-ky/review",
      "/admin",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
  });
}
const routes = [
  ["home", "/"],
  ["catalog", "/discover"],
  ["book", "/books/de-men-phieu-luu-ky"],
  ["composer", "/books/de-men-phieu-luu-ky/review"],
  ["shelf", "/me/bookshelf"],
  ["admin", "/admin"],
  ["moderation", "/admin/moderation"],
  ["author", "/authors/to-hoai"],
] as const;
for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`critical routes are readable and error-free at ${viewport.name}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize(viewport);
    await mkdir("reports/ux", { recursive: true });
    for (const [name, route] of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} has no horizontal overflow`,
      ).toBe(true);
      await expect(page.locator("#main-content")).toBeVisible();
      await page.screenshot({
        path: `reports/ux/${name}-${viewport.name}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}
