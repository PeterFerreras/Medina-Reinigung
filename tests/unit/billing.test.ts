import { describe, expect, it } from 'vitest';

import { groupPendingBilling } from '../../domain/billing/group-pending-billing';
import type { MockPendingBillingVisit } from '../../domain/billing/types';

const baseVisit: MockPendingBillingVisit = {
  id: 'visit-1',
  clientId: 'client-a',
  clientName: 'Client A',
  serviceDate: '2026-06-01',
  description: 'Cleaning',
  employeeNames: ['Ana Medina'],
  peopleCount: 1,
  billableHours: 3,
  clientHourlyRate: 50,
  vatRate: 8.1,
  visitStatus: 'COMPLETED',
  invoiceStatus: 'NOT_INVOICED',
};

describe('groupPendingBilling', () => {
  it('groups two visits from the same client', () => {
    const result = groupPendingBilling([
      baseVisit,
      { ...baseVisit, id: 'visit-2', billableHours: 2 },
    ]);

    expect(result.clientGroups).toHaveLength(1);
    expect(result.clientGroups[0].serviceCount).toBe(2);
  });

  it('separates visits from different clients', () => {
    const result = groupPendingBilling([
      baseVisit,
      { ...baseVisit, id: 'visit-2', clientId: 'client-b', clientName: 'Client B' },
    ]);

    expect(result.clientGroups).toHaveLength(2);
  });

  it('calculates total hours', () => {
    const result = groupPendingBilling([
      baseVisit,
      { ...baseVisit, id: 'visit-2', billableHours: 2 },
    ]);

    expect(result.totals.totalHours).toBe(5);
  });

  it('calculates subtotal, VAT and total', () => {
    const result = groupPendingBilling([baseVisit]);

    expect(result.totals.subtotal).toBe(150);
    expect(result.totals.vatAmount).toBeCloseTo(12.15);
    expect(result.totals.total).toBeCloseTo(162.15);
  });

  it('ignores cancelled visits', () => {
    const result = groupPendingBilling([
      baseVisit,
      { ...baseVisit, id: 'visit-cancelled', visitStatus: 'CANCELLED' },
    ]);

    expect(result.clientGroups[0].serviceCount).toBe(1);
    expect(result.totals.totalHours).toBe(3);
  });

  it('ignores already invoiced visits', () => {
    const result = groupPendingBilling([
      baseVisit,
      { ...baseVisit, id: 'visit-invoiced', invoiceStatus: 'INVOICED' },
    ]);

    expect(result.clientGroups[0].serviceCount).toBe(1);
    expect(result.totals.totalHours).toBe(3);
  });
});
