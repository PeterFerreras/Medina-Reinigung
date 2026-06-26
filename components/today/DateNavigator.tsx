type DateNavigatorProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function moveDate(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return toDateInputValue(date);
}

export function DateNavigator({
  selectedDate,
  onDateChange,
}: DateNavigatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        onClick={() => onDateChange(moveDate(selectedDate, -1))}
      >
        Día anterior
      </button>
      <button
        type="button"
        className="rounded-md border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        onClick={() => onDateChange(toDateInputValue(new Date()))}
      >
        Hoy
      </button>
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        onClick={() => onDateChange(moveDate(selectedDate, 1))}
      >
        Día siguiente
      </button>
      <input
        aria-label="Fecha seleccionada"
        type="date"
        value={selectedDate}
        onChange={(event) => onDateChange(event.target.value)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm"
      />
    </div>
  );
}
