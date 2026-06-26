const positiveOrZero = (value: number): number => Math.max(value, 0);

export function calculateBillableHours(employeeHours: number[]): number {
  return employeeHours.reduce((total, hours) => {
    if (hours <= 0) {
      return total;
    }

    return total + hours;
  }, 0);
}

export function calculateSubtotal(
  billableHours: number,
  clientHourlyRate: number,
): number {
  return positiveOrZero(billableHours) * positiveOrZero(clientHourlyRate);
}

export function calculateVat(subtotal: number, vatRate: number): number {
  return (positiveOrZero(subtotal) * positiveOrZero(vatRate)) / 100;
}

export function calculateTotal(subtotal: number, vatAmount: number): number {
  return positiveOrZero(subtotal) + positiveOrZero(vatAmount);
}
