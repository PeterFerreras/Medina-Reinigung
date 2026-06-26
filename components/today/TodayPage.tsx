'use client';

import { useEffect, useState } from 'react';

import type { MockEmployee } from '@/domain/employees/types';
import type { MockServiceVisit, VisitStatus } from '@/domain/visits/types';

import { VisitRegistrationForm } from '../visits/VisitRegistrationForm';
import { DateNavigator } from './DateNavigator';
import { VisitStatusGroup } from './VisitStatusGroup';

type TodayPageProps = {
  visits: MockServiceVisit[];
  employees: MockEmployee[];
  initialSelectedDate: string;
  isUsingTestData: boolean;
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

export function TodayPage({
  visits,
  employees,
  initialSelectedDate,
  isUsingTestData,
}: TodayPageProps) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [currentVisits, setCurrentVisits] = useState(visits);

  useEffect(() => {
    setCurrentVisits(visits);
  }, [visits]);

  const visitsForDate = getVisitsForDate(currentVisits, selectedDate);
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

  const handleVisitSaved = (updatedVisit: MockServiceVisit) => {
    setCurrentVisits((existingVisits) => {
      const updatedServicePlanId = updatedVisit.servicePlanId;
      const updatedVisitExists = existingVisits.some((visit) => visit.id === updatedVisit.id);

      if (updatedVisitExists) {
        return existingVisits.map((visit) =>
          visit.id === updatedVisit.id ? updatedVisit : visit,
        );
      }

      return existingVisits.map((visit) => {
        const matchesPlannedVisit =
          visit.isPersisted === false &&
          updatedServicePlanId &&
          visit.servicePlanId === updatedServicePlanId &&
          visit.scheduledDate === updatedVisit.scheduledDate;

        return matchesPlannedVisit ? updatedVisit : visit;
      });
    });
    setSelectedVisitId(updatedVisit.id);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedVisitId(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
              {isUsingTestData ? (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                  Datos de prueba
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Hoy</h1>
            <p className="mt-2 text-sm text-slate-600">{formatSelectedDate(selectedDate)}</p>
          </div>
          <DateNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />
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
            {visitsForDate.length === 0 ? (
              <section className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                No hay visitas programadas para esta fecha.
              </section>
            ) : (
              statusGroups.map((group) => (
                <VisitStatusGroup
                  key={group.status}
                  title={group.title}
                  visits={getVisitsByStatus(visitsForDate, group.status)}
                  onVisitAction={handleVisitAction}
                />
              ))
            )}
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            {selectedVisit ? (
              <VisitRegistrationForm
                key={`${selectedVisit.id}-${selectedVisit.status}-${selectedVisit.employeeHours?.map((entry) => `${entry.employeeId}:${entry.hoursWorked}`).join('|') ?? ''}`}
                visit={selectedVisit}
                employees={employees}
                canPersistVisit={!isUsingTestData}
                onVisitSaved={handleVisitSaved}
              />
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
