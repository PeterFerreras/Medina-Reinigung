import type { BillingClientGroup as BillingClientGroupType } from '@/domain/billing/types';

import { BillingVisitRow } from './BillingVisitRow';

type BillingClientGroupProps = {
  group: BillingClientGroupType;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function BillingClientGroup({ group }: BillingClientGroupProps) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{group.clientName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {group.serviceCount} servicios · {group.invoiceStatus}
          </p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-slate-500">Horas</dt>
            <dd className="mt-1 font-semibold text-slate-950">{group.totalHours}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(group.subtotal)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">IVA</dt>
            <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(group.vatAmount)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Total</dt>
            <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(group.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Fecha</th>
              <th className="px-3 py-3 text-left font-semibold">Servicio</th>
              <th className="px-3 py-3 text-right font-semibold">Horas</th>
              <th className="px-3 py-3 text-right font-semibold">Tarifa</th>
              <th className="px-3 py-3 text-right font-semibold">Subtotal</th>
              <th className="px-3 py-3 text-right font-semibold">IVA</th>
              <th className="px-3 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {group.visits.map((visit) => (
              <BillingVisitRow key={visit.id} visit={visit} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 p-4">
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Generar resumen
        </button>
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Marcar como facturado
        </button>
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Exportar
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-400 shadow-sm"
        >
          Enviar a bexio · Próximamente
        </button>
      </div>
    </section>
  );
}
