import type { MockEmployee } from '@/domain/employees/types';

type EmployeeSelectorProps = {
  employees: MockEmployee[];
  selectedEmployeeIds: string[];
  onToggleEmployee: (employeeId: string) => void;
};

export function EmployeeSelector({
  employees,
  selectedEmployeeIds,
  onToggleEmployee,
}: EmployeeSelectorProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-slate-950">Empleados</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {employees.map((employee) => {
          const isSelected = selectedEmployeeIds.includes(employee.id);

          return (
            <label
              key={employee.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm shadow-sm ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleEmployee(employee.id)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700"
              />
              <span className="flex flex-col">
                <span className="font-medium">{employee.name}</span>
                <span className="text-xs text-slate-500">
                  {employee.initials} · CHF {employee.hourlyPayRate.toFixed(2)}/h
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
