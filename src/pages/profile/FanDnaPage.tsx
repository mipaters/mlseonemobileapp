import { useMemo, useState } from "react";
import { ChevronRight, Info, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { NEXT_BEST_CONTENT, NEXT_BEST_MERCHANDISE } from "../../data/profile";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Sheet } from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import { useAppState } from "../../store/AppState";

type MetricKey =
  | "leafsAffinity"
  | "jaysAffinity"
  | "hockeyContentAffinity"
  | "baseballContentAffinity"
  | "liveEventAffinity"
  | "videoEngagement"
  | "seatUpgradePropensity"
  | "rewardsEngagement"
  | "merchandisePropensity"
  | "sponsorRelevance";

interface MetricDefinition {
  key: MetricKey;
  label: string;
  colorClassName: string;
}

const METRICS: MetricDefinition[] = [
  { key: "leafsAffinity", label: "Leafs affinity", colorClassName: "bg-leafs-600" },
  { key: "jaysAffinity", label: "Jays affinity", colorClassName: "bg-jays-600" },
  { key: "hockeyContentAffinity", label: "Hockey content affinity", colorClassName: "bg-leafs-700" },
  { key: "baseballContentAffinity", label: "Baseball content affinity", colorClassName: "bg-jays-700" },
  { key: "liveEventAffinity", label: "Live event affinity", colorClassName: "bg-accent-gold" },
  { key: "videoEngagement", label: "Video engagement", colorClassName: "bg-accent-green" },
  { key: "seatUpgradePropensity", label: "Seat upgrade propensity", colorClassName: "bg-accent-gold" },
  { key: "rewardsEngagement", label: "Rewards engagement", colorClassName: "bg-accent-green" },
  { key: "merchandisePropensity", label: "Merchandise propensity", colorClassName: "bg-jays-600" },
  { key: "sponsorRelevance", label: "Sponsor relevance", colorClassName: "bg-leafs-600" },
];

function churnRiskClasses(churnRisk: string) {
  const risk = churnRisk.toLowerCase();
  if (risk === "low") return "bg-accent-green/15 text-green-200";
  if (risk === "medium") return "bg-accent-gold/15 text-accent-gold";
  return "bg-accent-red/15 text-red-200";
}

