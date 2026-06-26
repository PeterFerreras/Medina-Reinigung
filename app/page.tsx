import { AppShell } from '@/components/AppShell';
import { mockClients } from '@/domain/clients/mock-clients';
import { mockEmployees } from '@/domain/employees/mock-employees';
import { mockServicePlans } from '@/domain/schedule/mock-service-plans';
import { createMockVisits } from '@/domain/visits/mock-visits';
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

export default async function Home() {
  const today = toDateKey(new Date());

  if (process.env.CLEANOPS_USE_MOCKS === '1') {
    const visits = createMockVisits();

    return (
      <AppShell
        initialClients={mockClients}
        initialServicePlans={mockServicePlans}
        initialVisits={visits}
        initialEmployees={mockEmployees}
        initialTodayDate={today}
        isUsingTestData
      />
    );
  }

  try {
    const [{ clients, servicePlans }, visits, employees] = await Promise.all([
      getClientsWithServicePlans(),
      getTodayVisits(),
      getEmployees(),
    ]);

    return (
      <AppShell
        initialClients={clients}
        initialServicePlans={servicePlans}
        initialVisits={visits}
        initialEmployees={employees}
        initialTodayDate={getInitialTodayDate(visits)}
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
        isUsingTestData={false}
      />
    );
  }
}
