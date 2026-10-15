import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DEMO_ARCHITECTURE, PRODUCTION_ARCHITECTURE, type DeploymentArchitectureLayer } from "../data/deploymentArchitecture";
import { useIsDesktop } from "../hooks/useIsDesktop";

type Tab = "demo" | "production";

function LayerSection({ layer }: { layer: DeploymentArchitectureLayer }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">{layer.title}</h2>
      <div className="mt-3 space-y-3">
        {layer.items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-3 ${
              item.highlight
                ? "border-accent-gold/40 bg-accent-gold/10"
                : "border-white/10 bg-navy-900/70"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.highlight && <Sparkles size={14} className="text-accent-gold shrink-0" />}
              <p className={`text-sm font-semibold ${item.highlight ? "text-accent-gold" : "text-white"}`}>
                {item.name}
              </p>
              {item.highlight && (
                <span className="rounded-full border border-accent-gold/40 bg-accent-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-gold">
                  New in production
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-silver-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DeploymentArchitecturePage() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [tab, setTab] = useState<Tab>("demo");

  const layers = tab === "demo" ? DEMO_ARCHITECTURE : PRODUCTION_ARCHITECTURE;

  return (
    <div className={`space-y-5 ${isDesktop ? "px-6 py-6 lg:px-8" : "px-4 py-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-2 inline" />
          Back
        </Button>
      </div>

      <header className="rounded-[28px] border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-accent-red/20 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-gold">Illustrative architecture</p>
        <h1 className={`${isDesktop ? "mt-3 text-4xl" : "mt-3 text-3xl"} font-display font-semibold uppercase tracking-tight text-white`}>
          Demo vs. Production Architecture
        </h1>
        <p className="mt-3 text-sm text-silver-300">
          What's actually running behind this demo today, compared with an illustrative production-scale deployment.
        </p>
      </header>

      <div className="flex gap-2 rounded-2xl border border-white/10 bg-navy-900/70 p-1">
        <button
          type="button"
          onClick={() => setTab("demo")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "demo" ? "bg-accent-gold text-navy-950" : "text-silver-300 hover:text-white"
          }`}
        >
          Demo (What's Deployed)
        </button>
        <button
          type="button"
          onClick={() => setTab("production")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "production" ? "bg-accent-gold text-navy-950" : "text-silver-300 hover:text-white"
          }`}
        >
          Production (Target State)
        </button>
      </div>

      <div className={isDesktop ? "grid gap-5 lg:grid-cols-2" : "space-y-4"}>
        {layers.map((layer) => (
          <LayerSection key={layer.id} layer={layer} />
        ))}
      </div>
    </div>
  );
}
