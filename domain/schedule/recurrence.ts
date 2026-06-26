import type { MockClientServicePlan, UpcomingService, Weekday } from './types';

export const weekdays: Weekday[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const weekdayIndexes: Record<Weekday, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const weekdaysByIndex: Record<number, Weekday> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function parseDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function daysBetween(startDateKey: string, endDateKey: string): number {
  const startDate = parseDate(startDateKey);
  const endDate = parseDate(endDateKey);

  return Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);
}

function getWeekday(date: Date): Weekday {
  return weekdaysByIndex[date.getDay()];
}

function isPlanWeekday(plan: MockClientServicePlan, date: Date): boolean {
  return plan.weekdays.some((weekday) => weekdayIndexes[weekday] === date.getDay());
}

export function isServiceDueOnDate(plan: MockClientServicePlan, date: Date): boolean {
  if (!plan.active) {
    return false;
  }

  const dateKey = toDateKey(date);
  const daysFromStart = daysBetween(plan.recurrenceStartDate, dateKey);

  if (daysFromStart < 0) {
    return false;
  }

  if (plan.frequencyType === 'ONE_TIME') {
    return dateKey === plan.recurrenceStartDate;
  }

  if (plan.frequencyType === 'WEEKLY' || plan.frequencyType === 'MULTIPLE_DAYS_PER_WEEK') {
    return isPlanWeekday(plan, date);
  }

  if (plan.frequencyType === 'BIWEEKLY') {
    return isPlanWeekday(plan, date) && daysFromStart % 14 === 0;
  }

  return false;
}

export function getNextServiceDates(
  plan: MockClientServicePlan,
  fromDate: Date,
  count: number,
): string[] {
  const serviceDates: string[] = [];
  let cursor = new Date(fromDate);
  const maxDaysToScan = 370;

  for (let daysScanned = 0; serviceDates.length < count && daysScanned < maxDaysToScan; daysScanned += 1) {
    if (isServiceDueOnDate(plan, cursor)) {
      serviceDates.push(toDateKey(cursor));
    }

    cursor = addDays(cursor, 1);
  }

  return serviceDates;
}

export function groupPlansByWeekday(
  plans: MockClientServicePlan[],
): Record<Weekday, MockClientServicePlan[]> {
  return weekdays.reduce(
    (groups, weekday) => ({
      ...groups,
      [weekday]: plans.filter(
        (plan) => plan.active && plan.weekdays.includes(weekday),
      ),
    }),
    {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    } as Record<Weekday, MockClientServicePlan[]>,
  );
}

export function getUpcomingServices(
  plans: MockClientServicePlan[],
  fromDate: Date,
  daysAhead: number,
): UpcomingService[] {
  const untilDate = addDays(fromDate, daysAhead);

  return plans
    .filter((plan) => plan.active)
    .flatMap((plan) =>
      getNextServiceDates(plan, fromDate, daysAhead).map((serviceDate) => ({
        plan,
        serviceDate,
      })),
    )
    .filter((service) => parseDate(service.serviceDate) <= untilDate)
    .sort((first, second) => first.serviceDate.localeCompare(second.serviceDate));
}

export function getWeekdayLabel(weekday: Weekday): string {
  const labels: Record<Weekday, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  return labels[weekday];
}

export function getFrequencyLabel(frequencyType: MockClientServicePlan['frequencyType']): string {
  const labels: Record<MockClientServicePlan['frequencyType'], string> = {
    ONE_TIME: 'Único',
    WEEKLY: 'Semanal',
    BIWEEKLY: 'Quincenal',
    MULTIPLE_DAYS_PER_WEEK: 'Varios días/semana',
    MONTHLY: 'Mensual',
    CUSTOM: 'Personalizado',
  };

  return labels[frequencyType];
}
