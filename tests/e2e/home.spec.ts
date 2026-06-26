import { expect, test } from '@playwright/test';

test('shows the CleanOps landing page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /base técnica/i })).toBeVisible();
});
