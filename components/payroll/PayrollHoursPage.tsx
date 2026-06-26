'use client';

import { useMemo, useState } from 'react';

import { groupPayrollHours } from '@/domain/payroll/group-payroll-hours';
import { mockPayrollHourRecords } from '@/domain/payroll/mock-payroll';

import { PayrollEmployeeGroup } from './PayrollEmployeeGroup';
import { PayrollPeriodFilter } from './PayrollPeriodFilter';
import { PayrollSummaryCard } from './PayrollSummaryCard';

export function PayrollHoursPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Primera quincena');
  const groupedPayroll = useMemo(
    () => groupPayrollHours(mockPayrollHourRecords),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">CleanOps</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
              Horas para nómina
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Horas registradas por empleado para preparar pagos internos.
            </p>
          </div>
          <PayrollPeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </header>

        <PayrollSummaryCard totals={groupedPayroll.totals} />

        <div className="flex flex-col gap-5">
          {groupedPayroll.employeeGroups.map((group) => (
            <PayrollEmployeeGroup key={group.employeeId} group={group} />
          ))}
        </div>
      </div>
    </main>
  );
}
