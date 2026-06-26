import type { MockEmployee } from '@/domain/employees/types';
import type { VisitTotals } from '@/domain/calculations';

type EmployeePaySummary = {
  employee: MockEmployee;
  hours: number;
  estimatedPay: number;
};

type VisitCalculationSummaryProps = {
  totals: VisitTotals;
  employeePays: EmployeePaySummary[];
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function VisitCalculationSummary({
  totals,
  employeePays,
}: VisitCalculationSummaryProps) {
  const summaryItems = [
    { label: 'Horas trabajadas', value: totals.employeeHoursTotal.toString() },
    { label: 'Horas facturables', value: totals.billableHours.toString() },
    { label: 'Subtotal', value: formatCurrency(totals.subtotal) },
    { label: 'IVA', value: formatCurrency(totals.vatAmount) },
    { label: 'Total cliente', value: formatCurrency(totals.total) },
  ];

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-base font-semibold text-slate-950">Resumen calculado</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-md bg-white p-3">
            <dt className="text-xs font-medium uppercase text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-950">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-950">Pago estimado por empleado</h4>
        <div className="mt-2 grid gap-2">
          {employeePays.length > 0 ? (
            employeePays.map((item) => (
              <div
                key={item.employee.id}
                className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-700">
                  {item.employee.name} · {item.hours} h
                </span>
                <span className="font-semibold text-slate-950">
                  {formatCurrency(item.estimatedPay)}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-md bg-white px-3 py-2 text-sm text-slate-500">
              Selecciona empleados para estimar pagos.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
