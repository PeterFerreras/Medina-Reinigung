type BillingPeriodFilterProps = {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
};

const periods = [
  'Primera quincena',
  'Segunda quincena',
  'Mes completo',
  'Rango personalizado',
];

export function BillingPeriodFilter({
  selectedPeriod,
  onPeriodChange,
}: BillingPeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => {
        const isSelected = selectedPeriod === period;
        const isCustom = period === 'Rango personalizado';

        return (
          <button
            key={period}
            type="button"
            disabled={isCustom}
            className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${
              isSelected
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            } ${isCustom ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-50'}`}
            onClick={() => onPeriodChange(period)}
          >
            {period}
            {isCustom ? <span className="ml-2 text-xs font-medium">Próximamente</span> : null}
          </button>
        );
      })}
    </div>
  );
}
