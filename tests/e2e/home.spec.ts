import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function openApp(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Hoy' })).toBeVisible();
  await page.waitForTimeout(1000);
}

test('shows the Today page with mock visits grouped by status', async ({ page }) => {
  await openApp(page);

  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();
  await expect(page.getByText('Praxis Limmatblick')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pendientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Realizados' })).toBeVisible();
});

test('registers quick hours for a completed mock visit', async ({ page }) => {
  await openApp(page);

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
  await openApp(page);

  await page.getByRole('button', { name: 'Pendiente de facturar' }).click();

  await expect(page.getByRole('heading', { name: 'Pendiente de facturar' })).toBeVisible();
  await expect(page.getByText('Primera quincena')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Praxis Limmatblick' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Helvetia Treuhand AG' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generar resumen' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Enviar a bexio/ }).first()).toBeDisabled();
});

test('shows payroll hours grouped by employee', async ({ page }) => {
  await openApp(page);

  await page.getByRole('button', { name: 'Horas para nómina' }).click();

  await expect(page.getByRole('heading', { name: 'Horas para nómina' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ana Medina' })).toBeVisible();
  await expect(page.getByText('Horas trabajadas')).toBeVisible();
  await expect(page.getByText('11.5')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Exportar Excel' }).first()).toBeVisible();
});

test('shows clients and weekly schedule screens', async ({ page }) => {
  await openApp(page);

  await page.getByRole('button', { name: 'Clientes' }).click();
  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Praxis Limmatblick' }).first()).toBeVisible();
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

test('creates a mock client with a biweekly Monday service plan', async ({ page }) => {
  await openApp(page);

  await page.getByRole('button', { name: 'Clientes' }).click();
  await page.getByRole('button', { name: 'Nuevo cliente' }).click();
  await page.getByLabel('Nombre').fill('Clinica Nueva Norte');
  await page.getByLabel('Tipo').fill('Empresa');
  await page.getByLabel('Email').fill('nueva@norte.test');
  await page.getByLabel('Teléfono').fill('+41 44 555 77 88');
  await page.getByLabel('Ciudad').fill('Zürich');
  await page.getByLabel('País').fill('CH');
  await page.getByLabel('Idioma').fill('ES');
  await page.getByRole('button', { name: 'Guardar cliente' }).click();

  await expect(page.getByRole('heading', { name: 'Clinica Nueva Norte' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Nuevo plan' }).click();
  await page.getByLabel('Frecuencia').selectOption('BIWEEKLY');
  await page.getByRole('button', { name: 'Lunes' }).click();
  await page.getByLabel('Fecha base de recurrencia').fill('2026-06-15');
  await page.getByLabel('Hora estimada').fill('08:30');
  await page.getByLabel('Horas normales').fill('4');
  await page.getByLabel('Personas normales').fill('2');
  await page.getByLabel('Tarifa por hora').fill('60');
  await page.getByRole('spinbutton', { name: 'IVA' }).fill('8.1');
  await page.getByRole('button', { name: 'Guardar plan' }).click();

  await page.getByRole('button', { name: 'Agenda semanal' }).click();
  await expect(page.getByRole('heading', { name: 'Agenda semanal' })).toBeVisible();
  await expect(page.getByText('Clinica Nueva Norte').first()).toBeVisible();
  await expect(page.getByText('Quincenal').first()).toBeVisible();
  await expect(page.getByText('08:30').first()).toBeVisible();
});
