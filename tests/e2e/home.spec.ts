import { expect, test } from '@playwright/test';

test('shows the CleanOps foundation page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /base operativa/i })).toBeVisible();
  await expect(page.getByText('Clientes')).toBeVisible();
});
