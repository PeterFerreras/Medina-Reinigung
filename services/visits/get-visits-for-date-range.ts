import { prisma } from '@/lib/prisma';
import { isServiceDueOnDate } from '@/domain/schedule/recurrence';
import type { MockClientServicePlan } from '@/domain/schedule/types';
import type { MockServiceVisit } from '@/domain/visits/types';
import { mapClientServicePlanRecord } from '@/services/clients/mappers';

import { mapServiceVisitRecord, toDateKey } from './mappers';

function parseDateKey(date: Date | string): string {
  return typeof date === 'string' ? date : toDateKey(date);
}

function parseScheduledDate(date: Date | string): Date {
  return new Date(`${parseDateKey(date)}T00:00:00.000Z`);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function getDateKeysInRange(startDate: Date | string, endDate: Date | string): string[] {
  const dateKeys: string[] = [];
  const endDateKey = parseDateKey(endDate);
  let cursor = parseScheduledDate(startDate);

  while (toDateKey(cursor) <= endDateKey) {
    dateKeys.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }

  return dateKeys;
}

function parseLocalDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function toPlannedVisit(
  plan: MockClientServicePlan,
  clientName: string,
  scheduledDate: string,
): MockServiceVisit {
  return {
    id: `planned-${plan.id}-${scheduledDate}`,
    clientName,
    scheduledDate,
    estimatedTime: plan.startTime ?? 'Sin hora',
    frequency: plan.frequencyType,
    defaultHours: plan.defaultHours,
    defaultPeopleCount: plan.defaultPeopleCount,
    clientHourlyRate: plan.clientHourlyRate,
    vatRate: plan.vatRate,
    status: 'SCHEDULED',
    notes: plan.operationalNotes,
    servicePlanId: plan.id,
    employeeHours: [],
    isPersisted: false,
  };
}

export async function getVisitsForDateRange(
  startDate: Date | string,
  endDate: Date | string,
) {
  const scheduledDateKeys = getDateKeysInRange(startDate, endDate);
  const visits = await prisma.serviceVisit.findMany({
    where: {
      scheduledDate: {
        gte: parseScheduledDate(startDate),
        lte: parseScheduledDate(endDate),
      },
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
    orderBy: [
      {
        scheduledDate: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });
  const persistedVisitKeys = new Set(
    visits
      .filter((visit) => visit.servicePlanId)
      .map((visit) => `${visit.servicePlanId}:${toDateKey(visit.scheduledDate)}`),
  );
  const activePlans = await prisma.clientServicePlan.findMany({
    where: {
      active: true,
      recurrenceStartDate: {
        lte: parseScheduledDate(endDate),
      },
    },
    include: {
      client: true,
    },
  });
  const plannedVisits = activePlans.flatMap((planRecord) => {
    const plan = mapClientServicePlanRecord(planRecord);

    return scheduledDateKeys
      .filter((scheduledDate) => {
        const planVisitKey = `${plan.id}:${scheduledDate}`;

        return (
          !persistedVisitKeys.has(planVisitKey) &&
          isServiceDueOnDate(plan, parseLocalDate(scheduledDate))
        );
      })
      .map((scheduledDate) =>
        toPlannedVisit(plan, planRecord.client.displayName, scheduledDate),
      );
  });

  return [...visits.map(mapServiceVisitRecord), ...plannedVisits]
    .sort((firstVisit, secondVisit) => {
      const dateComparison = firstVisit.scheduledDate.localeCompare(secondVisit.scheduledDate);

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return firstVisit.estimatedTime.localeCompare(secondVisit.estimatedTime);
    });
}
