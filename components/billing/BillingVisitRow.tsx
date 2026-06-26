import type { BillingVisitLine } from '@/domain/billing/types';

type BillingVisitRowProps = {
  visit: BillingVisitLine;
};

function formatCurrency(value: number): string {
  return `CHF ${value.toFixed(2)}`;
}

export function BillingVisitRow({ visit }: BillingVisitRowProps) {
  const employees =
    visit.employeeNames.length > 0
      ? visit.employeeNames.join(', ')
      : `${visit.peopleCount} personas`;

  return (
    <tr className="border-t border-slate-200 text-sm">
      <td className="px-3 py-3 text-slate-700">{visit.serviceDate}</td>
      <td className="px-3 py-3">
        <p className="font-medium text-slate-950">{visit.description}</p>
        <p className="mt-1 text-xs text-slate-500">{employees}</p>
      </td>
      <td className="px-3 py-3 text-right text-slate-700">{visit.billableHours}</td>
      <td className="px-3 py-3 text-right text-slate-700">
        {formatCurrency(visit.clientHourlyRate)}
      </td>
      <td className="px-3 py-3 text-right text-slate-700">{formatCurrency(visit.subtotal)}</td>
      <td className="px-3 py-3 text-right text-slate-700">{formatCurrency(visit.vatAmount)}</td>
      <td className="px-3 py-3 text-right font-semibold text-slate-950">
        {formatCurrency(visit.total)}
      </td>
    </tr>
  );
}
