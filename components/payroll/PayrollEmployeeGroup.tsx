import type { PayrollEmployeeGroup as PayrollEmployeeGroupType } from '@/domain/payroll/types';

import { PayrollVisitRow } from './PayrollVisitRow';

type PayrollEmployeeGroupProps = {
  group: PayrollEmployeeGroupType;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function PayrollEmployeeGroup({ group }: PayrollEmployeeGroupProps) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-emerald-100 text-sm font-bold text-emerald-800">
            {group.employeeInitials}
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{group.employeeName}</h2>
            <p className="mt-1 text-sm text-slate-500">{group.payrollStatus}</p>
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Horas</dt>
            <dd className="mt-1 font-semibold text-slate-950">{group.totalHours}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Tarifa/hora</dt>
            <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(group.payRate)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Pago estimado</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {formatCurrency(group.estimatedPay)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Fecha</th>
              <th className="px-3 py-3 text-left font-semibold">Cliente</th>
              <th className="px-3 py-3 text-right font-semibold">Horas</th>
              <th className="px-3 py-3 text-right font-semibold">Tarifa snapshot</th>
              <th className="px-3 py-3 text-right font-semibold">Pago estimado</th>
              <th className="px-3 py-3 text-right font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {group.records.map((record) => (
              <PayrollVisitRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 p-4">
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Exportar Excel
        </button>
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Generar PDF
        </button>
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
          Marcar como aprobado
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-400 shadow-sm"
        >
          Marcar como pagado · Próximo paso
        </button>
      </div>
    </section>
  );
}
