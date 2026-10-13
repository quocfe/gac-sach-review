import { test, expect } from '@playwright/test';
test('reader can open report choices on a published review', async ({ page }) => {
  await page.goto('/books/de-men-phieu-luu-ky');
  await page.getByRole('button', { name: 'Báo cáo review' }).click();
  await expect(page.getByRole('button', { name: 'Tiết lộ nội dung', exact: true })).toBeVisible();
});
test('moderation requires a note before transition', async ({ page }) => {
  await page.goto('/admin/moderation');
  await page.getByRole('button', { name: 'Xuất bản' }).click();
  await expect(page.getByText('Cần ghi chú moderator')).toBeVisible();
});
