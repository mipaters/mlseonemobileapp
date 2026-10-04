import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export function Sheet({ open, onClose, title, children, fullScreen }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 bg-black/60 animate-fade-up"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={`relative z-10 w-full bg-navy-800 border-t border-white/10 shadow-2xl animate-fade-up overflow-y-auto ${
          fullScreen ? "h-full rounded-none" : "max-h-[85%] rounded-t-3xl"
        }`}
      >
        <div className="sticky top-0 bg-navy-800/95 backdrop-blur flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/20 absolute left-1/2 -translate-x-1/2 top-2" />
          <h2 className="text-base font-semibold text-white pt-2">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 rounded-full hover:bg-white/10 text-silver-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 pb-8 safe-bottom">{children}</div>
      </div>
    </div>
  );
}
