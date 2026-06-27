import { AppShell } from '@/components/AppShell';
import { groupPendingBilling } from '@/domain/billing/group-pending-billing';
import { mockClients } from '@/domain/clients/mock-clients';
import { mockEmployees } from '@/domain/employees/mock-employees';
import { mockServicePlans } from '@/domain/schedule/mock-service-plans';
import { createMockVisits } from '@/domain/visits/mock-visits';
import { mockPendingBillingVisits } from '@/domain/billing/mock-billing';
import type { BillingPeriodLabel, PendingBillingGroupedResult } from '@/domain/billing/types';
import {
  getBillingPeriodRange,
  getPendingBilling,
  type PendingBillingPeriod,
} from '@/services/billing/get-pending-billing';
import { getEmployees } from '@/services/employees/get-employees';
import { getClientsWithServicePlans } from '@/services/clients/get-clients-with-service-plans';
import { getTodayVisits } from '@/services/visits/get-today-visits';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getInitialTodayDate(visits: Array<{ scheduledDate: string }>): string {
  const today = toDateKey(new Date());

  if (visits.some((visit) => visit.scheduledDate === today)) {
    return today;
  }

  const upcomingVisit = visits.find((visit) => visit.scheduledDate > today);

  return upcomingVisit?.scheduledDate ?? visits.at(-1)?.scheduledDate ?? today;
}

const billingPeriods: PendingBillingPeriod[] = [
  'Primera quincena',
  'Segunda quincena',
  'Mes completo',
];

const emptyBillingGroups: PendingBillingGroupedResult = {
  clientGroups: [],
  totals: {
    clientCount: 0,
    totalHours: 0,
    subtotal: 0,
    vatAmount: 0,
    total: 0,
  },
};

function getEmptyPendingBillingGroups(): Partial<
  Record<BillingPeriodLabel, PendingBillingGroupedResult>
> {
  return Object.fromEntries(
    billingPeriods.map((period) => [period, emptyBillingGroups]),
  );
}

function getMockPendingBillingGroups(
  referenceDate: Date,
): Partial<Record<BillingPeriodLabel, PendingBillingGroupedResult>> {
  return Object.fromEntries(
    billingPeriods.map((period) => {
      const { startDate, endDate } = getBillingPeriodRange({ period, referenceDate });
      const startKey = toDateKey(startDate);
      const endKey = toDateKey(endDate);
      const visitsForPeriod = mockPendingBillingVisits.filter(
        (visit) => visit.serviceDate >= startKey && visit.serviceDate <= endKey,
      );

      return [period, groupPendingBilling(visitsForPeriod)];
    }),
  );
}

async function getPendingBillingGroups(
  referenceDate: Date,
): Promise<Partial<Record<BillingPeriodLabel, PendingBillingGroupedResult>>> {
  const entries = await Promise.all(
    billingPeriods.map(async (period) => [
      period,
      await getPendingBilling({ period, referenceDate }),
    ]),
  );

  return Object.fromEntries(entries);
}

export default async function Home() {
  const now = new Date();
  const today = toDateKey(now);

  if (process.env.CLEANOPS_USE_MOCKS === '1') {
    const visits = createMockVisits();

    return (
      <AppShell
        initialClients={mockClients}
        initialServicePlans={mockServicePlans}
        initialVisits={visits}
        initialEmployees={mockEmployees}
        initialTodayDate={today}
        pendingBillingGroups={getMockPendingBillingGroups(now)}
        isUsingTestData
      />
    );
  }

  try {
    const [{ clients, servicePlans }, visits, employees, pendingBillingGroups] =
      await Promise.all([
        getClientsWithServicePlans(),
        getTodayVisits(),
        getEmployees(),
        getPendingBillingGroups(now),
      ]);

    return (
      <AppShell
        initialClients={clients}
        initialServicePlans={servicePlans}
        initialVisits={visits}
        initialEmployees={employees}
        initialTodayDate={getInitialTodayDate(visits)}
        pendingBillingGroups={pendingBillingGroups}
        isUsingTestData={false}
      />
    );
  } catch (error) {
    console.error('Failed to load app data from Prisma.', error);

    return (
      <AppShell
        initialClients={[]}
        initialServicePlans={[]}
        initialVisits={[]}
        initialEmployees={[]}
        initialTodayDate={today}
        pendingBillingGroups={getEmptyPendingBillingGroups()}
        isUsingTestData={false}
      />
    );
  }
}
