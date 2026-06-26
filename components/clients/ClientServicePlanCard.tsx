import {
  getFrequencyLabel,
  getNextServiceDates,
  getWeekdayLabel,
} from '@/domain/schedule/recurrence';
import type { MockClientServicePlan } from '@/domain/schedule/types';

type ClientServicePlanCardProps = {
  plan: MockClientServicePlan;
  referenceDate: Date;
};

export function ClientServicePlanCard({
  plan,
  referenceDate,
}: ClientServicePlanCardProps) {
  const nextDate = getNextServiceDates(plan, referenceDate, 1)[0] ?? 'Sin fecha';
  const weekdayLabels = plan.weekdays.map(getWeekdayLabel).join(', ');

  return (
    <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          {getFrequencyLabel(plan.frequencyType)}
        </span>
        <span className="text-sm font-medium text-slate-600">{weekdayLabels}</span>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Hora</dt>
          <dd className="font-medium text-slate-950">{plan.startTime ?? 'Sin hora'}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Próxima visita</dt>
          <dd className="font-medium text-slate-950">{nextDate}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Horas</dt>
          <dd className="font-medium text-slate-950">{plan.defaultHours}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Personas</dt>
          <dd className="font-medium text-slate-950">{plan.defaultPeopleCount}</dd>
        </div>
      </dl>
    </article>
  );
}
