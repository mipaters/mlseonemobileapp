import type { ReactNode } from "react";

export function ScrollRow({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {action}
      </div>
      <div className="flex gap-3 overflow-x-auto scroll-row px-4 pb-1">{children}</div>
    </section>
  );
}
