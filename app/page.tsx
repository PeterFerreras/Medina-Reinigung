import { AppShell } from '@/components/AppShell';
import { getClientsWithServicePlans } from '@/services/clients/get-clients-with-service-plans';
import { getTodayVisits } from '@/services/visits/get-today-visits';

export default async function Home() {
  if (process.env.CLEANOPS_USE_MOCKS === '1') {
    return <AppShell initialClients={[]} initialServicePlans={[]} initialVisits={[]} />;
  }

  try {
    const [{ clients, servicePlans }, visits] = await Promise.all([
      getClientsWithServicePlans(),
      getTodayVisits(),
    ]);

    return (
      <AppShell
        initialClients={clients}
        initialServicePlans={servicePlans}
        initialVisits={visits}
      />
    );
  } catch (error) {
    console.error('Failed to load app data from Prisma. Falling back to mock data.', error);

    return <AppShell initialClients={[]} initialServicePlans={[]} initialVisits={[]} />;
  }
}
