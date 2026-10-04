interface SectionHeaderProps {
  eyebrow: string;
  title: string;
}

export function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="px-4 mb-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-500">{eyebrow}</p>
      <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white mt-0.5">{title}</h2>
    </div>
  );
}
