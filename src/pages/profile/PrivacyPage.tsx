import type { PrivacyPreferences } from "../../types";
import { DatabaseZap, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAppState } from "../../store/AppState";

interface PrivacyToggleDefinition {
  key: keyof PrivacyPreferences;
  label: string;
  description: string;
}

const PRIVACY_TOGGLES: PrivacyToggleDefinition[] = [
  {
    key: "personalization",
    label: "Personalization",
    description: "Allows SportsIQ to tailor next-best-action language and ranked experiences across the app.",
  },
  {
    key: "relevantOffers",
    label: "Relevant offers",
    description: "Controls whether ticket, rewards, and offer moments can be adapted to Mike's interests.",
  },
  {
    key: "locationGameDay",
    label: "Location-based Game-Day Mode",
    description: "Enables venue-aware directions, timing, and game-day guidance when Mike is near an event.",
  },
  {
    key: "partnerRecommendations",
    label: "Partner recommendations",
    description: "Lets SportsIQ surface sponsor and partner offers that match Mike's interests.",
  },
  {
    key: "personalizedVideo",
    label: "Personalized video",
    description: "Allows highlight reels and ranked video suggestions to reflect Mike's current affinities.",
  },
  {
    key: "activityHistory",
    label: "Simulated activity history",
    description: "Keeps the demo's recent signals and agent history available for transparency and explainability.",
  },
];

export function PrivacyPage() {
  const { state, actions } = useAppState();

  const handleToggle = (key: keyof PrivacyPreferences, label: string) => {
    const nextValue = !state.privacy[key];
    actions.setPrivacy({ [key]: nextValue });
    actions.showToast(`${label} ${nextValue ? "enabled" : "disabled"}`);
  };

  const handleClearActivity = () => {
    actions.clearActivity();
    actions.showToast("Simulated activity cleared");
  };

  return (
    <div className="space-y-4 px-4 pb-8 pt-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">Privacy &amp; Data Controls</p>
        <h1 className="text-2xl font-bold text-white">Privacy &amp; Data</h1>
        <p className="text-sm text-silver-400">Choose how SportsIQ can use Mike&apos;s consented demo data across the MLSE One experience.</p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent-gold" />
          <div>
            <p className="text-lg font-semibold text-white">Personalization control</p>
            <p className="mt-1 text-sm text-silver-400">
              Disabling personalization reduces personalized language and turns off next-best-action cards elsewhere in the app.
              Mike&apos;s stored data can still appear in raw profile views such as Fan DNA.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {PRIVACY_TOGGLES.map((toggle) => {
          const enabled = state.privacy[toggle.key];

          return (
            <div key={toggle.key} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white">{toggle.label}</p>
                  <p className="mt-1 text-sm text-silver-400">{toggle.description}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={toggle.label}
                  onClick={() => handleToggle(toggle.key, toggle.label)}
                  className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-navy-950 ${
                    enabled ? "border-accent-gold bg-accent-gold" : "border-white/10 bg-white/10"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-navy-950 transition-transform ${
                      enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <DatabaseZap size={18} className="mt-0.5 shrink-0 text-accent-gold" />
          <div>
            <p className="text-lg font-semibold text-white">Simulated activity history</p>
            <p className="mt-1 text-sm text-silver-400">
              Clear the demo&apos;s recent signals, agent feed, and Ask Cito history to reset profile activity traces.
            </p>
          </div>
        </div>

        <Button className="mt-4 w-full" variant="danger" onClick={handleClearActivity}>
          <Trash2 size={16} className="mr-2 inline" />
          Clear Simulated Activity
        </Button>
      </section>
    </div>
  );
}
