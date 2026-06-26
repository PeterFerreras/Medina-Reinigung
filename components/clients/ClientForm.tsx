'use client';

import { useState } from 'react';

import type { ClientStatus, MockClient } from '@/domain/clients/types';

type ClientFormProps = {
  client?: MockClient;
  onSave: (client: MockClient) => void;
  onCancel: () => void;
};

type ClientFormState = {
  displayName: string;
  contactType: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  country: string;
  language: string;
  status: ClientStatus;
  remarks: string;
};

function getInitialState(client?: MockClient): ClientFormState {
  return {
    displayName: client?.displayName ?? '',
    contactType: client?.contactType ?? 'Empresa',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    mobile: client?.mobile ?? '',
    address: client?.address ?? '',
    city: client?.city ?? '',
    country: client?.country ?? 'CH',
    language: client?.language ?? 'DE',
    status: client?.status ?? 'ACTIVE',
    remarks: client?.remarks ?? '',
  };
}

function isValidEmail(email: string): boolean {
  return email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [formState, setFormState] = useState<ClientFormState>(() => getInitialState(client));
  const [error, setError] = useState<string | null>(null);

  const updateField = <Field extends keyof ClientFormState>(
    field: Field,
    value: ClientFormState[Field],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.displayName.trim().length === 0) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!isValidEmail(formState.email)) {
      setError('El email no tiene un formato válido.');
      return;
    }

    const payload: MockClient = {
      id: client?.id ?? `client-${Date.now()}`,
      displayName: formState.displayName.trim(),
      contactType: formState.contactType.trim(),
      email: formState.email.trim() || undefined,
      phone: formState.phone.trim() || undefined,
      mobile: formState.mobile.trim() || undefined,
      address: formState.address.trim() || undefined,
      city: formState.city.trim() || undefined,
      country: formState.country.trim() || undefined,
      language: formState.language.trim() || undefined,
      status: formState.status,
      remarks: formState.remarks.trim() || undefined,
    };

    console.log('Save client mock', payload);
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {client ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Datos mock en estado local.</p>
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Nombre
          <input
            value={formState.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Tipo
          <input
            value={formState.contactType}
            onChange={(event) => updateField('contactType', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={formState.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Teléfono
          <input
            value={formState.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Móvil
          <input
            value={formState.mobile}
            onChange={(event) => updateField('mobile', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Dirección
          <input
            value={formState.address}
            onChange={(event) => updateField('address', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Ciudad
          <input
            value={formState.city}
            onChange={(event) => updateField('city', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          País
          <input
            value={formState.country}
            onChange={(event) => updateField('country', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Idioma
          <input
            value={formState.language}
            onChange={(event) => updateField('language', event.target.value)}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Estado
          <select
            value={formState.status}
            onChange={(event) => updateField('status', event.target.value as ClientStatus)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm"
          >
            <option value="ACTIVE">Activo</option>
            <option value="PAUSED">Pausado</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Notas
          <textarea
            value={formState.remarks}
            onChange={(event) => updateField('remarks', event.target.value)}
            className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
      >
        Guardar cliente
      </button>
    </form>
  );
}
