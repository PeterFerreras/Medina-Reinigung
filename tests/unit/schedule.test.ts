import { describe, expect, it } from 'vitest';

import {
  getNextServiceDates,
  groupPlansByWeekday,
  isServiceDueOnDate,
} from '../../domain/schedule/recurrence';
import type { MockClientServicePlan } from '../../domain/schedule/types';

const weeklyPlan: MockClientServicePlan = {
  id: 'weekly',
  clientId: 'client-a',
  frequencyType: 'WEEKLY',
  weekdays: ['MONDAY'],
  recurrenceStartDate: '2026-06-01',
  startTime: '09:00',
  defaultHours: 3,
  defaultPeopleCount: 2,
  clientHourlyRate: 48,
  vatRate: 8.1,
  active: true,
};

const biweeklyPlan: MockClientServicePlan = {
  ...weeklyPlan,
  id: 'biweekly',
  frequencyType: 'BIWEEKLY',
  recurrenceStartDate: '2026-06-01',
};

describe('schedule recurrence', () => {
  it('marks a weekly client as due every week', () => {
    expect(isServiceDueOnDate(weeklyPlan, new Date(2026, 5, 1))).toBe(true);
    expect(isServiceDueOnDate(weeklyPlan, new Date(2026, 5, 8))).toBe(true);
  });

  it('marks a biweekly client as due every 14 days', () => {
    expect(isServiceDueOnDate(biweeklyPlan, new Date(2026, 5, 15))).toBe(true);
  });

  it('does not mark a biweekly client as due on the intermediate Monday', () => {
    expect(isServiceDueOnDate(biweeklyPlan, new Date(2026, 5, 8))).toBe(false);
  });

  it('groups a Monday and Thursday client into both weekdays', () => {
    const multiDayPlan: MockClientServicePlan = {
      ...weeklyPlan,
      id: 'multi',
      frequencyType: 'MULTIPLE_DAYS_PER_WEEK',
      weekdays: ['MONDAY', 'THURSDAY'],
    };
    const groupedPlans = groupPlansByWeekday([multiDayPlan]);

    expect(groupedPlans.MONDAY).toContain(multiDayPlan);
    expect(groupedPlans.THURSDAY).toContain(multiDayPlan);
  });

  it('excludes inactive plans from weekday groups', () => {
    const inactivePlan = { ...weeklyPlan, active: false };
    const groupedPlans = groupPlansByWeekday([inactivePlan]);

    expect(groupedPlans.MONDAY).toHaveLength(0);
  });

  it('returns the next service dates', () => {
    expect(getNextServiceDates(biweeklyPlan, new Date(2026, 5, 1), 3)).toEqual([
      '2026-06-01',
      '2026-06-15',
      '2026-06-29',
    ]);
  });
});
