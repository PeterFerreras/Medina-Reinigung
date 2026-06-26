import type { PayrollVisitLine } from '@/domain/payroll/types';

type PayrollVisitRowProps = {
  record: PayrollVisitLine;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function PayrollVisitRow({ record }: PayrollVisitRowProps) {
  return (
    <tr className="border-t border-slate-200 text-sm">
      <td className="px-3 py-3 text-slate-700">{record.serviceDate}</td>
      <td className="px-3 py-3 font-medium text-slate-950">{record.clientName}</td>
      <td className="px-3 py-3 text-right text-slate-700">{record.hoursWorked}</td>
      <td className="px-3 py-3 text-right text-slate-700">
        {formatCurrency(record.payRateSnapshot)}
      </td>
      <td className="px-3 py-3 text-right font-semibold text-slate-950">
        {formatCurrency(record.estimatedPay)}
      </td>
      <td className="px-3 py-3 text-right text-slate-700">{record.payrollStatus}</td>
    </tr>
  );
}
