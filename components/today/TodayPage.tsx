'use client';

import { useMemo, useState } from 'react';

import { createMockVisits, toDateKey } from '@/domain/visits/mock-visits';
import type { MockServiceVisit, VisitStatus } from '@/domain/visits/types';

import { VisitRegistrationForm } from '../visits/VisitRegistrationForm';
import { DateNavigator } from './DateNavigator';
import { VisitStatusGroup } from './VisitStatusGroup';

type TodayPageProps = {
  initialVisits?: MockServiceVisit[];
};

const statusGroups: Array<{ status: VisitStatus; title: string }> = [
  { status: 'SCHEDULED', title: 'Pendientes' },
  { status: 'COMPLETED', title: 'Realizados' },
  { status: 'CANCELLED', title: 'Cancelados' },
  { status: 'NO_BILLABLE', title: 'No facturables' },
  { status: 'NEEDS_REVIEW', title: 'Requieren revisión' },
];

function countByStatus(visits: MockServiceVisit[], status: VisitStatus): number {
  return visits.filter((visit) => visit.status === status).length;
}

function getVisitsForDate(
  visits: MockServiceVisit[],
  selectedDate: string,
): MockServiceVisit[] {
  return visits.filter((visit) => visit.scheduledDate === selectedDate);
}

function getVisitsByStatus(
  visits: MockServiceVisit[],
  status: VisitStatus,
): MockServiceVisit[] {
  return visits.filter((visit) => visit.status === status);
}

function formatSelectedDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CH', {
    dateStyle: 'full',
  }).format(new Date(year, month - 1, day));
}

export function TodayPage({ initialVisits = [] }: TodayPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const visits = useMemo(
    () => (initialVisits.length > 0 ? initialVisits : createMockVisits()),
    [initialVisits],
  );
  const visitsForDate = getVisitsForDate(visits, selectedDate);
  const selectedVisit = visitsForDate.find((visit) => visit.id === selectedVisitId);
  const summaryItems = [
    { label: 'Pendientes', value: countByStatus(visitsForDate, 'SCHEDULED') },
    { label: 'Realizadas', value: countByStatus(visitsForDate, 'COMPLETED') },
    { label: 'Canceladas', value: countByStatus(visitsForDate, 'CANCELLED') },
    { label: 'No facturables', value: countByStatus(visitsForDate, 'NO_BILLABLE') },
  ];

  const handleVisitAction = (
    visitId: string,
    action: 'register' | 'cancel' | 'no-billable' | 'note',
  ) => {
    if (action === 'register') {
      setSelectedVisitId(visitId);
      return;
    }

    console.log('Visit action', { visitId, action });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Hoy</h1>
            <p className="mt-2 text-sm text-slate-600">{formatSelectedDate(selectedDate)}</p>
          </div>
          <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen del día">
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div className="grid gap-6">
            {statusGroups.map((group) => (
              <VisitStatusGroup
                key={group.status}
                title={group.title}
                visits={getVisitsByStatus(visitsForDate, group.status)}
                onVisitAction={handleVisitAction}
              />
            ))}
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            {selectedVisit ? (
              <VisitRegistrationForm visit={selectedVisit} />
            ) : (
              <section className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Selecciona Registrar en una visita para cargar el formulario.
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
