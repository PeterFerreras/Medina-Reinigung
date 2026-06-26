import { getVisitsForDateRange } from './get-visits-for-date-range';

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

export async function getTodayVisits() {
  const today = new Date();

  return getVisitsForDateRange(addDays(today, -14), addDays(today, 30));
}
