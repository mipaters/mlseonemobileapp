import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 400, height: 844 }}>
      <div className="absolute inset-0 rounded-[2.75rem] bg-navy-700 shadow-2xl shadow-black/60 p-2.5 border border-white/10">
        <div className="relative h-full w-full rounded-[2.1rem] overflow-hidden bg-navy-950 ring-1 ring-black/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-navy-950 rounded-b-2xl z-50" />
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
