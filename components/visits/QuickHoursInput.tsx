type QuickHoursInputProps = {
  hours: number;
  onHoursChange: (hours: number) => void;
};

export function QuickHoursInput({ hours, onHoursChange }: QuickHoursInputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      Horas para todos
      <input
        type="number"
        min="0"
        step="0.25"
        value={hours}
        onChange={(event) => onHoursChange(Number(event.target.value))}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm"
      />
    </label>
  );
}
