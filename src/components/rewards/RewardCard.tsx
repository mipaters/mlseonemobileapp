import { Gift } from "lucide-react";
import type { Reward } from "../../types";
import { Button } from "../ui/Button";

interface RewardCardProps {
  reward: Reward;
  affordable: boolean;
  onRedeem: () => void;
}

function formatPoints(points: number) {
  return `${new Intl.NumberFormat().format(points)} pts`;
}

export function RewardCard({ reward, affordable, onRedeem }: RewardCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-silver-300">
            <Gift size={14} className="text-accent-gold" />
            {reward.category}
          </div>
          <h3 className="mt-3 text-base font-semibold text-white">{reward.name}</h3>
          <p className="mt-1 text-sm text-silver-400">{reward.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs uppercase tracking-wide text-silver-500">Cost</p>
          <p className="text-sm font-semibold text-accent-gold">{formatPoints(reward.pointCost)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`text-xs ${affordable ? "text-accent-green" : "text-silver-500"}`}>
          {affordable ? "Available now" : "More points needed"}
        </span>
        <Button size="sm" onClick={onRedeem} disabled={!affordable}>
          Redeem
        </Button>
      </div>
    </article>
  );
}
