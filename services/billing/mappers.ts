import type { Prisma } from '@prisma/client';

import type { MockPendingBillingVisit } from '@/domain/billing/types';
import { toDateKey } from '../visits/mappers';

export type PendingBillingVisitRecord = Prisma.ServiceVisitGetPayload<{
  include: {
    client: true;
    employeeHours: {
      include: {
        employee: true;
      };
    };
    servicePlan: true;
  };
}>;

function getVisitDescription(visit: PendingBillingVisitRecord): string {
  return (
    visit.servicePlan?.billingNotes ??
    visit.notes ??
    visit.servicePlan?.operationalNotes ??
    'Servicio de limpieza'
  );
}

export function mapPendingBillingVisitRecord(
  visit: PendingBillingVisitRecord,
): MockPendingBillingVisit {
  return {
    id: visit.id,
    clientId: visit.clientId,
    clientName: visit.client.displayName,
    serviceDate: toDateKey(visit.scheduledDate),
    description: getVisitDescription(visit),
    employeeNames: visit.employeeHours.map((entry) => entry.employee.name),
    peopleCount: visit.employeeHours.length || visit.servicePlan?.defaultPeopleCount || 1,
    billableHours: visit.billableHours.toNumber(),
    clientHourlyRate: visit.clientHourlyRateSnapshot.toNumber(),
    vatRate: visit.vatRateSnapshot.toNumber(),
    visitStatus: visit.status as MockPendingBillingVisit['visitStatus'],
    invoiceStatus: visit.invoiceStatus,
  };
}
