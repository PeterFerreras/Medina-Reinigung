import type { MockServiceVisit } from '@/domain/visits/types';

import { ServiceVisitCard } from './ServiceVisitCard';

type VisitStatusGroupProps = {
  title: string;
  visits: MockServiceVisit[];
  onVisitAction: (visitId: string, action: 'register' | 'cancel' | 'no-billable' | 'note') => void;
};

export function VisitStatusGroup({
  title,
  visits,
  onVisitAction,
}: VisitStatusGroupProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        <span className="text-sm font-medium text-slate-500">{visits.length}</span>
      </div>

      {visits.length > 0 ? (
        <div className="grid gap-3">
          {visits.map((visit) => (
            <ServiceVisitCard key={visit.id} visit={visit} onAction={onVisitAction} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
          Sin visitas en este estado.
        </p>
      )}
    </section>
  );
}
