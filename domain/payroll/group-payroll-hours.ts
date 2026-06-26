import { calculateEmployeePay } from '../calculations';

import type {
  MockPayrollHourRecord,
  PayrollEmployeeGroup,
  PayrollGroupedResult,
  PayrollStatus,
  PayrollVisitLine,
} from './types';

function isIncludedPayrollRecord(record: MockPayrollHourRecord): boolean {
  return record.hoursWorked > 0 && record.payrollStatus !== 'LOCKED';
}

function toPayrollVisitLine(record: MockPayrollHourRecord): PayrollVisitLine {
  return {
    ...record,
    estimatedPay: calculateEmployeePay(record.hoursWorked, record.payRateSnapshot),
  };
}

function mergePayrollStatus(
  currentStatus: PayrollStatus,
  nextStatus: PayrollStatus,
): PayrollStatus {
  return currentStatus === nextStatus ? currentStatus : 'OPEN';
}

function addLineToGroup(
  groupsByEmployeeId: Map<string, PayrollEmployeeGroup>,
  line: PayrollVisitLine,
): void {
  const currentGroup = groupsByEmployeeId.get(line.employeeId);

  if (!currentGroup) {
    groupsByEmployeeId.set(line.employeeId, {
      employeeId: line.employeeId,
      employeeName: line.employeeName,
      employeeInitials: line.employeeInitials,
      totalHours: line.hoursWorked,
      payRate: line.payRateSnapshot,
      estimatedPay: line.estimatedPay,
      payrollStatus: line.payrollStatus,
      records: [line],
    });
    return;
  }

  currentGroup.records.push(line);
  currentGroup.totalHours += line.hoursWorked;
  currentGroup.estimatedPay += line.estimatedPay;
  currentGroup.payrollStatus = mergePayrollStatus(
    currentGroup.payrollStatus,
    line.payrollStatus,
  );
}

export function groupPayrollHours(
  records: MockPayrollHourRecord[],
): PayrollGroupedResult {
  const groupsByEmployeeId = new Map<string, PayrollEmployeeGroup>();

  records.filter(isIncludedPayrollRecord).map(toPayrollVisitLine).forEach((line) => {
    addLineToGroup(groupsByEmployeeId, line);
  });

  const employeeGroups = Array.from(groupsByEmployeeId.values());
  const totals = employeeGroups.reduce(
    (currentTotals, group) => ({
      employeeCount: currentTotals.employeeCount + 1,
      totalHours: currentTotals.totalHours + group.totalHours,
      estimatedPay: currentTotals.estimatedPay + group.estimatedPay,
      serviceCount: currentTotals.serviceCount + group.records.length,
    }),
    {
      employeeCount: 0,
      totalHours: 0,
      estimatedPay: 0,
      serviceCount: 0,
    },
  );

  return {
    employeeGroups,
    totals,
  };
}