export function FanDnaPage() {
  const { state } = useAppState();
  const [explainabilityOpen, setExplainabilityOpen] = useState(false);

  const radarData = useMemo(
    () =>
      METRICS.map((metric) => ({
        metric: metric.label.replace(" affinity", "").replace(" propensity", ""),
        value: state.fanDNA[metric.key],
      })),
    [state.fanDNA]
  );

  const topAffinities = useMemo(
    () =>
      [...METRICS]
        .sort((left, right) => state.fanDNA[right.key] - state.fanDNA[left.key])
        .slice(0, 2)
        .map((metric) => `${metric.label} (${state.fanDNA[metric.key]})`),
    [state.fanDNA]
  );

  const privacyStatusEntries = useMemo(
    () => [
      { label: "Personalization", enabled: state.privacy.personalization },
      { label: "Relevant offers", enabled: state.privacy.relevantOffers },
      { label: "Game-Day Mode location", enabled: state.privacy.locationGameDay },
      { label: "Partner recommendations", enabled: state.privacy.partnerRecommendations },
      { label: "Personalized video", enabled: state.privacy.personalizedVideo },
      { label: "Simulated activity history", enabled: state.privacy.activityHistory },
    ],
    [state.privacy]
  );

  const recentSignals = state.signals.slice(0, 3);

  return (
    <div className="relative space-y-4 px-4 pb-8 pt-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">SportsIQ Fan Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Mike&apos;s Fan DNA</h1>
        <p className="text-sm text-silver-400">A living sports profile built from every consented interaction.</p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Affinity overview</p>
            <p className="mt-1 text-sm text-silver-400">Illustrative 0-100 scores used to understand Mike&apos;s fan journey.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${churnRiskClasses(state.fanDNA.churnRisk)}`}>
            Churn risk: {state.fanDNA.churnRisk}
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-navy-900/70 p-3">
          <div aria-label="Radar chart of Mike's fan affinities" className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.16)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#c2cad7", fontSize: 10 }} />
                <Radar dataKey="value" stroke="#d4af37" fill="#d4af37" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            Mike&apos;s two strongest affinities are {topAffinities[0]} and {topAffinities[1]}.
          </p>
          <p className="mt-2 text-xs text-silver-400">
            Top affinities: <span className="text-silver-200">{topAffinities.join(" · ")}</span>
          </p>
        </div>

        <div className="mt-4 space-y-4" data-tour="affinities">
          {METRICS.map((metric) => (
            <ProgressBar
              key={metric.key}
              value={state.fanDNA[metric.key]}
              max={100}
              label={metric.label}
              showValue
              colorClassName={metric.colorClassName}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4" data-tour="recent-signals">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Recent signals</p>
            <p className="mt-1 text-sm text-silver-400">Most recent consented fan interactions feeding Mike&apos;s profile.</p>
          </div>
          <TrendingUp size={18} className="text-accent-gold" />
        </div>

        {state.signals.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-navy-900/60 p-4 text-sm text-silver-400">
            No simulated signals yet. Run a SportsIQ cycle or interact elsewhere in the app to add activity.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {state.signals.map((signal, index) => (
              <div key={signal.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent-gold" />
                  {index < state.signals.length - 1 && <span className="mt-1 h-full w-px bg-white/10" aria-hidden="true" />}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-white">{signal.label}</p>
                  <p className="mt-1 text-xs text-silver-400">{signal.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {state.privacy.personalization ? (
        <section
          className="rounded-3xl border border-accent-gold/30 bg-gradient-to-br from-accent-gold/10 via-navy-900 to-navy-950 p-4"
          data-tour="next-best-action"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">Next best action</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{state.nextBestAction}</h2>
            </div>
            <Sparkles size={18} className="shrink-0 text-accent-gold" />
          </div>

          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-navy-950/50 p-3 text-sm text-silver-300">
            <p>
              <span className="text-silver-100">Next best content:</span> {NEXT_BEST_CONTENT}
            </p>
            <p>
              <span className="text-silver-100">Next best merchandise:</span> {NEXT_BEST_MERCHANDISE}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setExplainabilityOpen(true)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-gold"
          >
            Why SportsIQ recommended this
            <ChevronRight size={16} />
          </button>
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-4" data-tour="next-best-action">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-silver-300" />
            <div>
              <p className="text-lg font-semibold text-white">Personalization is off</p>
              <p className="mt-1 text-sm text-silver-400">
                SportsIQ is showing generic app recommendations only. Mike&apos;s stored affinity data remains visible here, but
                ranked next-best-action guidance is disabled until personalization is re-enabled.
              </p>
            </div>
          </div>
        </section>
      )}

      <Sheet
        open={explainabilityOpen}
        onClose={() => setExplainabilityOpen(false)}
        title="Why SportsIQ recommended this"
      >
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-accent-gold" />
              <p className="text-sm font-semibold text-white">Signals used</p>
            </div>
            <div className="mt-3 space-y-2">
              {recentSignals.length > 0 ? (
                recentSignals.map((signal) => (
                  <div key={signal.id} className="rounded-2xl bg-navy-900/70 px-3 py-2">
                    <p className="text-sm text-white">{signal.label}</p>
                    <p className="text-xs text-silver-400">{signal.timestamp}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-silver-400">No recent simulated signals are available.</p>
              )}
            </div>
          </section>

          <section className="grid gap-3">
            <InfoCard title="Confidence" body="High confidence (87%) based on recent content, ticket, and rewards interactions." />
            <InfoCard title="Intended fan benefit" body="Reduce search time by surfacing the most relevant game-day or content action first." />
            <InfoCard title="Intended business outcome" body="Increase engagement, upgrade conversion, and repeat usage across Leafs and Jays journeys." />
            <InfoCard
              title="Consent status"
              body={state.privacy.personalization ? "Personalization enabled" : "Personalization disabled"}
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Preference status</p>
            <div className="mt-3 space-y-2">
              {privacyStatusEntries.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between rounded-2xl bg-navy-900/70 px-3 py-2 text-sm">
                  <span className="text-silver-200">{entry.label}</span>
                  <span className={entry.enabled ? "text-green-200" : "text-silver-400"}>
                    {entry.enabled ? "On" : "Off"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Button className="w-full" variant="secondary" onClick={() => setExplainabilityOpen(false)}>
            Close
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-silver-400">{body}</p>
    </div>
  );
}
