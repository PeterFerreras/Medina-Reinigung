import type { MockServiceVisit, VisitFrequency } from '@/domain/visits/types';

import { VisitStatusBadge } from './VisitStatusBadge';

const frequencyLabels: Record<VisitFrequency, string> = {
  ONE_TIME: 'Unico',
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
  MULTIPLE_DAYS_PER_WEEK: 'Varios dias/semana',
  MONTHLY: 'Mensual',
  CUSTOM: 'Personalizado',
};

type VisitAction = 'register' | 'cancel' | 'no-billable' | 'note';

type ServiceVisitCardProps = {
  visit: MockServiceVisit;
  onAction: (visitId: string, action: VisitAction) => void;
};

function getRegistrationButtonLabel(visit: MockServiceVisit): string {
  if (visit.isPersisted === false) {
    return 'Registrar';
  }

  if (
    visit.status === 'COMPLETED' ||
    visit.status === 'NO_BILLABLE' ||
    visit.status === 'CANCELLED'
  ) {
    return 'Editar registro';
  }

  return 'Registrar';
}

export function ServiceVisitCard({ visit, onAction }: ServiceVisitCardProps) {
  const actionButtonClass =
    'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50';

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{visit.clientName}</h3>
          <p className="mt-1 text-sm text-slate-600">{visit.estimatedTime}</p>
        </div>
        <VisitStatusBadge status={visit.status} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="font-medium text-slate-500">Frecuencia</dt>
          <dd className="mt-1 text-slate-900">{frequencyLabels[visit.frequency]}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Horas normales</dt>
          <dd className="mt-1 text-slate-900">{visit.defaultHours}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Personas</dt>
          <dd className="mt-1 text-slate-900">{visit.defaultPeopleCount}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Tarifa/hora</dt>
          <dd className="mt-1 text-slate-900">CHF {visit.clientHourlyRate.toFixed(2)}</dd>
        </div>
      </dl>

      {visit.notes ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {visit.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={actionButtonClass}
          onClick={() => onAction(visit.id, 'register')}
        >
          {getRegistrationButtonLabel(visit)}
        </button>
        <button
          type="button"
          className={actionButtonClass}
          onClick={() => onAction(visit.id, 'cancel')}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={actionButtonClass}
          onClick={() => onAction(visit.id, 'no-billable')}
        >
          No facturable
        </button>
        <button
          type="button"
          className={actionButtonClass}
          onClick={() => onAction(visit.id, 'note')}
        >
          Nota
        </button>
      </div>
    </article>
  );
}
