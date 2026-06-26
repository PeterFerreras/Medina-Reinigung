'use client';

import { useMemo, useState } from 'react';

import { groupPendingBilling } from '@/domain/billing/group-pending-billing';
import { mockPendingBillingVisits } from '@/domain/billing/mock-billing';

import { BillingClientGroup } from './BillingClientGroup';
import { BillingPeriodFilter } from './BillingPeriodFilter';
import { BillingSummaryCard } from './BillingSummaryCard';

export function PendingBillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Primera quincena');
  const groupedBilling = useMemo(
    () => groupPendingBilling(mockPendingBillingVisits),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
              Pendiente de facturar
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Servicios listos para preparar facturación por cliente.
            </p>
          </div>
          <BillingPeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </header>

        <BillingSummaryCard totals={groupedBilling.totals} />

        <div className="flex flex-col gap-5">
          {groupedBilling.clientGroups.map((group) => (
            <BillingClientGroup key={group.clientId} group={group} />
          ))}
        </div>
      </div>
    </main>
  );
}
