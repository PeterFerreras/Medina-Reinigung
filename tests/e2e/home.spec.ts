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

test('shows payroll hours grouped by employee', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Horas para nómina' }).click();

  await expect(page.getByRole('heading', { name: 'Horas para nómina' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ana Medina' })).toBeVisible();
  await expect(page.getByText('Horas trabajadas')).toBeVisible();
  await expect(page.getByText('11.5')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Exportar Excel' }).first()).toBeVisible();
});

test('shows clients and weekly schedule screens', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Clientes' }).click();
  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Praxis Limmatblick' })).toBeVisible();
  await expect(page.getByText('Próxima visita').first()).toBeVisible();

  await page.getByRole('button', { name: 'Agenda semanal' }).click();
  await expect(page.getByRole('heading', { name: 'Agenda semanal' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lunes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Martes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Miércoles' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Jueves' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Viernes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sábado' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Domingo' })).toBeVisible();
  await expect(page.getByText('Helvetia Treuhand AG').first()).toBeVisible();
  await expect(page.getByText('Quincenal').first()).toBeVisible();
  await expect(page.getByText('Próxima fecha').first()).toBeVisible();
});
