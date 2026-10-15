import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2600);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-[60] animate-fade-up">
      <div className="flex items-center gap-2 bg-navy-700 border border-white/10 text-white text-sm px-4 py-2.5 rounded-full shadow-xl">
        <CheckCircle2 size={16} className="text-accent-green shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
