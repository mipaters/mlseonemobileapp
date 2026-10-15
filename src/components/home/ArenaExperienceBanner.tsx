import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export function ArenaExperienceBanner() {
  const navigate = useNavigate();
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-800 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold/25 to-accent-gold/5 border border-accent-gold/30 text-accent-gold">
        <MapPin size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-500">Arena Experience</p>
        <p className="text-sm font-semibold text-white leading-snug">At the game? Unlock your night.</p>
        <p className="text-xs text-silver-500 mt-0.5 line-clamp-1">Tap when you arrive at Scotiabank Arena ...</p>
      </div>
      <Button size="sm" className="rounded-full shrink-0 uppercase tracking-wide" onClick={() => navigate("/gameday")}>
        I&apos;m Here
      </Button>
    </div>
  );
}
