import { InvoiceStatus, VisitStatus } from '@prisma/client';

import { groupPendingBilling } from '@/domain/billing/group-pending-billing';
import type { BillingPeriodLabel, PendingBillingGroupedResult } from '@/domain/billing/types';
import { prisma } from '@/lib/prisma';

import { mapPendingBillingVisitRecord } from './mappers';

export type PendingBillingPeriod = Exclude<BillingPeriodLabel, 'Rango personalizado'>;

type PendingBillingOptions = {
  period?: PendingBillingPeriod;
  referenceDate?: Date;
  customStartDate?: Date;
  customEndDate?: Date;
};

type BillingPeriodRange = {
  startDate: Date;
  endDate: Date;
};

function startOfUtcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day));
}

function getLastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function getBillingPeriodRange({
  period = 'Primera quincena',
  referenceDate = new Date(),
  customStartDate,
  customEndDate,
}: PendingBillingOptions = {}): BillingPeriodRange {
  if (customStartDate && customEndDate) {
    return {
      startDate: customStartDate,
      endDate: customEndDate,
    };
  }

  const year = referenceDate.getUTCFullYear();
  const monthIndex = referenceDate.getUTCMonth();
  const lastDayOfMonth = getLastDayOfMonth(year, monthIndex);

  if (period === 'Segunda quincena') {
    return {
      startDate: startOfUtcDate(year, monthIndex, 16),
      endDate: startOfUtcDate(year, monthIndex, lastDayOfMonth),
    };
  }

  if (period === 'Mes completo') {
    return {
      startDate: startOfUtcDate(year, monthIndex, 1),
      endDate: startOfUtcDate(year, monthIndex, lastDayOfMonth),
    };
  }

  return {
    startDate: startOfUtcDate(year, monthIndex, 1),
    endDate: startOfUtcDate(year, monthIndex, 15),
  };
}

export async function getPendingBilling(
  options: PendingBillingOptions = {},
): Promise<PendingBillingGroupedResult> {
  const { startDate, endDate } = getBillingPeriodRange(options);
  const visits = await prisma.serviceVisit.findMany({
    where: {
      status: VisitStatus.COMPLETED,
      invoiceStatus: {
        in: [InvoiceStatus.READY_TO_INVOICE, InvoiceStatus.NOT_INVOICED],
      },
      billableHours: {
        gt: 0,
      },
      totalAmount: {
        gt: 0,
      },
      scheduledDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      client: true,
      employeeHours: {
        include: {
          employee: true,
        },
      },
      servicePlan: true,
    },
    orderBy: [
      {
        scheduledDate: 'asc',
      },
      {
        client: {
          displayName: 'asc',
        },
      },
    ],
  });

  return groupPendingBilling(visits.map(mapPendingBillingVisitRecord));
}
