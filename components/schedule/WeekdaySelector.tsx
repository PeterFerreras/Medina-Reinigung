import { getWeekdayLabel, weekdays } from '@/domain/schedule/recurrence';
import type { Weekday } from '@/domain/schedule/types';

type WeekdaySelectorProps = {
  selectedWeekdays: Weekday[];
  onChange: (weekdays: Weekday[]) => void;
};

export function WeekdaySelector({
  selectedWeekdays,
  onChange,
}: WeekdaySelectorProps) {
  const toggleWeekday = (weekday: Weekday) => {
    if (selectedWeekdays.includes(weekday)) {
      onChange(selectedWeekdays.filter((selectedWeekday) => selectedWeekday !== weekday));
      return;
    }

    onChange([...selectedWeekdays, weekday]);
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-slate-700">Días de la semana</legend>
      <div className="flex flex-wrap gap-2">
        {weekdays.map((weekday) => {
          const isSelected = selectedWeekdays.includes(weekday);

          return (
            <button
              key={weekday}
              type="button"
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => toggleWeekday(weekday)}
            >
              {getWeekdayLabel(weekday)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
