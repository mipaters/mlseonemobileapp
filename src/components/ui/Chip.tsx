interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
        active
          ? "bg-accent-gold text-navy-950 border-accent-gold"
          : "bg-white/5 text-silver-100 border-white/10 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
