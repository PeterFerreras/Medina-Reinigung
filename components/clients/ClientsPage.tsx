import { mockClients } from '@/domain/clients/mock-clients';
import { mockServicePlans } from '@/domain/schedule/mock-service-plans';

import { ClientCard } from './ClientCard';

function getPlansForClient(clientId: string) {
  return mockServicePlans.filter((plan) => plan.clientId === clientId);
}

export function ClientsPage() {
  const referenceDate = new Date();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Clientes</h1>
          <p className="mt-2 text-sm text-slate-600">
            Clientes mock con sus planes activos y próxima visita calculada.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          {mockClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              plans={getPlansForClient(client.id)}
              referenceDate={referenceDate}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
