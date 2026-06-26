'use client';

import { useMemo, useState } from 'react';

import { calculateEmployeePay, calculateVisitTotals } from '@/domain/calculations';
import { mockEmployees } from '@/domain/employees/mock-employees';
import type { MockEmployee } from '@/domain/employees/types';
import type { MockServiceVisit } from '@/domain/visits/types';

import { DetailedEmployeeHours } from './DetailedEmployeeHours';
import { EmployeeSelector } from './EmployeeSelector';
import { QuickHoursInput } from './QuickHoursInput';
import { VisitCalculationSummary } from './VisitCalculationSummary';

type RegistrationMode = 'quick' | 'detailed';

type VisitRegistrationFormProps = {
  visit: MockServiceVisit;
};

function getSelectedEmployees(selectedEmployeeIds: string[]): MockEmployee[] {
  return mockEmployees.filter((employee) => selectedEmployeeIds.includes(employee.id));
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

export function VisitRegistrationForm({ visit }: VisitRegistrationFormProps) {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [mode, setMode] = useState<RegistrationMode>('quick');
  const [quickHours, setQuickHours] = useState(visit.defaultHours);
  const [detailedHours, setDetailedHours] = useState<Record<string, number>>({});

  const selectedEmployees = useMemo(
    () => getSelectedEmployees(selectedEmployeeIds),
    [selectedEmployeeIds],
  );
  const employeeHours = getEmployeeHours(selectedEmployees, mode, quickHours, detailedHours);
  const totals = calculateVisitTotals({
    visitStatus: visit.status,
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

  const handleSave = () => {
    console.log('Save visit registration', {
      visitId: visit.id,
      mode,
      employees: employeePays.map((item) => ({
        employeeId: item.employee.id,
        hours: item.hours,
        estimatedPay: item.estimatedPay,
      })),
      totals,
    });
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
          employees={mockEmployees}
          selectedEmployeeIds={selectedEmployeeIds}
          onToggleEmployee={handleToggleEmployee}
        />

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

        <button
          type="button"
          className="w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          onClick={handleSave}
        >
          Guardar registro
        </button>
      </div>
    </section>
  );
}
