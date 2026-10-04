import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BadgeDollarSign, CheckCircle2, Circle, Sparkles, Tickets } from "lucide-react";
import { SEAT_UPGRADES } from "../../data/gameDay";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Sheet } from "../ui/Sheet";
import { useAppState } from "../../store/AppState";
import type { TeamId } from "../../types";

interface SeatUpgradeSheetProps {
  open: boolean;
  onClose: () => void;
  team: TeamId;
}

export function SeatUpgradeSheet({ open, onClose, team }: SeatUpgradeSheetProps) {
  const { state, actions } = useAppState();
  const options = SEAT_UPGRADES[team];
  const recommendedOption = useMemo(() => options.find((option) => option.recommended) ?? options[0], [options]);
  const [selectedId, setSelectedId] = useState(recommendedOption.id);
  const [compareAll, setCompareAll] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(true);

  useEffect(() => {
    if (open) {
      setSelectedId(recommendedOption.id);
      setCompareAll(false);
      setApplyDiscount(true);
    }
  }, [open, recommendedOption.id]);

  const selectedOption = options.find((option) => option.id === selectedId) ?? recommendedOption;
  const visibleOptions = compareAll ? options : [selectedOption];

  const handleConfirm = () => {
    actions.upgradeSeat(team, selectedOption.section);
    actions.addSignal(`Upgraded seat for ${team} game`);
    actions.addAgentActivity("Game-Day Agent", "Seat upgrade recommended and accepted");
    actions.showToast("Seat upgraded! Your ticket has been updated.");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Seat Upgrade Assistant">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Upgrade options for tonight</p>
              <p className="mt-1 text-sm text-silver-400">
                Compare inventory, apply rewards, and update your live ticket in one tap.
              </p>
            </div>
            <div className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold text-accent-gold">
              {state.rewardsBalance} pts
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip label={compareAll ? "Showing all options" : "Recommended focus"} active={compareAll} onClick={() => setCompareAll((value) => !value)} />
            <Chip
              label={applyDiscount ? "Rewards discount applied" : "Apply rewards discount"}
              active={applyDiscount}
              onClick={() => setApplyDiscount((value) => !value)}
            />
          </div>
        </div>

        {!compareAll && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {options.map((option) => (
              <Chip
                key={option.id}
                label={option.section}
                active={selectedId === option.id}
                onClick={() => setSelectedId(option.id)}
              />
            ))}
          </div>
        )}

        <div className={`grid gap-3 ${compareAll ? "md:grid-cols-3" : "grid-cols-1"}`}>
          {visibleOptions.map((option) => {
            const netPrice = Math.max(0, option.priceDifference - (applyDiscount ? option.rewardsDiscount : 0));
            const isSelected = selectedOption.id === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-accent-gold bg-accent-gold/10 shadow-[0_0_0_1px_rgba(255,214,90,0.2)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-white">{option.section}</p>
                      {option.recommended && (
                        <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-200">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-silver-400">{option.description}</p>
                  </div>
                  {isSelected ? <CheckCircle2 className="text-accent-gold" size={20} /> : <Circle className="text-silver-500" size={20} />}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Move" value={option.distanceFromCurrent} icon={<Tickets size={14} />} />
                  <Stat
                    label="Savings"
                    value={applyDiscount ? `-${option.rewardsDiscount} pts` : "Off"}
                    icon={<BadgeDollarSign size={14} />}
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-silver-400">Net upgrade cost</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">${netPrice}</span>
                    {applyDiscount && option.rewardsDiscount > 0 && (
                      <span className="text-sm text-silver-400 line-through">${option.priceDifference}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Button className="w-full" size="lg" onClick={handleConfirm}>
          <Sparkles size={16} className="mr-2 inline" />
          Confirm Upgrade to {selectedOption.section}
        </Button>
      </div>
    </Sheet>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-silver-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}
