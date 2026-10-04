import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AskCitoBanner() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/cito")}
      className="mx-4 mt-6 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-accent-teal/40 bg-navy-800 p-4 text-left shadow-[0_0_24px_-6px_var(--color-accent-teal)]"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-500">Your Concierge</p>
        <p className="font-display text-lg font-semibold uppercase tracking-tight text-white mt-0.5">Ask Cito anything</p>
        <p className="text-xs text-silver-400 mt-0.5">Tickets, rewards, food, highlights — personalized to you.</p>
      </div>
      <Sparkles size={22} className="text-accent-teal shrink-0" />
    </button>
  );
}
