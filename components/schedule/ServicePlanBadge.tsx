import { getFrequencyLabel } from '@/domain/schedule/recurrence';
import type { FrequencyType } from '@/domain/schedule/types';

type ServicePlanBadgeProps = {
  frequencyType: FrequencyType;
};

export function ServicePlanBadge({ frequencyType }: ServicePlanBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
      {getFrequencyLabel(frequencyType)}
    </span>
  );
}
