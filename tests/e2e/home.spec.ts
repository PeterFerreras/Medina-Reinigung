import { expect, test } from '@playwright/test';

test('shows the Today page with mock visits grouped by status', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();
  await expect(page.getByText('Praxis Limmatblick')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pendientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Realizados' })).toBeVisible();
});
