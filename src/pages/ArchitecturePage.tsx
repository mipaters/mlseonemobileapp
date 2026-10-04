import { useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ARCHITECTURE_LAYERS,
  architectureNodeById,
  type ArchitectureNode,
} from "../data/fanIntelligence";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { Button } from "../components/ui/Button";
import { Sheet } from "../components/ui/Sheet";

const flowSteps = [
  "Fan interaction",
  "Event and profile signal",
  "Microsoft Fabric and SportsIQ",
  "Azure AI Foundry and Ask Cito",
  "Personalized decision",
  "MLSE One mobile experience",
  "Measured outcome",
  "Feedback into SportsIQ",
] as const;

const layerTourIds: Record<string, string | undefined> = {
  operational: "operational-sources",
  security: "security",
};

const nodeTourIds: Record<string, string | undefined> = {
  fabric: "fabric",
  foundry: "foundry",
  "sportsiq-agents": "sportsiq",
  "cito-orch": "cito",
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-silver-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-silver-200">{value}</p>
    </div>
  );
}

function NodeDetail({ node }: { node: ArchitectureNode }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-accent-gold/20 bg-accent-gold/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">{node.layer} layer</p>
        <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">{node.name}</h3>
      </div>

      <DetailField label="Purpose" value={node.purpose} />
      <DetailField label="Data used" value={node.dataUsed} />
      <DetailField label="Output" value={node.output} />
      <DetailField label="Enabled fan experience" value={node.enabledExperience} />
      <DetailField label="Business value" value={node.businessValue} />
    </div>
  );
}

export function ArchitecturePage() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(isDesktop ? ARCHITECTURE_LAYERS[0]?.nodeIds[0] ?? null : null);
  const selectedNode = useMemo(
    () => (selectedNodeId ? architectureNodeById(selectedNodeId) ?? null : null),
    [selectedNodeId]
  );

  return (
    <div className={`space-y-5 ${isDesktop ? "px-6 py-6 lg:px-8" : "px-4 py-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-2 inline" />
          Back
        </Button>
      </div>

      <header className="rounded-[28px] border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-leafs-700/20 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-gold">Illustrative architecture</p>
        <h1 className={`${isDesktop ? "mt-3 text-4xl" : "mt-3 text-3xl"} font-display font-semibold uppercase tracking-tight text-white`}>
          Illustrative Microsoft Target Architecture
        </h1>
        <p className="mt-3 text-sm text-silver-300">
          Not currently live — illustrative only
        </p>
      </header>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">Illustrative flow</p>
        <div className={`mt-4 flex ${isDesktop ? "flex-row flex-wrap items-center gap-3" : "flex-col gap-2"}`}>
          {flowSteps.map((step, index) => (
            <div
              key={step}
              className={`flex ${isDesktop ? "items-center gap-3" : "flex-col gap-2"}`}
            >
              <div className="rounded-2xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm font-medium text-white">
                {step}
              </div>
              {index < flowSteps.length - 1 &&
                (isDesktop ? (
                  <ArrowRight size={18} className="text-silver-500" />
                ) : (
                  <ArrowDown size={18} className="self-center text-silver-500" />
                ))}
            </div>
          ))}
        </div>
      </section>

      <div className={isDesktop ? "grid gap-5 xl:grid-cols-[1.3fr_0.9fr]" : "space-y-4"}>
        <div className="space-y-4">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <section
              key={layer.id}
              data-tour={layerTourIds[layer.id]}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">{layer.id}</p>
                  <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-white">{layer.title}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver-300">
                  {layer.nodeIds.length} nodes
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {layer.nodeIds.map((nodeId) => {
                  const node = architectureNodeById(nodeId);

                  if (!node) return null;

                  const isSelected = selectedNodeId === node.id;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      data-tour={nodeTourIds[node.id]}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-accent-gold/40 bg-accent-gold/10 text-white"
                          : "border-white/10 bg-navy-900/70 text-silver-200 hover:bg-white/10"
                      }`}
                    >
                      {node.name}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {isDesktop && (
          <aside className="sticky top-4 h-fit rounded-[28px] border border-white/10 bg-navy-900/80 p-5">
            {selectedNode ? (
              <NodeDetail node={selectedNode} />
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-silver-400">
                Select a node to inspect its role in the illustrative architecture.
              </div>
            )}
          </aside>
        )}
      </div>

      {!isDesktop && selectedNode && (
        <Sheet
          open={!!selectedNode}
          onClose={() => setSelectedNodeId(null)}
          title={selectedNode.name}
        >
          <NodeDetail node={selectedNode} />
        </Sheet>
      )}
    </div>
  );
}
