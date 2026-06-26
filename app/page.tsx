'use client';

import { useState } from 'react';

import { PendingBillingPage } from '@/components/billing/PendingBillingPage';
import { TodayPage } from '@/components/today/TodayPage';

type ActiveView = 'today' | 'billing';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('today');

  return (
    <>
      <nav className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${
              activeView === 'today'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveView('today')}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${
              activeView === 'billing'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveView('billing')}
          >
            Pendiente de facturar
          </button>
        </div>
      </nav>

      {activeView === 'today' ? <TodayPage /> : <PendingBillingPage />}
    </>
  );
}
