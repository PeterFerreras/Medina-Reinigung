import { expect, test } from '@playwright/test';

test('shows the Today page with mock visits grouped by status', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();
  await expect(page.getByText('Praxis Limmatblick')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pendientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Realizados' })).toBeVisible();
});

test('registers quick hours for a completed mock visit', async ({ page }) => {
  await page.goto('/');

  const completedVisitCard = page.locator('article').filter({ hasText: 'Helvetia Treuhand AG' });
  await completedVisitCard.getByRole('button', { name: 'Registrar' }).click();

  await page.getByLabel(/Ana Medina/).check();
  await page.getByLabel(/Luis Keller/).check();
  await page.getByLabel('Horas para todos').fill('3');

  await expect(page.getByText('Horas facturables')).toBeVisible();
  await expect(page.getByText('Horas facturables').locator('..').getByText('6')).toBeVisible();
  await expect(page.getByText('Total cliente').locator('..').getByText('CHF 337.27')).toBeVisible();
});

test('shows pending billing grouped by client', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Pendiente de facturar' }).click();

  await expect(page.getByRole('heading', { name: 'Pendiente de facturar' })).toBeVisible();
  await expect(page.getByText('Primera quincena')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Praxis Limmatblick' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Helvetia Treuhand AG' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generar resumen' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Enviar a bexio/ }).first()).toBeDisabled();
});
