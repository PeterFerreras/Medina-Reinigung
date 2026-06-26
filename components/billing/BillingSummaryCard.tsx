import type { PendingBillingTotals } from '@/domain/billing/types';

type BillingSummaryCardProps = {
  totals: PendingBillingTotals;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function BillingSummaryCard({ totals }: BillingSummaryCardProps) {
  const items = [
    { label: 'Clientes pendientes', value: totals.clientCount.toString() },
    { label: 'Horas facturables', value: totals.totalHours.toString() },
    { label: 'Subtotal', value: formatCurrency(totals.subtotal) },
    { label: 'IVA', value: formatCurrency(totals.vatAmount) },
    { label: 'Total', value: formatCurrency(totals.total) },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Resumen general">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
