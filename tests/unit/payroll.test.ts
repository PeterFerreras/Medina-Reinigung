import { describe, expect, it } from 'vitest';

import { groupPayrollHours } from '../../domain/payroll/group-payroll-hours';
import type { MockPayrollHourRecord } from '../../domain/payroll/types';

const baseRecord: MockPayrollHourRecord = {
  id: 'record-1',
  employeeId: 'employee-a',
  employeeName: 'Employee A',
  employeeInitials: 'EA',
  serviceDate: '2026-06-01',
  clientName: 'Client A',
  hoursWorked: 3,
  payRateSnapshot: 25,
  payrollStatus: 'OPEN',
};

describe('groupPayrollHours', () => {
  it('groups two records from the same employee', () => {
    const result = groupPayrollHours([
      baseRecord,
      { ...baseRecord, id: 'record-2', hoursWorked: 2 },
    ]);

    expect(result.employeeGroups).toHaveLength(1);
    expect(result.employeeGroups[0].records).toHaveLength(2);
  });

  it('separates different employees', () => {
    const result = groupPayrollHours([
      baseRecord,
      {
        ...baseRecord,
        id: 'record-2',
        employeeId: 'employee-b',
        employeeName: 'Employee B',
      },
    ]);

    expect(result.employeeGroups).toHaveLength(2);
  });

  it('calculates total hours', () => {
    const result = groupPayrollHours([
      baseRecord,
      { ...baseRecord, id: 'record-2', hoursWorked: 2 },
    ]);

    expect(result.employeeGroups[0].totalHours).toBe(5);
  });

  it('calculates estimated pay', () => {
    const result = groupPayrollHours([baseRecord]);

    expect(result.employeeGroups[0].estimatedPay).toBe(75);
  });

  it('ignores negative hours', () => {
    const result = groupPayrollHours([
      baseRecord,
      { ...baseRecord, id: 'record-negative', hoursWorked: -2 },
    ]);

    expect(result.employeeGroups[0].records).toHaveLength(1);
    expect(result.totals.totalHours).toBe(3);
  });

  it('ignores zero hours', () => {
    const result = groupPayrollHours([
      baseRecord,
      { ...baseRecord, id: 'record-zero', hoursWorked: 0 },
    ]);

    expect(result.employeeGroups[0].records).toHaveLength(1);
    expect(result.totals.totalHours).toBe(3);
  });

  it('calculates general totals', () => {
    const result = groupPayrollHours([
      baseRecord,
      {
        ...baseRecord,
        id: 'record-2',
        employeeId: 'employee-b',
        employeeName: 'Employee B',
        hoursWorked: 2,
        payRateSnapshot: 30,
      },
    ]);

    expect(result.totals.employeeCount).toBe(2);
    expect(result.totals.totalHours).toBe(5);
    expect(result.totals.estimatedPay).toBe(135);
    expect(result.totals.serviceCount).toBe(2);
  });
});
