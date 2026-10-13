import { test, expect } from '@playwright/test';
const routes = ['/', '/discover', '/books/de-men-phieu-luu-ky', '/books/de-men-phieu-luu-ky/review', '/me/bookshelf', '/admin/moderation'];
for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 900 }]) {
  test(`critical routes render without browser errors at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.setViewportSize(viewport);
    for (const route of routes) { await page.goto(route); await expect(page.locator('main')).toBeVisible(); }
    expect(errors).toEqual([]);
  });
}
