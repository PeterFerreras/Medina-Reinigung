import { prisma } from '@/lib/prisma';

import { mapServiceVisitRecord, toDateKey } from './mappers';

function parseDateKey(date: Date | string): string {
  return typeof date === 'string' ? date : toDateKey(date);
}

export async function getVisitsForDate(date: Date | string) {
  const dateKey = parseDateKey(date);
  const scheduledDate = new Date(`${dateKey}T00:00:00.000Z`);
  const visits = await prisma.serviceVisit.findMany({
    where: {
      scheduledDate,
    },
    include: {
      client: true,
      servicePlan: true,
      employeeHours: {
        include: {
          employee: true,
        },
      },
    },
    orderBy: {
      scheduledDate: 'asc',
    },
  });

  return visits
    .map(mapServiceVisitRecord)
    .sort((firstVisit, secondVisit) =>
      firstVisit.estimatedTime.localeCompare(secondVisit.estimatedTime),
    );
}
