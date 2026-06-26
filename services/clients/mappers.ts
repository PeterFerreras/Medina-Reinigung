import type { Prisma } from '@prisma/client';

import type { MockClient } from '@/domain/clients/types';
import type { MockClientServicePlan } from '@/domain/schedule/types';

export type ClientServicePlanRecord = Prisma.ClientServicePlanGetPayload<Record<string, never>>;
export type ClientRecord = Prisma.ClientGetPayload<Record<string, never>>;

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function mapClientRecord(client: ClientRecord): MockClient {
  return {
    id: client.id,
    displayName: client.displayName,
    contactType: client.contactType ?? undefined,
    email: client.email ?? undefined,
    phone: client.phone ?? undefined,
    mobile: client.mobile ?? undefined,
    address: client.address ?? undefined,
    city: client.city ?? undefined,
    country: client.country ?? undefined,
    language: client.language ?? undefined,
    status: client.status,
    remarks: client.remarks ?? undefined,
  };
}

export function mapClientServicePlanRecord(
  plan: ClientServicePlanRecord,
): MockClientServicePlan {
  return {
    id: plan.id,
    clientId: plan.clientId,
    frequencyType: plan.frequencyType,
    weekdays: plan.weekdays,
    recurrenceStartDate: toDateKey(plan.recurrenceStartDate),
    startTime: plan.startTime ?? undefined,
    defaultHours: plan.defaultHours.toNumber(),
    defaultPeopleCount: plan.defaultPeopleCount,
    clientHourlyRate: plan.clientHourlyRate.toNumber(),
    vatRate: plan.vatRate.toNumber(),
    billingNotes: plan.billingNotes ?? undefined,
    operationalNotes: plan.operationalNotes ?? undefined,
    active: plan.active,
  };
}
