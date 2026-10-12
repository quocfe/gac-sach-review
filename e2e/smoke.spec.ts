import { test, expect } from '@playwright/test';
test('visitor can discover a book and open its page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /những cuốn sách/i })).toBeVisible();
  await page.getByRole('link', { name: /Dế Mèn Phiêu Lưu Ký/i }).first().click();
  await expect(page.getByRole('heading', { name: /Dế Mèn Phiêu Lưu Ký/i })).toBeVisible();
});
test('catalog filters persist in a direct URL reload', async ({ page }) => {
  await page.goto('/discover?genre=V%C4%83n%20h%E1%BB%8Dc%20Vi%E1%BB%87t%20Nam');
  await expect(page.getByLabel('Thể loại')).toHaveValue('Văn học Việt Nam');
  await page.reload();
  await expect(page.getByLabel('Thể loại')).toHaveValue('Văn học Việt Nam');
});
