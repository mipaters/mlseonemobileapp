import { ArrowRight, RotateCcw, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EXECUTIVE_KPIS, FAN_FUNNEL, REVENUE_POOLS } from "../data/fanIntelligence";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useAppState } from "../store/AppState";
import { Button } from "../components/ui/Button";

const businessOutcomes = [
  {
    title: "Revenue Growth",
    points: [
      "Increase conversion by presenting the right offer at the moment of intent.",
      "Expand basket size with coordinated ticketing, merch, food and premium upsell paths.",
      "Improve sponsorship yield through audience segments tied to measurable outcomes.",
      "Create more multi-team value from one fan relationship instead of isolated transactions.",
      "Reduce wasted outreach by prioritizing fans with the highest current propensity to act.",
    ],
  },
  {
    title: "Fan Engagement",
    points: [
      "Make every home screen feel current, relevant and specific to the individual fan.",
      "Keep content sessions longer with ranked video, highlights and next-best actions.",
      "Turn service moments into ongoing engagement through conversational assistance.",
      "Sustain interest between games with missions, rewards and cross-team storytelling.",
      "Reconnect lapsed fans with timely experiences based on recent behaviour signals.",
    ],
  },
  {
    title: "Loyalty",
    points: [
      "Reward attendance, viewing, purchases and partner activity inside one unified program.",
      "Build trust with clear personalization value and visible privacy controls.",
      "Strengthen emotional connection through recognition across Leafs and Jays journeys.",
      "Promote repeat visits with status progression, tailored missions and earned perks.",
      "Transform one-time buyers into higher-value members with consistent relevance over time.",
    ],
  },
  {
    title: "Operating Efficiency",
    points: [
      "Unify fan intelligence so teams work from one profile instead of disconnected systems.",
      "Automate ranking, decisioning and service workflows with reusable AI orchestration.",
      "Give leaders shared metrics for conversion, engagement and measured business impact.",
      "Reduce manual campaign effort by activating audience logic across channels automatically.",
      "Improve planning speed with one architecture for data, measurement and responsible AI controls.",
    ],
  },
] as const;

function PercentBars({
  items,
  labelKey,
  valueKey,
  valueSuffix = "%",
}: {
  items: ReadonlyArray<Record<string, string | number>>;
  labelKey: string;
  valueKey: string;
  valueSuffix?: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const label = String(item[labelKey]);
        const value = Number(item[valueKey]);

        return (
          <div key={label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-white">{label}</span>
              <span className="text-silver-300">
                {value}
                {valueSuffix}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-gold via-leafs-600 to-jays-600"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ExecutiveViewPage() {
  const { actions } = useAppState();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const layoutClassName = isDesktop ? "space-y-6 px-6 py-6 lg:px-8" : "space-y-5 px-4 py-4";
  const kpiGridClassName = isDesktop ? "grid grid-cols-2 gap-4 xl:grid-cols-4" : "grid grid-cols-1 gap-3";
  const outcomeGridClassName = isDesktop ? "grid gap-4 lg:grid-cols-2" : "space-y-3";

  const handleReset = () => {
    actions.resetDemo();
    actions.showToast("Demo reset");
  };

  return (
    <div className={layoutClassName}>
      <header className="rounded-[28px] border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-jays-700/30 p-5 shadow-2xl">
        <div className={`flex gap-4 ${isDesktop ? "items-start justify-between" : "flex-col"}`}>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-gold">
                Illustrative demo data
              </span>
            </div>
            <h1 className={`${isDesktop ? "mt-4 text-4xl" : "mt-3 text-3xl"} font-display font-semibold uppercase tracking-tight text-white`}>
              MLSE One Executive View
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-silver-300">
              How one fan profile drives engagement, revenue, loyalty, and measurable partner value.
            </p>
          </div>

          <div className={`flex ${isDesktop ? "min-w-[18rem] flex-col" : "flex-col"} gap-2`}>
            <Button onClick={actions.startWalkthrough} size={isDesktop ? "lg" : "md"}>
              Start Executive Demo
            </Button>
            <Button onClick={handleReset} variant="secondary" size={isDesktop ? "lg" : "md"}>
              <RotateCcw size={16} className="mr-2 inline" />
              Reset Demo
            </Button>
            <Button onClick={() => navigate("/executive/architecture")} variant="ghost" size={isDesktop ? "md" : "sm"}>
              View Architecture
              <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </div>
        </div>
      </header>

      <section data-tour="kpis" className={kpiGridClassName}>
        {EXECUTIVE_KPIS.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-silver-500">{kpi.label}</p>
                <p className={`${isDesktop ? "mt-3 text-3xl" : "mt-2 text-2xl"} font-bold text-white`}>{kpi.value}</p>
              </div>
              <span className="rounded-full bg-accent-green/15 p-2 text-green-200">
                <TrendingUp size={18} />
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-green-300">{kpi.delta} vs prior benchmark period</p>
          </article>
        ))}
      </section>

      <div className={isDesktop ? "grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" : "space-y-5"}>
        <section
          data-tour="fan-funnel"
          className="rounded-[28px] border border-white/10 bg-navy-900/70 p-5 shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Journey Health</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">Fan Engagement Funnel</h2>
              <p className="mt-2 text-sm text-silver-400">
                Illustrative progression from known fan to multi-team relationship.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <PercentBars items={FAN_FUNNEL} labelKey="stage" valueKey="value" />
          </div>
        </section>

        <section
          data-tour="revenue-pools"
          className="rounded-[28px] border border-white/10 bg-navy-900/70 p-5 shadow-xl"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Commercial Mix</p>
            <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">Revenue Value Pools</h2>
            <p className="mt-2 text-sm text-silver-400">
              Sample distribution of where coordinated personalization can create value.
            </p>
          </div>
          <div className="mt-5">
            <PercentBars items={REVENUE_POOLS} labelKey="name" valueKey="value" />
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Illustrative value narrative</p>
            <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">Business Outcomes</h2>
          </div>
          {isDesktop && (
            <Button variant="secondary" onClick={() => navigate("/executive/architecture")}>
              View Architecture
            </Button>
          )}
        </div>

        <div className={outcomeGridClassName}>
          {businessOutcomes.map((outcome) => (
            <article key={outcome.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">{outcome.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-silver-300">
                {outcome.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        data-tour="closing-message"
        className="rounded-[28px] border border-accent-gold/20 bg-gradient-to-br from-accent-gold/10 via-navy-900 to-jays-700/10 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Executive close</p>
        <h2 className={`${isDesktop ? "mt-3 text-4xl" : "mt-3 text-3xl"} max-w-3xl font-display font-semibold uppercase tracking-tight text-white`}>
          One fan. Two teams. One intelligent relationship.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-silver-300">
          This fictional walkthrough illustrates how a unified profile can align fan value and business value across every major touchpoint.
        </p>

        <div className={`mt-5 flex gap-3 ${isDesktop ? "flex-row" : "flex-col"}`}>
          <Button onClick={actions.startWalkthrough}>Replay Demo</Button>
          <Button variant="secondary" onClick={() => navigate("/home")}>
            Explore as Mike
          </Button>
          <Button variant="ghost" onClick={() => navigate("/executive/architecture")}>
            View Architecture
          </Button>
        </div>
      </section>
    </div>
  );
}
