import type { MockClient } from '@/domain/clients/types';
import {
  getUpcomingServices,
  groupPlansByWeekday,
  weekdays,
} from '@/domain/schedule/recurrence';
import type { MockClientServicePlan } from '@/domain/schedule/types';

import { UpcomingServicesList } from './UpcomingServicesList';
import { WeekdayColumn } from './WeekdayColumn';

type WeeklySchedulePageProps = {
  clients: MockClient[];
  servicePlans: MockClientServicePlan[];
};

export function WeeklySchedulePage({ clients, servicePlans }: WeeklySchedulePageProps) {
  const referenceDate = new Date();
  const groupedPlans = groupPlansByWeekday(servicePlans);
  const clientsById = new Map(clients.map((client) => [client.id, client]));
  const upcomingServices = getUpcomingServices(servicePlans, referenceDate, 30);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
            Agenda semanal
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Planes recurrentes organizados por día de la semana.
          </p>
        </header>

        <section className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {weekdays.map((weekday) => (
            <WeekdayColumn
              key={weekday}
              weekday={weekday}
              plans={groupedPlans[weekday]}
              clientsById={clientsById}
              referenceDate={referenceDate}
            />
          ))}
        </section>

        <UpcomingServicesList services={upcomingServices} clientsById={clientsById} />
      </div>
    </main>
  );
}
