export type PayrollStatus = 'OPEN' | 'APPROVED' | 'PAID' | 'LOCKED';

export type MockPayrollHourRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  serviceDate: string;
  clientName: string;
  hoursWorked: number;
  payRateSnapshot: number;
  payrollStatus: PayrollStatus;
};

export type PayrollVisitLine = MockPayrollHourRecord & {
  estimatedPay: number;
};

export type PayrollEmployeeGroup = {
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  totalHours: number;
  payRate: number;
  estimatedPay: number;
  payrollStatus: PayrollStatus;
  records: PayrollVisitLine[];
};

export type PayrollTotals = {
  employeeCount: number;
  totalHours: number;
  estimatedPay: number;
  serviceCount: number;
};

export type PayrollGroupedResult = {
  employeeGroups: PayrollEmployeeGroup[];
  totals: PayrollTotals;
};
