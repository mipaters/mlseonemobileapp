interface ProgressBarProps {
  value: number;
  max?: number;
  colorClassName?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, max = 100, colorClassName = "bg-accent-gold", label, showValue }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-silver-300 mb-1">
          <span>{label}</span>
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div
        className="h-2 w-full rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClassName}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
