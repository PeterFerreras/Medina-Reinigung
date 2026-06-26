import {
  calculateBillableHours,
  calculateSubtotal,
  calculateTotal,
  calculateVat,
} from './billing';

export type VisitCalculationStatus =
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_BILLABLE'
  | 'SCHEDULED'
  | 'RESCHEDULED'
  | 'NEEDS_REVIEW';

export type CalculateVisitTotalsInput = {
  visitStatus: VisitCalculationStatus;
  employeeHours: number[];
  clientHourlyRate: number;
  vatRate: number;
};

export type VisitTotals = {
  employeeHoursTotal: number;
  billableHours: number;
  subtotal: number;
  vatAmount: number;
  total: number;
};

const zeroBillingTotals = (employeeHoursTotal: number): VisitTotals => ({
  employeeHoursTotal,
  billableHours: 0,
  subtotal: 0,
  vatAmount: 0,
  total: 0,
});

export function calculateVisitTotals(
  input: CalculateVisitTotalsInput,
): VisitTotals {
  const employeeHoursTotal = calculateBillableHours(input.employeeHours);

  if (input.visitStatus !== 'COMPLETED') {
    return zeroBillingTotals(employeeHoursTotal);
  }

  const billableHours = employeeHoursTotal;
  const subtotal = calculateSubtotal(billableHours, input.clientHourlyRate);
  const vatAmount = calculateVat(subtotal, input.vatRate);
  const total = calculateTotal(subtotal, vatAmount);

  return {
    employeeHoursTotal,
    billableHours,
    subtotal,
    vatAmount,
    total,
  };
}
