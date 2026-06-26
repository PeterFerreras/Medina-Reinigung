import type { Prisma } from '@prisma/client';

import type { MockServiceVisit } from '@/domain/visits/types';

export type ServiceVisitWithRelations = Prisma.ServiceVisitGetPayload<{
  include: {
    client: true;
    servicePlan: true;
    employeeHours: {
      include: {
        employee: true;
      };
    };
  };
}>;

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toTimeLabel(date: Date | null): string | undefined {
  if (!date) {
    return undefined;
  }

  return date.toISOString().slice(11, 16);
}

export function mapServiceVisitRecord(visit: ServiceVisitWithRelations): MockServiceVisit {
  const employeePeopleCount =
    visit.employeeHours.length > 0 ? visit.employeeHours.length : undefined;

  return {
    id: visit.id,
    clientName: visit.client.displayName,
    scheduledDate: toDateKey(visit.scheduledDate),
    estimatedTime: visit.servicePlan?.startTime ?? toTimeLabel(visit.startedAt) ?? 'Sin hora',
    frequency: visit.servicePlan?.frequencyType ?? 'CUSTOM',
    defaultHours: (visit.servicePlan?.defaultHours ?? visit.billableHours).toNumber(),
    defaultPeopleCount: visit.servicePlan?.defaultPeopleCount ?? employeePeopleCount ?? 1,
    clientHourlyRate: visit.clientHourlyRateSnapshot.toNumber(),
    vatRate: visit.vatRateSnapshot.toNumber(),
    status: visit.status,
    notes: visit.notes ?? undefined,
    servicePlanId: visit.servicePlanId ?? undefined,
    employeeHours: visit.employeeHours.map((entry) => ({
      employeeId: entry.employeeId,
      hoursWorked: entry.hoursWorked.toNumber(),
    })),
    isPersisted: true,
  };
}
