'use client';

import { useState } from 'react';

import type { MockClient } from '@/domain/clients/types';
import type { MockClientServicePlan } from '@/domain/schedule/types';

import { ClientCard } from './ClientCard';
import { ClientDetailPanel } from './ClientDetailPanel';
import { ClientForm } from './ClientForm';
import { ServicePlanForm } from '../schedule/ServicePlanForm';

type ClientsPageProps = {
  clients: MockClient[];
  servicePlans: MockClientServicePlan[];
  onSaveClient: (client: MockClient) => void;
  onSaveServicePlan: (plan: MockClientServicePlan) => void;
};

type EditingClientState =
  | { mode: 'new'; client?: undefined }
  | { mode: 'edit'; client: MockClient }
  | null;

type EditingPlanState =
  | { mode: 'new'; clientId: string; plan?: undefined }
  | { mode: 'edit'; clientId: string; plan: MockClientServicePlan }
  | null;

function getPlansForClient(plans: MockClientServicePlan[], clientId: string) {
  return plans.filter((plan) => plan.clientId === clientId);
}

export function ClientsPage({
  clients,
  servicePlans,
  onSaveClient,
  onSaveServicePlan,
}: ClientsPageProps) {
  const referenceDate = new Date();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id ?? null);
  const [editingClient, setEditingClient] = useState<EditingClientState>(null);
  const [editingPlan, setEditingPlan] = useState<EditingPlanState>(null);
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? null;
  const selectedClientPlans = selectedClient
    ? getPlansForClient(servicePlans, selectedClient.id)
    : [];

  const handleSaveClient = (client: MockClient) => {
    onSaveClient(client);
    setSelectedClientId(client.id);
    setEditingClient(null);
  };

  const handleSavePlan = (plan: MockClientServicePlan) => {
    onSaveServicePlan(plan);
    setSelectedClientId(plan.clientId);
    setEditingPlan(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Clientes</h1>
            <p className="mt-2 text-sm text-slate-600">
              Clientes mock con planes recurrentes editables en estado local.
            </p>
          </div>
          <button
            type="button"
            className="w-fit rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
            onClick={() => setEditingClient({ mode: 'new' })}
          >
            Nuevo cliente
          </button>
        </header>

        {editingClient ? (
          <ClientForm
            client={editingClient.client}
            onSave={handleSaveClient}
            onCancel={() => setEditingClient(null)}
          />
        ) : null}

        {editingPlan ? (
          <ServicePlanForm
            clientId={editingPlan.clientId}
            plan={editingPlan.plan}
            onSave={handleSavePlan}
            onCancel={() => setEditingPlan(null)}
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <section className="grid gap-4 lg:grid-cols-2">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                plans={getPlansForClient(servicePlans, client.id)}
                referenceDate={referenceDate}
                onSelect={setSelectedClientId}
                onEdit={(clientToEdit) => setEditingClient({ mode: 'edit', client: clientToEdit })}
              />
            ))}
          </section>

          <div className="xl:sticky xl:top-6 xl:self-start">
            <ClientDetailPanel
              client={selectedClient}
              plans={selectedClientPlans}
              referenceDate={referenceDate}
              onNewPlan={() => {
                if (selectedClient) {
                  setEditingPlan({ mode: 'new', clientId: selectedClient.id });
                }
              }}
              onEditPlan={(plan) => setEditingPlan({ mode: 'edit', clientId: plan.clientId, plan })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
