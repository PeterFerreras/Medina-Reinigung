'use client';

import { useState } from 'react';

import type { MockClientServicePlan } from '@/domain/schedule/types';

import { FrequencySelector } from './FrequencySelector';
import { WeekdaySelector } from './WeekdaySelector';

type ServicePlanFormProps = {
  clientId: string;
  plan?: MockClientServicePlan;
  onSave: (plan: MockClientServicePlan) => void;
  onCancel: () => void;
};

type ServicePlanFormState = Omit<MockClientServicePlan, 'id' | 'clientId'>;

function getInitialState(plan?: MockClientServicePlan): ServicePlanFormState {
  return {
    frequencyType: plan?.frequencyType ?? 'WEEKLY',
    weekdays: plan?.weekdays ?? [],
    recurrenceStartDate: plan?.recurrenceStartDate ?? '2026-06-01',
    startTime: plan?.startTime ?? '09:00',
    defaultHours: plan?.defaultHours ?? 3,
    defaultPeopleCount: plan?.defaultPeopleCount ?? 1,
    clientHourlyRate: plan?.clientHourlyRate ?? 50,
    vatRate: plan?.vatRate ?? 8.1,
    billingNotes: plan?.billingNotes ?? '',
    operationalNotes: plan?.operationalNotes ?? '',
    active: plan?.active ?? true,
  };
}

export function ServicePlanForm({
  clientId,
  plan,
  onSave,
  onCancel,
}: ServicePlanFormProps) {
  const [formState, setFormState] = useState<ServicePlanFormState>(() => getInitialState(plan));
  const [error, setError] = useState<string | null>(null);

  const updateField = <Field extends keyof ServicePlanFormState>(
    field: Field,
    value: ServicePlanFormState[Field],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.weekdays.length === 0) {
      setError('Selecciona al menos un día.');
      return;
    }

    if (
      formState.defaultHours <= 0 ||
      formState.defaultPeopleCount <= 0 ||
      formState.clientHourlyRate <= 0 ||
      formState.vatRate < 0
    ) {
      setError('Horas, personas y tarifa deben ser valores positivos.');
      return;
    }

    const payload: MockClientServicePlan = {
      id: plan?.id ?? `plan-${Date.now()}`,
      clientId,
      ...formState,
      billingNotes: formState.billingNotes?.trim() || undefined,
      operationalNotes: formState.operationalNotes?.trim() || undefined,
    };

    console.log('Save service plan mock', payload);
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {plan ? 'Editar plan' : 'Nuevo plan'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">Plan recurrente mock.</p>
        </div>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>

      {error ? <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-4 grid gap-3">
        <FrequencySelector
          value={formState.frequencyType}
          onChange={(frequencyType) => updateField('frequencyType', frequencyType)}
        />
        {formState.frequencyType === 'BIWEEKLY' ? (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            La fecha base define el ciclo de cada 14 días. Si el plan tocó ese lunes, vuelve a
            tocar el lunes 14 días después.
          </p>
        ) : null}
        <WeekdaySelector
          selectedWeekdays={formState.weekdays}
          onChange={(weekdays) => updateField('weekdays', weekdays)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Fecha base de recurrencia
            <input
              type="date"
              value={formState.recurrenceStartDate}
              onChange={(event) => updateField('recurrenceStartDate', event.target.value)}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Hora estimada
            <input
              type="time"
              value={formState.startTime}
              onChange={(event) => updateField('startTime', event.target.value)}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Horas normales
            <input
              type="number"
              min="0"
              step="0.25"
              value={formState.defaultHours}
              onChange={(event) => updateField('defaultHours', Number(event.target.value))}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Personas normales
            <input
              type="number"
              min="1"
              step="1"
              value={formState.defaultPeopleCount}
              onChange={(event) => updateField('defaultPeopleCount', Number(event.target.value))}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Tarifa por hora
            <input
              type="number"
              min="0"
              step="0.05"
              value={formState.clientHourlyRate}
              onChange={(event) => updateField('clientHourlyRate', Number(event.target.value))}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            IVA
            <input
              type="number"
              min="0"
              step="0.1"
              value={formState.vatRate}
              onChange={(event) => updateField('vatRate', Number(event.target.value))}
              className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Notas operativas
            <textarea
              value={formState.operationalNotes}
              onChange={(event) => updateField('operationalNotes', event.target.value)}
              className="min-h-20 rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Notas de facturación
            <textarea
              value={formState.billingNotes}
              onChange={(event) => updateField('billingNotes', event.target.value)}
              className="min-h-20 rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={formState.active}
              onChange={(event) => updateField('active', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700"
            />
            Activo
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
      >
        Guardar plan
      </button>
    </form>
  );
}
