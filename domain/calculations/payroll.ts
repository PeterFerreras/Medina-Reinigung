const positiveOrZero = (value: number): number => Math.max(value, 0);

export function calculateEmployeePay(
  hoursWorked: number,
  payRate: number,
): number {
  return positiveOrZero(hoursWorked) * positiveOrZero(payRate);
}
