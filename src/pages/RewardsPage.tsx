import { useMemo } from "react";
import { ArrowUpRight, Crown, Gift, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { PARTNER_OFFERS, REWARDS, rewardById } from "../data/rewards";
import { TIER_THRESHOLDS } from "../data/profile";
import type { LoyaltyTier, Mission } from "../types";
import { useAppState } from "../store/AppState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MissionCard } from "../components/rewards/MissionCard";
import { RewardCard } from "../components/rewards/RewardCard";

function formatPoints(points: number) {
  return `${new Intl.NumberFormat().format(points)} pts`;
}

function getTierProgress(balance: number) {
  const thresholds = TIER_THRESHOLDS as { tier: LoyaltyTier; min: number }[];
  const current = thresholds.reduce((best, tier) => (tier.min <= balance ? tier : best), thresholds[0]);
  const currentIndex = thresholds.findIndex((tier) => tier.tier === current.tier);
  const next = thresholds[currentIndex + 1] ?? null;

  if (!next) {
    return {
      current,
      next: null,
      progressValue: 1,
      progressMax: 1,
    };
  }

  return {
    current,
    next,
    progressValue: balance - current.min,
    progressMax: next.min - current.min,
  };
}

export function RewardsPage() {
  const { state, actions } = useAppState();

  const tierProgress = useMemo(() => getTierProgress(state.rewardsBalance), [state.rewardsBalance]);
  const recentRewards = useMemo(
    () =>
      state.redeemedRewards.map((entry) => ({
        entry,
        reward: rewardById(entry.rewardId),
      })),
    [state.redeemedRewards]
  );

  const handleAdvanceMission = (mission: Mission) => {
    if (mission.completed) return;

    const willComplete = mission.progress + 1 >= mission.target;
    actions.bumpMissionProgress(mission.id);

    if (willComplete) {
      actions.addSignal(`Completed mission: ${mission.name}`);
      actions.addAgentActivity("Rewards Agent", `Rewards mission completed: ${mission.name}`);
      actions.showToast(`Mission complete! +${mission.pointsReward} points`);
    }
  };

  const handleRedeemReward = (rewardId: string, rewardName: string, pointCost: number) => {
    actions.redeemReward(rewardId, pointCost);
    actions.addSignal(`Redeemed reward: ${rewardName}`);
    actions.addAgentActivity("Rewards Agent", `Reward redeemed: ${rewardName}`);
    actions.showToast(`Redeemed: ${rewardName}`);
  };

  return (
    <div className="space-y-6 px-4 pb-8 pt-4">
      <header className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-jays-700 p-5">
        <p className="text-sm font-medium text-silver-300">Rewards</p>
        <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">One Fan. Two Teams. More Ways to Earn.</h1>
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-gold">
              <Crown size={14} />
              Platinum status
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{formatPoints(state.rewardsBalance)}</p>
            <p className="mt-1 text-sm text-silver-400">Keep earning across game day, content, merch, and partner moments.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <ShieldCheck size={28} className="text-accent-gold" />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-navy-950/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Loyalty tier progress</p>
              <p className="mt-1 text-xs text-silver-400">
                {tierProgress.next
                  ? `${tierProgress.current.tier} → ${tierProgress.next.tier}`
                  : `${tierProgress.current.tier} member`}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-silver-200">
              {tierProgress.current.tier}
            </span>
          </div>

          <div className="mt-4">
            {tierProgress.next ? (
              <>
                <ProgressBar
                  value={tierProgress.progressValue}
                  max={tierProgress.progressMax}
                  colorClassName="bg-accent-gold"
                  label={`${formatPoints(Math.max(0, tierProgress.next.min - state.rewardsBalance))} to ${tierProgress.next.tier}`}
                  showValue
                />
                <div className="mt-2 flex items-center justify-between text-xs text-silver-500">
                  <span>{formatPoints(tierProgress.current.min)}</span>
                  <span>{formatPoints(tierProgress.next.min)}</span>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-accent-gold/25 bg-accent-gold/10 px-4 py-3 text-sm text-accent-gold">
                Max tier reached.
              </div>
            )}
          </div>
        </div>
      </header>

      <section data-tour="active-missions" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">Active missions</h2>
            <p className="text-sm text-silver-400">Complete fan actions to unlock more points.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-silver-300">
            <Sparkles size={14} className="text-accent-gold" />
            {state.missions.filter((mission) => !mission.completed).length} live
          </div>
        </div>

        <div className="space-y-3">
          {state.missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onAdvance={() => handleAdvanceMission(mission)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-accent-gold" />
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">Available rewards</h2>
            <p className="text-sm text-silver-400">Use your points on perks, merch, and experiences.</p>
          </div>
        </div>

        <div className="space-y-3">
          {REWARDS.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              affordable={state.rewardsBalance >= reward.pointCost}
              onRedeem={() => handleRedeemReward(reward.id, reward.name, reward.pointCost)}
            />
          ))}
        </div>
      </section>

      <section data-tour="rewards-wallet" className="space-y-4">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-accent-gold" />
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">Rewards wallet</h2>
            <p className="text-sm text-silver-400">Recent redemptions and point activity.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
          {recentRewards.length === 0 ? (
            <p className="text-sm text-silver-400">No recent redemptions yet. Your next perk is ready when you are.</p>
          ) : (
            <div className="space-y-3">
              {recentRewards.slice(0, 6).map(({ entry, reward }) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-white">{reward?.name ?? entry.rewardId}</p>
                    <p className="mt-1 text-xs text-silver-500">
                      Redeemed on {new Date(entry.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {reward && <span className="text-xs font-semibold text-accent-gold">-{formatPoints(reward.pointCost)}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowUpRight size={18} className="text-accent-gold" />
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">Illustrative partner content</h2>
            <p className="text-sm text-silver-400">A sample of why personalized offers can feel relevant.</p>
          </div>
        </div>

        <div className="space-y-3">
          {PARTNER_OFFERS.slice(0, 2).map((offer) => (
            <article key={offer.id} className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-silver-500">{offer.partnerName}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{offer.benefit}</h3>
                  <p className="mt-1 text-sm text-silver-400">{offer.rewardValue}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver-300">
                  {offer.category}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-silver-500">Expiry</p>
                  <p className="mt-1 text-silver-200">{offer.expiry}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-silver-500">Required action</p>
                  <p className="mt-1 text-silver-200">{offer.requiredAction}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-navy-950/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-gold">Why am I seeing this?</p>
                <p className="mt-1 text-sm text-silver-400">{offer.relevance}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
