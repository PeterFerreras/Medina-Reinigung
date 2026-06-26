import { getVisitsForDate } from './get-visits-for-date';

export async function getTodayVisits() {
  return getVisitsForDate(new Date());
}
