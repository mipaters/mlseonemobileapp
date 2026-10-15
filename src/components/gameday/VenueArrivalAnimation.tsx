import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, MapPinned, ScanLine, Sparkles, Ticket, UtensilsCrossed } from "lucide-react";

interface VenueArrivalAnimationProps {
  onComplete: () => void;
}

const steps = [
  { label: "Detecting your location…", icon: LoaderCircle },
  { label: "Welcome to the venue, Mike!", icon: CheckCircle2 },
  { label: "Activating Game-Day Mode…", icon: Sparkles },
  { label: "Surfacing your mobile ticket…", icon: Ticket },
  { label: "Finding your recommended gate…", icon: MapPinned },
  { label: "Checking for a seat upgrade…", icon: Sparkles },
  { label: "Finding a food recommendation…", icon: UtensilsCrossed },
  { label: "Activating a rewards mission…", icon: ScanLine },
] as const;

export function VenueArrivalAnimation({ onComplete }: VenueArrivalAnimationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timeouts: number[] = [];

    steps.forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        setActiveIndex(index);
      }, index * 700);
      timeouts.push(timeout);
    });

    const completionTimeout = window.setTimeout(() => {
      onComplete();
    }, steps.length * 700 + 200);
    timeouts.push(completionTimeout);

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [onComplete]);

  return (
    <div className="space-y-5 px-1 py-3">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-accent-gold/20 via-white/5 to-transparent p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">Venue arrival simulation</p>
        <h3 className="mt-2 text-2xl font-bold text-white">Game-Day Mode is getting everything ready</h3>
        <p className="mt-2 text-sm text-silver-300">This short animation mirrors the in-app activation flow once venue arrival is detected.</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                isActive
                  ? "border-accent-gold bg-accent-gold/10 shadow-[0_0_25px_rgba(255,214,90,0.12)]"
                  : isDone
                    ? "border-accent-green/20 bg-accent-green/10"
                    : "border-white/10 bg-white/5"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isActive ? "bg-accent-gold text-navy-950 animate-pulse-soft" : isDone ? "bg-accent-green/20 text-green-200" : "bg-white/10 text-silver-400"
                }`}
              >
                <Icon size={18} className={step.label === "Detecting your location…" && isActive ? "animate-spin" : ""} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-1 text-xs text-silver-400">{isDone ? "Ready" : isActive ? "In progress" : "Queued"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
