import type { MockEmployee } from '@/domain/employees/types';

type DetailedEmployeeHoursProps = {
  employees: MockEmployee[];
  hoursByEmployeeId: Record<string, number>;
  onEmployeeHoursChange: (employeeId: string, hours: number) => void;
};

export function DetailedEmployeeHours({
  employees,
  hoursByEmployeeId,
  onEmployeeHoursChange,
}: DetailedEmployeeHoursProps) {
  return (
    <div className="grid gap-3">
      {employees.map((employee) => (
        <label
          key={employee.id}
          className="grid gap-2 rounded-md border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 sm:grid-cols-[1fr_8rem] sm:items-center"
        >
          <span>{employee.name}</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={hoursByEmployeeId[employee.id] ?? 0}
            onChange={(event) => onEmployeeHoursChange(employee.id, Number(event.target.value))}
            className="h-10 rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm"
            aria-label={`Horas de ${employee.name}`}
          />
        </label>
      ))}
    </div>
  );
}
