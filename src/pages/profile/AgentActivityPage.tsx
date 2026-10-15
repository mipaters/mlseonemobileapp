import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Check,
  Clapperboard,
  Gift,
  Handshake,
  LineChart,
  Newspaper,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AGENTS, PERSONALIZATION_CYCLE_STEPS } from "../../data/fanIntelligence";
import { Button } from "../../components/ui/Button";
import { useAppState } from "../../store/AppState";

const AGENT_STYLES: Record<
  (typeof AGENTS)[number],
  { icon: ReactNode; dotClassName: string; badgeClassName: string }
> = {
  "Fan Profile Agent": {
    icon: <UserRound size={14} />,
    dotClassName: "bg-leafs-600",
    badgeClassName: "text-sky-200 bg-leafs-600/15",
  },
  "Content Curation Agent": {
    icon: <Newspaper size={14} />,
    dotClassName: "bg-jays-600",
    badgeClassName: "text-blue-200 bg-jays-600/15",
  },
  "Video Assembly Agent": {
    icon: <Clapperboard size={14} />,
    dotClassName: "bg-accent-gold",
    badgeClassName: "text-accent-gold bg-accent-gold/15",
  },
  "Game-Day Agent": {
    icon: <Sparkles size={14} />,
    dotClassName: "bg-accent-green",
    badgeClassName: "text-green-200 bg-accent-green/15",
  },
  "Rewards Agent": {
    icon: <Gift size={14} />,
    dotClassName: "bg-leafs-700",
    badgeClassName: "text-emerald-200 bg-leafs-700/20",
  },
  "Commerce Agent": {
    icon: <ShoppingBag size={14} />,
    dotClassName: "bg-jays-700",
    badgeClassName: "text-cyan-200 bg-jays-700/20",
  },
  "Partner Relevance Agent": {
    icon: <Handshake size={14} />,
    dotClassName: "bg-accent-gold",
    badgeClassName: "text-yellow-100 bg-accent-gold/15",
  },
  "Measurement Agent": {
    icon: <LineChart size={14} />,
    dotClassName: "bg-white/70",
    badgeClassName: "text-silver-200 bg-white/10",
  },
};

export function AgentActivityPage() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [cycleCompleted, setCycleCompleted] = useState(false);
  const timeoutIds = useRef<number[]>([]);

  useEffect(
    () => () => {
      timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    []
  );

  const cycleRunning = currentStepIndex >= 0 && currentStepIndex < PERSONALIZATION_CYCLE_STEPS.length;

  const headerStatus = useMemo(() => {
    if (cycleRunning) return "SportsIQ is processing Mike's latest signals.";
    if (cycleCompleted) return "Latest personalization cycle completed successfully.";
    return "Follow the SportsIQ agents coordinating Mike's fan journey.";
  }, [cycleCompleted, cycleRunning]);

  const runCycle = () => {
    if (cycleRunning) return;

    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIds.current = [];
    setCycleCompleted(false);
    setCurrentStepIndex(0);

    PERSONALIZATION_CYCLE_STEPS.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setCurrentStepIndex(index);
      }, index * 600);

      timeoutIds.current.push(timeoutId);
    });

    const completionTimeoutId = window.setTimeout(() => {
      actions.runPersonalizationCycle();
      actions.addAgentActivity("Fan Profile Agent", "Fan signal re-ingested");
      actions.addAgentActivity("Game-Day Agent", "Leafs affinity recalculated");
      actions.addAgentActivity("Content Curation Agent", "Content ranked for Mike");
      actions.addAgentActivity("Rewards Agent", "Rewards mission evaluated");
      actions.addAgentActivity("Measurement Agent", "Outcome recorded");
      actions.addSignal("Ran SportsIQ personalization cycle");
      actions.showToast("Personalization cycle complete — Home updated");
      setCurrentStepIndex(PERSONALIZATION_CYCLE_STEPS.length);
      setCycleCompleted(true);
      timeoutIds.current = [];
    }, PERSONALIZATION_CYCLE_STEPS.length * 600 + 100);

    timeoutIds.current.push(completionTimeoutId);
  };

  return (
    <div className="space-y-4 px-4 pb-8 pt-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">SportsIQ Agent Feed</p>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-white">Agent Activity</h1>
        <p className="text-sm text-silver-400">{headerStatus}</p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Personalization cycle</p>
            <p className="mt-1 text-sm text-silver-400">Run the full SportsIQ sequence to refresh Mike&apos;s home experience.</p>
          </div>
          <Activity size={18} className="text-accent-gold" />
        </div>

        <Button
          className="mt-4 w-full"
          onClick={runCycle}
          disabled={cycleRunning}
          data-tour="agent-sequence"
        >
          {cycleRunning ? "Running Personalization Cycle..." : "Run Personalization Cycle"}
        </Button>

        <div className="mt-4 space-y-2">
          {PERSONALIZATION_CYCLE_STEPS.map((step, index) => {
            const completed = currentStepIndex > index || cycleCompleted;
            const active = currentStepIndex === index && !cycleCompleted;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition-colors ${
                  completed
                    ? "border-accent-green/30 bg-accent-green/10"
                    : active
                      ? "border-accent-gold/30 bg-accent-gold/10"
                      : "border-white/10 bg-white/5"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    completed
                      ? "bg-accent-green text-navy-950"
                      : active
                        ? "bg-accent-gold text-navy-950"
                        : "bg-white/10 text-silver-300"
                  }`}
                >
                  {completed ? <Check size={14} /> : index + 1}
                </span>
                <span className={completed || active ? "text-white" : "text-silver-400"}>{step}</span>
              </div>
            );
          })}
        </div>
      </section>

      {cycleCompleted && (
        <section
          className="rounded-3xl border border-accent-gold/30 bg-accent-gold/10 p-4"
          data-tour="final-recommendation"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">Final recommendation</p>
          <p className="mt-2 text-lg font-semibold text-white">{state.nextBestAction}</p>
          <p className="mt-1 text-sm text-silver-300">Home screen updated</p>
          <Button className="mt-4 w-full" variant="secondary" onClick={() => navigate("/home")}>
            View Home
          </Button>
        </section>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Activity timeline</p>
            <p className="mt-1 text-sm text-silver-400">Most recent agent events appear first.</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-silver-300">
            {state.agentActivity.length} events
          </span>
        </div>

        {state.agentActivity.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-navy-900/60 p-4 text-sm text-silver-400">
            No simulated agent activity yet. Run a personalization cycle to populate the SportsIQ feed.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {state.agentActivity.map((event, index) => {
              const style = AGENT_STYLES[event.agent as (typeof AGENTS)[number]] ?? {
                icon: <Activity size={14} />,
                dotClassName: "bg-white/70",
                badgeClassName: "text-silver-200 bg-white/10",
              };

              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 h-3 w-3 rounded-full ${style.dotClassName}`} />
                    {index < state.agentActivity.length - 1 && <span className="mt-1 h-full w-px bg-white/10" aria-hidden="true" />}
                  </div>

                  <div className="flex-1 rounded-2xl border border-white/10 bg-navy-900/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${style.badgeClassName}`}>
                          {style.icon}
                          {event.agent}
                        </div>
                        <p className="mt-2 text-sm text-white">{event.message}</p>
                      </div>
                      <span className="text-xs text-silver-400">{event.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
