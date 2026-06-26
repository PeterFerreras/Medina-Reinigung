import type { VisitStatus } from '@/domain/visits/types';

const statusStyles: Record<VisitStatus, string> = {
  SCHEDULED: 'border-sky-200 bg-sky-50 text-sky-800',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-800',
  RESCHEDULED: 'border-amber-200 bg-amber-50 text-amber-800',
  NO_BILLABLE: 'border-slate-200 bg-slate-100 text-slate-700',
  NEEDS_REVIEW: 'border-violet-200 bg-violet-50 text-violet-800',
};

const statusLabels: Record<VisitStatus, string> = {
  SCHEDULED: 'Pendiente',
  COMPLETED: 'Realizado',
  CANCELLED: 'Cancelado',
  RESCHEDULED: 'Reprogramado',
  NO_BILLABLE: 'No facturable',
  NEEDS_REVIEW: 'Revisar',
};

type VisitStatusBadgeProps = {
  status: VisitStatus;
};

export function VisitStatusBadge({ status }: VisitStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
