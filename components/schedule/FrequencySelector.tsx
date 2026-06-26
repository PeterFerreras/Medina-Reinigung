import { getFrequencyLabel } from '@/domain/schedule/recurrence';
import type { FrequencyType } from '@/domain/schedule/types';

type FrequencySelectorProps = {
  value: FrequencyType;
  onChange: (frequencyType: FrequencyType) => void;
};

const frequencies: FrequencyType[] = [
  'ONE_TIME',
  'WEEKLY',
  'BIWEEKLY',
  'MULTIPLE_DAYS_PER_WEEK',
];

export function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      Frecuencia
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as FrequencyType)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm"
      >
        {frequencies.map((frequency) => (
          <option key={frequency} value={frequency}>
            {getFrequencyLabel(frequency)}
          </option>
        ))}
      </select>
    </label>
  );
}
