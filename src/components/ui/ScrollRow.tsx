import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function ScrollRow({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          {eyebrow && (
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-accent-teal mb-0.5">
              <Sparkles size={10} /> {eyebrow}
            </p>
          )}
          <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="flex gap-3 overflow-x-auto scroll-row px-4 pb-1">{children}</div>
    </section>
  );
}
