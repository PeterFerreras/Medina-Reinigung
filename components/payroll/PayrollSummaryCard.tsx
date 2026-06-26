import type { PayrollTotals } from '@/domain/payroll/types';

type PayrollSummaryCardProps = {
  totals: PayrollTotals;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function PayrollSummaryCard({ totals }: PayrollSummaryCardProps) {
  const items = [
    { label: 'Empleados con horas', value: totals.employeeCount.toString() },
    { label: 'Horas trabajadas', value: totals.totalHours.toString() },
    { label: 'Total estimado a pagar', value: formatCurrency(totals.estimatedPay) },
    { label: 'Servicios registrados', value: totals.serviceCount.toString() },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de nómina">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
