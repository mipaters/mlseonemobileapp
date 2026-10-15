import { CheckCircle2, Trophy } from "lucide-react";
import type { Mission } from "../../types";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";

interface MissionCardProps {
  mission: Mission;
  onAdvance: () => void;
}

export function MissionCard({ mission, onAdvance }: MissionCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        mission.completed
          ? "border-accent-green/40 bg-accent-green/10"
          : "border-white/10 bg-navy-900/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">{mission.name}</h3>
            {mission.completed && <CheckCircle2 size={18} className="text-accent-green" />}
          </div>
          <p className="mt-1 text-sm text-silver-400">{mission.description}</p>
        </div>
        <div className="shrink-0 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-xs font-semibold text-accent-gold">
          +{mission.pointsReward} pts
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={mission.progress}
          max={mission.target}
          showValue
          label={mission.completed ? "Mission completed" : "Progress"}
          colorClassName={mission.completed ? "bg-accent-green" : "bg-accent-gold"}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-silver-400">
          <Trophy size={14} className="text-accent-gold" />
          <span>{mission.completed ? "Earned and added to your mission history" : "Advance to unlock points"}</span>
        </div>
        <Button size="sm" variant={mission.completed ? "secondary" : "primary"} onClick={onAdvance} disabled={mission.completed}>
          {mission.completed ? "Completed" : mission.target === 1 ? "Complete Mission" : "Advance Mission"}
        </Button>
      </div>
    </article>
  );
}
