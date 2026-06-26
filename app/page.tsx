import { AppShell } from '@/components/AppShell';
import { getClientsWithServicePlans } from '@/services/clients/get-clients-with-service-plans';

export default async function Home() {
  if (process.env.CLEANOPS_USE_MOCKS === '1') {
    return <AppShell initialClients={[]} initialServicePlans={[]} />;
  }

  try {
    const { clients, servicePlans } = await getClientsWithServicePlans();

    return <AppShell initialClients={clients} initialServicePlans={servicePlans} />;
  } catch (error) {
    console.error('Failed to load clients from Prisma. Falling back to mock data.', error);

    return <AppShell initialClients={[]} initialServicePlans={[]} />;
  }
}
