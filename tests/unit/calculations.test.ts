import { describe, expect, it } from 'vitest';

import {
  calculateBillableHours,
  calculateEmployeePay,
  calculateSubtotal,
  calculateTotal,
  calculateVat,
  calculateVisitTotals,
} from '../../domain/calculations';

describe('calculations', () => {
  it('calculates billable hours for 1 employee with 3 hours', () => {
    expect(calculateBillableHours([3])).toBe(3);
  });

  it('calculates billable hours for 2 employees with 3 hours each', () => {
    expect(calculateBillableHours([3, 3])).toBe(6);
  });

  it('supports decimal hours', () => {
    expect(calculateBillableHours([1.5, 2.25])).toBe(3.75);
  });

  it('ignores negative hours', () => {
    expect(calculateBillableHours([3, -2, 0, 1])).toBe(4);
  });

  it('calculates subtotal correctly', () => {
    expect(calculateSubtotal(6, 45)).toBe(270);
  });

  it('calculates VAT at 8.1%', () => {
    expect(calculateVat(100, 8.1)).toBeCloseTo(8.1);
  });

  it('calculates total correctly', () => {
    expect(calculateTotal(100, 8.1)).toBeCloseTo(108.1);
  });

  it('calculates employee pay', () => {
    expect(calculateEmployeePay(3.5, 25)).toBe(87.5);
  });

  it('calculates a COMPLETED visit', () => {
    expect(
      calculateVisitTotals({
        visitStatus: 'COMPLETED',
        employeeHours: [3, 3],
        clientHourlyRate: 50,
        vatRate: 8.1,
      }),
    ).toEqual({
      employeeHoursTotal: 6,
      billableHours: 6,
      subtotal: 300,
      vatAmount: 24.3,
      total: 324.3,
    });
  });

  it('sets billing totals to 0 for a CANCELLED visit', () => {
    expect(
      calculateVisitTotals({
        visitStatus: 'CANCELLED',
        employeeHours: [3],
        clientHourlyRate: 50,
        vatRate: 8.1,
      }),
    ).toEqual({
      employeeHoursTotal: 3,
      billableHours: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
    });
  });

  it('keeps worked hours but does not bill a NO_BILLABLE visit', () => {
    expect(
      calculateVisitTotals({
        visitStatus: 'NO_BILLABLE',
        employeeHours: [2.5, 1.5],
        clientHourlyRate: 50,
        vatRate: 8.1,
      }),
    ).toEqual({
      employeeHoursTotal: 4,
      billableHours: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
    });
  });

  it('does not bill a SCHEDULED visit', () => {
    expect(
      calculateVisitTotals({
        visitStatus: 'SCHEDULED',
        employeeHours: [3],
        clientHourlyRate: 50,
        vatRate: 8.1,
      }),
    ).toEqual({
      employeeHoursTotal: 3,
      billableHours: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
    });
  });
});
