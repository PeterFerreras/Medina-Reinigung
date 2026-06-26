'use client';

import { useState } from 'react';

import { PendingBillingPage } from '@/components/billing/PendingBillingPage';
import { ClientsPage } from '@/components/clients/ClientsPage';
import { PayrollHoursPage } from '@/components/payroll/PayrollHoursPage';
import { WeeklySchedulePage } from '@/components/schedule/WeeklySchedulePage';
import { TodayPage } from '@/components/today/TodayPage';

type ActiveView = 'today' | 'clients' | 'schedule' | 'billing' | 'payroll';

const navigationItems: Array<{ id: ActiveView; label: string }> = [
  { id: 'today', label: 'Hoy' },
  { id: 'clients', label: 'Clientes' },
  { id: 'schedule', label: 'Agenda semanal' },
  { id: 'billing', label: 'Pendiente de facturar' },
  { id: 'payroll', label: 'Horas para nómina' },
];

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('today');

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

      {activeView === 'today' ? <TodayPage /> : null}
      {activeView === 'clients' ? <ClientsPage /> : null}
      {activeView === 'schedule' ? <WeeklySchedulePage /> : null}
      {activeView === 'billing' ? <PendingBillingPage /> : null}
      {activeView === 'payroll' ? <PayrollHoursPage /> : null}
    </>
  );
}
