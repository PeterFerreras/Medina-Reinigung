import type { MockClient } from '@/domain/clients/types';
import type { MockClientServicePlan } from '@/domain/schedule/types';

import { ClientServicePlanCard } from './ClientServicePlanCard';

type ClientDetailPanelProps = {
  client: MockClient | null;
  plans: MockClientServicePlan[];
  referenceDate: Date;
  onNewPlan: () => void;
  onEditPlan: (plan: MockClientServicePlan) => void;
};

export function ClientDetailPanel({
  client,
  plans,
  referenceDate,
  onNewPlan,
  onEditPlan,
}: ClientDetailPanelProps) {
  if (!client) {
    return (
      <aside className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Selecciona un cliente para ver sus planes.
      </aside>
    );
  }

  return (
    <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">Detalle</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{client.displayName}</h2>
        </div>
        <button
          type="button"
          className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
          onClick={onNewPlan}
        >
          Nuevo plan
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan.id} className="grid gap-2">
              <ClientServicePlanCard plan={plan} referenceDate={referenceDate} />
              <button
                type="button"
                className="w-fit rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => onEditPlan(plan)}
              >
                Editar plan
              </button>
            </div>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Este cliente aún no tiene planes.
          </p>
        )}
      </div>
    </aside>
  );
}
