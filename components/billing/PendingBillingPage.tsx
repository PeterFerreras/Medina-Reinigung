'use client';

import { useMemo, useState } from 'react';

import type {
  BillingPeriodLabel,
  PendingBillingGroupedResult,
} from '@/domain/billing/types';

import { BillingClientGroup } from './BillingClientGroup';
import { BillingPeriodFilter } from './BillingPeriodFilter';
import { BillingSummaryCard } from './BillingSummaryCard';

type PendingBillingPageProps = {
  pendingBillingGroups: Partial<Record<BillingPeriodLabel, PendingBillingGroupedResult>>;
};

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

export function PendingBillingPage({ pendingBillingGroups }: PendingBillingPageProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<BillingPeriodLabel>('Primera quincena');
  const groupedBilling = useMemo(
    () => pendingBillingGroups[selectedPeriod] ?? emptyBillingGroups,
    [pendingBillingGroups, selectedPeriod],
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

        {groupedBilling.clientGroups.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groupedBilling.clientGroups.map((group) => (
              <BillingClientGroup key={group.clientId} group={group} />
            ))}
          </div>
        ) : (
          <section className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No hay servicios pendientes de facturar para este per&iacute;odo.
          </section>
        )}
      </div>
    </main>
  );
}
