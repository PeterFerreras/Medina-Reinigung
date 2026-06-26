import type { MockClient } from '@/domain/clients/types';
import { getNextServiceDates } from '@/domain/schedule/recurrence';
import type { MockClientServicePlan } from '@/domain/schedule/types';

import { ClientServicePlanCard } from './ClientServicePlanCard';

type ClientCardProps = {
  client: MockClient;
  plans: MockClientServicePlan[];
  referenceDate: Date;
  onSelect: (clientId: string) => void;
  onEdit: (client: MockClient) => void;
};

function getNextVisit(plans: MockClientServicePlan[], referenceDate: Date): string {
  const nextDates = plans
    .flatMap((plan) => getNextServiceDates(plan, referenceDate, 1))
    .sort((first, second) => first.localeCompare(second));

  return nextDates[0] ?? 'Sin visita programada';
}

export function ClientCard({
  client,
  plans,
  referenceDate,
  onSelect,
  onEdit,
}: ClientCardProps) {
  const activePlans = plans.filter((plan) => plan.active);

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{client.displayName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {[client.email, client.phone, client.city].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {client.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Planes activos</dt>
          <dd className="mt-1 font-semibold text-slate-950">{activePlans.length}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Próxima visita</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {getNextVisit(activePlans, referenceDate)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-3">
        {activePlans.map((plan) => (
          <ClientServicePlanCard key={plan.id} plan={plan} referenceDate={referenceDate} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => onSelect(client.id)}
        >
          Ver planes
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => onEdit(client)}
        >
          Editar
        </button>
      </div>
    </article>
  );
}
