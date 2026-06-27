'use client';

import { useState } from 'react';

import { PendingBillingPage } from '@/components/billing/PendingBillingPage';
import { ClientsPage } from '@/components/clients/ClientsPage';
import { PayrollHoursPage } from '@/components/payroll/PayrollHoursPage';
import { WeeklySchedulePage } from '@/components/schedule/WeeklySchedulePage';
import { TodayPage } from '@/components/today/TodayPage';
import type { BillingPeriodLabel, PendingBillingGroupedResult } from '@/domain/billing/types';
import type { MockClient } from '@/domain/clients/types';
import type { MockEmployee } from '@/domain/employees/types';
import type { MockClientServicePlan } from '@/domain/schedule/types';
import type { MockServiceVisit } from '@/domain/visits/types';

type ActiveView = 'today' | 'clients' | 'schedule' | 'billing' | 'payroll';

type AppShellProps = {
  initialClients: MockClient[];
  initialServicePlans: MockClientServicePlan[];
  initialVisits: MockServiceVisit[];
  initialEmployees: MockEmployee[];
  initialTodayDate: string;
  pendingBillingGroups: Partial<Record<BillingPeriodLabel, PendingBillingGroupedResult>>;
  isUsingTestData: boolean;
};

const navigationItems: Array<{ id: ActiveView; label: string }> = [
  { id: 'today', label: 'Hoy' },
  { id: 'clients', label: 'Clientes' },
  { id: 'schedule', label: 'Agenda semanal' },
  { id: 'billing', label: 'Pendiente de facturar' },
  { id: 'payroll', label: 'Horas para nómina' },
];

export function AppShell({
  initialClients,
  initialServicePlans,
  initialVisits,
  initialEmployees,
  initialTodayDate,
  pendingBillingGroups,
  isUsingTestData,
}: AppShellProps) {
  const [activeView, setActiveView] = useState<ActiveView>('today');
  const [clients, setClients] = useState<MockClient[]>(initialClients);
  const [servicePlans, setServicePlans] =
    useState<MockClientServicePlan[]>(initialServicePlans);

  const handleSaveClient = (client: MockClient) => {
    setClients((currentClients) => {
      const exists = currentClients.some((currentClient) => currentClient.id === client.id);

      return exists
        ? currentClients.map((currentClient) =>
            currentClient.id === client.id ? client : currentClient,
          )
        : [...currentClients, client];
    });
  };

  const handleSaveServicePlan = (plan: MockClientServicePlan) => {
    setServicePlans((currentPlans) => {
      const exists = currentPlans.some((currentPlan) => currentPlan.id === plan.id);

      return exists
        ? currentPlans.map((currentPlan) => (currentPlan.id === plan.id ? plan : currentPlan))
        : [...currentPlans, plan];
    });
  };

  return (
    <>
      <nav className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${
                activeView === item.id
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {activeView === 'today' ? (
        <TodayPage
          visits={initialVisits}
          employees={initialEmployees}
          initialSelectedDate={initialTodayDate}
          isUsingTestData={isUsingTestData}
        />
      ) : null}
      {activeView === 'clients' ? (
        <ClientsPage
          clients={clients}
          servicePlans={servicePlans}
          onSaveClient={handleSaveClient}
          onSaveServicePlan={handleSaveServicePlan}
        />
      ) : null}
      {activeView === 'schedule' ? (
        <WeeklySchedulePage clients={clients} servicePlans={servicePlans} />
      ) : null}
      {activeView === 'billing' ? (
        <PendingBillingPage pendingBillingGroups={pendingBillingGroups} />
      ) : null}
      {activeView === 'payroll' ? <PayrollHoursPage /> : null}
    </>
  );
}
