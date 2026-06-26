'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { registerVisitAction } from '@/app/actions/register-visit';
import { calculateEmployeePay, calculateVisitTotals } from '@/domain/calculations';
import type { MockEmployee } from '@/domain/employees/types';
import type { MockServiceVisit } from '@/domain/visits/types';
import type { RegisterVisitStatus } from '@/services/visits/visit-registration-schema';

import { DetailedEmployeeHours } from './DetailedEmployeeHours';
import { EmployeeSelector } from './EmployeeSelector';
import { QuickHoursInput } from './QuickHoursInput';
import { VisitCalculationSummary } from './VisitCalculationSummary';

type RegistrationMode = 'quick' | 'detailed';

type VisitRegistrationFormProps = {
  visit: MockServiceVisit;
  employees: MockEmployee[];
  canPersistVisit: boolean;
  onVisitSaved: (visit: MockServiceVisit) => void;
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const registrationStatuses: Array<{ value: RegisterVisitStatus; label: string }> = [
  { value: 'COMPLETED', label: 'Realizada' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'NO_BILLABLE', label: 'No facturable' },
];

function getSelectedEmployees(
  employees: MockEmployee[],
  selectedEmployeeIds: string[],
): MockEmployee[] {
  return employees.filter((employee) => selectedEmployeeIds.includes(employee.id));
}

function getEmployeeHours(
  selectedEmployees: MockEmployee[],
  mode: RegistrationMode,
  quickHours: number,
  detailedHours: Record<string, number>,
): number[] {
  return selectedEmployees.map((employee) =>
    mode === 'quick' ? quickHours : detailedHours[employee.id] ?? 0,
  );
}

function getInitialStatus(visit: MockServiceVisit): RegisterVisitStatus {
  return visit.status === 'CANCELLED' || visit.status === 'NO_BILLABLE'
    ? visit.status
    : 'COMPLETED';
}

function getInitialDetailedHours(visit: MockServiceVisit): Record<string, number> {
  return Object.fromEntries(
    (visit.employeeHours ?? []).map((entry) => [entry.employeeId, entry.hoursWorked]),
  );
}

export function VisitRegistrationForm({
  visit,
  employees,
  canPersistVisit,
  onVisitSaved,
}: VisitRegistrationFormProps) {
  const router = useRouter();
  const savedEmployeeHours = visit.employeeHours ?? [];
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    savedEmployeeHours.map((entry) => entry.employeeId),
  );
  const [registrationStatus, setRegistrationStatus] =
    useState<RegisterVisitStatus>(getInitialStatus(visit));
  const [mode, setMode] = useState<RegistrationMode>(
    savedEmployeeHours.length > 0 ? 'detailed' : 'quick',
  );
  const [quickHours, setQuickHours] = useState(
    savedEmployeeHours[0]?.hoursWorked ?? visit.defaultHours,
  );
  const [detailedHours, setDetailedHours] = useState<Record<string, number>>(
    getInitialDetailedHours(visit),
  );
  const [notes, setNotes] = useState(visit.notes ?? '');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const selectedEmployees = useMemo(
    () => getSelectedEmployees(employees, selectedEmployeeIds),
    [employees, selectedEmployeeIds],
  );
  const employeeHours = getEmployeeHours(selectedEmployees, mode, quickHours, detailedHours);
  const totals = calculateVisitTotals({
    visitStatus: registrationStatus,
    employeeHours,
    clientHourlyRate: visit.clientHourlyRate,
    vatRate: visit.vatRate,
  });
  const employeePays = selectedEmployees.map((employee, index) => {
    const hours = employeeHours[index] ?? 0;

    return {
      employee,
      hours,
      estimatedPay: calculateEmployeePay(hours, employee.hourlyPayRate),
    };
  });

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds((currentIds) =>
      currentIds.includes(employeeId)
        ? currentIds.filter((id) => id !== employeeId)
        : [...currentIds, employeeId],
    );
  };

  const handleDetailedHoursChange = (employeeId: string, hours: number) => {
    setDetailedHours((currentHours) => ({
      ...currentHours,
      [employeeId]: hours,
    }));
  };

  const handleSave = async () => {
    setSaveState('saving');
    setSaveError(null);

    const payload = {
      visitId: visit.id,
      servicePlanId: visit.servicePlanId,
      scheduledDate: visit.scheduledDate,
      status: registrationStatus,
      employeeHours: selectedEmployees.map((employee, index) => ({
        employeeId: employee.id,
        hoursWorked: employeeHours[index] ?? 0,
      })),
      notes: notes.trim() ? notes.trim() : undefined,
    };
    const updatedVisit: MockServiceVisit = {
      ...visit,
      id: visit.isPersisted === false ? visit.id : visit.id,
      status: registrationStatus,
      notes: payload.notes,
      employeeHours: payload.employeeHours,
      isPersisted: canPersistVisit ? true : visit.isPersisted,
    };

    if (canPersistVisit) {
      const result = await registerVisitAction(payload);

      if (!result.ok) {
        setSaveState('error');
        setSaveError(result.error);
        return;
      }

      onVisitSaved({
        ...updatedVisit,
        id: result.visitId,
        isPersisted: true,
      });
      setSaveState('saved');
      router.refresh();
      return;
    }

    console.log('Save visit registration', {
      mode,
      ...payload,
      employees: employeePays,
      totals,
    });
    onVisitSaved(updatedVisit);
    setSaveState('saved');
  };

  return (
    <section className="rounded-md border border-emerald-200 bg-white p-4 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-sm font-semibold uppercase text-emerald-700">Registro rápido</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{visit.clientName}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Fecha</dt>
            <dd className="mt-1 text-slate-950">{visit.scheduledDate}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Estado</dt>
            <dd className="mt-1 text-slate-950">{visit.status}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Tarifa cliente</dt>
            <dd className="mt-1 text-slate-950">CHF {visit.clientHourlyRate.toFixed(2)}/h</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">IVA</dt>
            <dd className="mt-1 text-slate-950">{visit.vatRate}%</dd>
          </div>
        </dl>
        {visit.notes ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {visit.notes}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-5">
        <EmployeeSelector
          employees={employees}
          selectedEmployeeIds={selectedEmployeeIds}
          onToggleEmployee={handleToggleEmployee}
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-slate-950">Estado del registro</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {registrationStatuses.map((status) => (
              <button
                key={status.value}
                type="button"
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  registrationStatus === status.value
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
                onClick={() => setRegistrationStatus(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              mode === 'quick'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
            onClick={() => setMode('quick')}
          >
            Modo rápido
          </button>
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              mode === 'detailed'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
            onClick={() => setMode('detailed')}
          >
            Modo detallado
          </button>
        </div>

        {mode === 'quick' ? (
          <QuickHoursInput hours={quickHours} onHoursChange={setQuickHours} />
        ) : (
          <DetailedEmployeeHours
            employees={selectedEmployees}
            hoursByEmployeeId={detailedHours}
            onEmployeeHoursChange={handleDetailedHoursChange}
          />
        )}

        <VisitCalculationSummary totals={totals} employeePays={employeePays} />

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nota
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm"
          />
        </label>

        {saveState === 'saved' ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            Guardado correctamente.
          </p>
        ) : null}
        {saveState === 'error' ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            {saveError ?? 'Error al guardar.'}
          </p>
        ) : null}

        <button
          type="button"
          className="w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={handleSave}
          disabled={saveState === 'saving'}
        >
          {saveState === 'saving' ? 'Guardando...' : 'Guardar registro'}
        </button>
      </div>
    </section>
  );
}
