import { describe, expect, it } from 'vitest';

import { visitRegistrationSchema } from '../../services/visits/visit-registration-schema';

describe('visitRegistrationSchema', () => {
  it('accepts a completed visit with employee hours', () => {
    expect(
      visitRegistrationSchema.safeParse({
        visitId: 'visit-1',
        status: 'COMPLETED',
        employeeHours: [{ employeeId: 'employee-1', hoursWorked: 2.5 }],
      }).success,
    ).toBe(true);
  });

  it('accepts a planned visit when service plan and date are provided', () => {
    expect(
      visitRegistrationSchema.safeParse({
        visitId: 'planned-plan-1-2026-06-26',
        servicePlanId: 'plan-1',
        scheduledDate: '2026-06-26',
        status: 'COMPLETED',
        employeeHours: [{ employeeId: 'employee-1', hoursWorked: 2.5 }],
      }).success,
    ).toBe(true);
  });

  it('requires service plan and date for planned visits', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: 'planned-plan-1-2026-06-26',
      status: 'COMPLETED',
      employeeHours: [{ employeeId: 'employee-1', hoursWorked: 2.5 }],
    });

    expect(result.success).toBe(false);
  });

  it('requires visitId', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: '',
      status: 'COMPLETED',
      employeeHours: [{ employeeId: 'employee-1', hoursWorked: 2 }],
    });

    expect(result.success).toBe(false);
  });

  it('requires employeeHours for completed visits', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: 'visit-1',
      status: 'COMPLETED',
      employeeHours: [],
    });

    expect(result.success).toBe(false);
  });

  it('requires employeeHours for no billable visits', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: 'visit-1',
      status: 'NO_BILLABLE',
      employeeHours: [],
    });

    expect(result.success).toBe(false);
  });

  it('allows empty employeeHours for cancelled visits', () => {
    expect(
      visitRegistrationSchema.safeParse({
        visitId: 'visit-1',
        status: 'CANCELLED',
        employeeHours: [],
      }).success,
    ).toBe(true);
  });

  it('rejects negative hours', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: 'visit-1',
      status: 'COMPLETED',
      employeeHours: [{ employeeId: 'employee-1', hoursWorked: -1 }],
    });

    expect(result.success).toBe(false);
  });

  it('requires employeeId', () => {
    const result = visitRegistrationSchema.safeParse({
      visitId: 'visit-1',
      status: 'COMPLETED',
      employeeHours: [{ employeeId: '', hoursWorked: 1 }],
    });

    expect(result.success).toBe(false);
  });
});
