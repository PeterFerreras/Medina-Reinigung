import type { MockClient } from '@/domain/clients/types';
import { getFrequencyLabel } from '@/domain/schedule/recurrence';
import type { UpcomingService } from '@/domain/schedule/types';

type UpcomingServicesListProps = {
  services: UpcomingService[];
  clientsById: Map<string, MockClient>;
};

export function UpcomingServicesList({
  services,
  clientsById,
}: UpcomingServicesListProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Próximos servicios</h2>
      <div className="mt-4 grid gap-2">
        {services.slice(0, 15).map((service) => {
          const client = clientsById.get(service.plan.clientId);

          return (
            <article
              key={`${service.plan.id}-${service.serviceDate}`}
              className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:grid-cols-[8rem_1fr_auto]"
            >
              <span className="font-semibold text-slate-950">{service.serviceDate}</span>
              <span className="text-slate-700">
                {client?.displayName ?? 'Cliente desconocido'}
              </span>
              <span className="font-medium text-emerald-700">
                {getFrequencyLabel(service.plan.frequencyType)}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
