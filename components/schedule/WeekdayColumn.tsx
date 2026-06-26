import type { MockClient } from '@/domain/clients/types';
import {
  getFrequencyLabel,
  getNextServiceDates,
  getWeekdayLabel,
} from '@/domain/schedule/recurrence';
import type { MockClientServicePlan, Weekday } from '@/domain/schedule/types';

import { ServicePlanBadge } from './ServicePlanBadge';

type WeekdayColumnProps = {
  weekday: Weekday;
  plans: MockClientServicePlan[];
  clientsById: Map<string, MockClient>;
  referenceDate: Date;
};

export function WeekdayColumn({
  weekday,
  plans,
  clientsById,
  referenceDate,
}: WeekdayColumnProps) {
  return (
    <section className="min-h-40 rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{getWeekdayLabel(weekday)}</h2>
      <div className="mt-3 flex flex-col gap-3">
        {plans.length > 0 ? (
          plans.map((plan) => {
            const client = clientsById.get(plan.clientId);
            const nextDate = getNextServiceDates(plan, referenceDate, 1)[0] ?? 'Sin fecha';

            return (
              <article key={plan.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <ServicePlanBadge frequencyType={plan.frequencyType} />
                  <span className="text-xs font-medium text-slate-500">
                    {getFrequencyLabel(plan.frequencyType)}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-slate-950">
                  {client?.displayName ?? 'Cliente desconocido'}
                </h3>
                <dl className="mt-3 grid gap-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Hora</dt>
                    <dd className="font-medium text-slate-950">{plan.startTime ?? 'Sin hora'}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Horas</dt>
                    <dd className="font-medium text-slate-950">{plan.defaultHours}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Personas</dt>
                    <dd className="font-medium text-slate-950">{plan.defaultPeopleCount}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Tarifa</dt>
                    <dd className="font-medium text-slate-950">
                      CHF {plan.clientHourlyRate.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Próxima fecha</dt>
                    <dd className="font-medium text-slate-950">{nextDate}</dd>
                  </div>
                </dl>
              </article>
            );
          })
        ) : (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
            Sin servicios.
          </p>
        )}
      </div>
    </section>
  );
}
