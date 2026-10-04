import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CircleCheckBig,
  Clock3,
  DoorOpen,
  MapPin,
  ShieldCheck,
  Shirt,
  Sparkles,
  Ticket,
  Train,
  Trophy,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gameByTeam, FOOD_OPTIONS } from "../data/gameDay";
import { merchById } from "../data/merchandise";
import { teamById } from "../data/teams";
import { TicketWalletCard } from "../components/gameday/TicketWalletCard";
import { SeatUpgradeSheet } from "../components/gameday/SeatUpgradeSheet";
import { VenueArrivalAnimation } from "../components/gameday/VenueArrivalAnimation";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Sheet } from "../components/ui/Sheet";
import { useAppState } from "../store/AppState";
import type { TeamId } from "../types";

const teamStyles = {
  leafs: {
    hero: "from-leafs-700 via-navy-900 to-navy-950",
    badge: "bg-leafs-600/20 text-sky-200 border border-leafs-600/30",
    accentBorder: "border-leafs-600/30",
  },
  jays: {
    hero: "from-jays-700 via-navy-900 to-navy-950",
    badge: "bg-jays-600/20 text-blue-200 border border-jays-600/30",
    accentBorder: "border-jays-600/30",
  },
} as const;

const citoActionsByTeam: Record<TeamId, string[]> = {
  leafs: ["Show Ticket", "Upgrade Seat", "Find Food", "Find My Gate", "Find a Matthews Jersey", "Redeem Points"],
  jays: ["Show Ticket", "Watch Batting Practice", "Upgrade Seat", "Find Food", "Find My Gate", "Find a Jays Hat", "Redeem Points"],
};

function countdownLabel(team: TeamId, arrived: boolean) {
  if (arrived) {
    return team === "leafs" ? "Pregame · Puck drop in 34 min" : "Pregame · First pitch in 42 min";
  }

  return team === "leafs" ? "Tonight · Arena doors open at 6:00 PM" : "This weekend · Gates open at 12:00 PM";
}

function transitLabel(team: TeamId) {
  return team === "leafs"
    ? "Illustrative demo: estimated 35 min via TTC Line 1 from your saved location."
    : "Illustrative demo: estimated 29 min via GO + Union transfer from your saved location.";
}

export function GameDayPage() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const [ticketSheetOpen, setTicketSheetOpen] = useState(false);
  const [upgradeSheetOpen, setUpgradeSheetOpen] = useState(false);
  const [arrivalSheetOpen, setArrivalSheetOpen] = useState(false);

  const team = state.activeGameDayTeam;
  const teamInfo = teamById(team);
  const game = gameByTeam(team);
  const ticket = state.tickets.find((entry) => entry.teamId === team);
  const foodOptions = FOOD_OPTIONS[team];
  const mission = useMemo(() => state.missions.find((entry) => !entry.completed) ?? null, [state.missions]);
  const arrived = state.venueArrived[team];
  const planAccepted = state.gameDayPlanAccepted[team];
  const merchItem = team === "leafs" ? merchById("matthews-jersey") : merchById("jays-cap");
  const styles = teamStyles[team];

  const handleMerchClick = () => {
    if (!merchItem) {
      actions.showToast("Your merch recommendation is ready in the locker.");
      return;
    }

    actions.showToast(`Recommendation saved: ${merchItem.name} is ready in your fan gear lineup.`);
  };

  const handlePlanAccept = () => {
    actions.acceptGameDayPlan(team);
    actions.addSignal(`${teamInfo?.shortName ?? team.toUpperCase()} game-day plan accepted`);
    actions.addAgentActivity("Game-Day Agent", "Pregame plan accepted and rewards unlocked");
    actions.showToast("Game-day plan accepted. 150 points added.");
  };

  const handleMissionBump = () => {
    if (!mission) return;
    actions.bumpMissionProgress(mission.id);
    actions.showToast("Mission progress updated");
  };

  const handleArrivalComplete = () => {
    actions.simulateVenueArrival(team);
    actions.addSignal("Simulated venue arrival");
    actions.addAgentActivity("Game-Day Agent", "Venue arrival detected");
    if (mission && !mission.completed) {
      actions.bumpMissionProgress(mission.id);
    }
    actions.showToast("You're all set for tonight!");
    setArrivalSheetOpen(false);
  };

  if (!teamInfo || !game || !ticket) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-silver-300">
          Game-day details are loading.
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 px-4 pb-8 pt-4">
      <div className="flex gap-2">
        {(["leafs", "jays"] as TeamId[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => actions.setGameDayTeam(option)}
            className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
              team === option
                ? "border-accent-gold bg-accent-gold text-navy-950"
                : "border-white/10 bg-white/5 text-silver-200 hover:bg-white/10"
            }`}
          >
            {option === "leafs" ? "Leafs" : "Jays"}
          </button>
        ))}
      </div>

      <section className={`overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${styles.hero} p-5 shadow-2xl`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-gold">Mobile Game-Day Mode</p>
            <h1 className="mt-2 text-2xl font-bold text-white">{teamInfo.name}</h1>
            <p className="mt-1 text-sm text-silver-200">vs {game.opponent}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {arrived && (
              <span className="animate-pulse-soft rounded-full bg-accent-red px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                LIVE
              </span>
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>{game.dateLabel}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-silver-100">
          <HeroStat icon={<Clock3 size={15} />} label="Game time" value={game.timeLabel} />
          <HeroStat icon={<MapPin size={15} />} label="Venue" value={game.venue} />
          <HeroStat icon={<DoorOpen size={15} />} label="Entry status" value={arrived ? "Entry Active" : "Not yet arrived"} />
          <HeroStat icon={<Sparkles size={15} />} label="Status" value={countdownLabel(team, arrived)} />
        </div>

        <Button
          className="mt-5 w-full"
          size="lg"
          onClick={() => setArrivalSheetOpen(true)}
          data-tour="venue-arrival-button"
        >
          <Zap size={17} className="mr-2 inline" />
          Simulate Venue Arrival
        </Button>
      </section>

      {!planAccepted && (
        <section className={`rounded-3xl border bg-white/5 p-4 ${styles.accentBorder}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Pregame plan ready</p>
              <p className="mt-1 text-sm text-silver-400">
                Accept tonight&apos;s plan to lock in your venue flow and earn a quick rewards boost.
              </p>
            </div>
            <ShieldCheck className="shrink-0 text-accent-gold" size={20} />
          </div>
          <Button className="mt-4 w-full" variant="secondary" onClick={handlePlanAccept}>
            Accept Plan +150 pts
          </Button>
        </section>
      )}

      <TicketWalletCard
        ticket={ticket}
        game={game}
        onViewFullScreen={() => setTicketSheetOpen(true)}
        onUpgrade={() => setUpgradeSheetOpen(true)}
      />

      <section className="grid gap-3 sm:grid-cols-2">
        <InfoPanel icon={<DoorOpen size={16} />} title="Recommended Gate" body={ticket.gate} highlight={arrived ? "Entry active" : "Fastest current entry"} />
        <InfoPanel icon={<Train size={16} />} title="Transit Guidance" body={transitLabel(team)} highlight="Illustrative demo data" />
      </section>

      <section
        className={`rounded-3xl border border-white/10 bg-white/5 p-4 transition-all ${
          arrived ? "shadow-[0_0_30px_rgba(255,214,90,0.08)]" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Seat upgrade</p>
            <p className="mt-1 text-sm text-silver-400">See better inventory, compare rewards savings, and update your ticket instantly.</p>
          </div>
          {arrived && <span className="rounded-full bg-accent-green/15 px-3 py-1 text-xs font-semibold text-green-200">Now live</span>}
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() => setUpgradeSheetOpen(true)}
          data-tour="seat-upgrade"
        >
          Upgrade My Seat
          <ArrowRight size={16} className="ml-2 inline" />
        </Button>
      </section>

      <section className={`rounded-3xl border border-white/10 bg-white/5 p-4 ${arrived ? "ring-1 ring-accent-green/20" : ""}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Food near your section</p>
            <p className="mt-1 text-sm text-silver-400">Illustrative wait times refresh for the active team experience.</p>
          </div>
          <UtensilsCrossed className="text-accent-gold" size={18} />
        </div>

        <div className="mt-4 space-y-3">
          {foodOptions.map((option) => (
            <div key={option.id} className="rounded-2xl border border-white/10 bg-navy-900/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{option.name}</p>
                  <p className="mt-1 text-sm text-silver-400">{option.location}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-silver-100">
                  {option.waitMinutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleMerchClick}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">Fan gear pick</p>
              <p className="mt-1 text-sm text-silver-400">{team === "leafs" ? "Find a Matthews Jersey" : "Find a Jays Hat"}</p>
            </div>
            <Shirt className="text-accent-gold" size={18} />
          </div>
          <p className="mt-3 text-sm text-silver-300">
            {merchItem?.name ?? "Recommended fan gear"} · tap to surface your recommendation.
          </p>
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">Rewards mission</p>
              <p className="mt-1 text-sm text-silver-400">Keep momentum going before puck drop or first pitch.</p>
            </div>
            <Trophy className="text-accent-gold" size={18} />
          </div>

          {mission ? (
            <>
              <p className="mt-4 text-sm font-medium text-white">{mission.name}</p>
              <p className="mt-1 text-sm text-silver-400">{mission.description}</p>
              <div className="mt-3">
                <ProgressBar
                  value={mission.progress}
                  max={mission.target}
                  label={`+${mission.pointsReward} pts`}
                  showValue
                />
              </div>
              <Button className="mt-4 w-full" variant="secondary" onClick={handleMissionBump}>
                Update Mission Progress
              </Button>
            </>
          ) : (
            <p className="mt-4 text-sm text-silver-300">All missions completed. Great work.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">Ask Cito</p>
            <p className="mt-1 text-sm text-silver-400">Jump into guided actions for ticketing, food, merch, and rewards.</p>
          </div>
          <Ticket className="text-accent-gold" size={18} />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {citoActionsByTeam[team].map((label) => (
            <Chip key={label} label={label} onClick={() => navigate("/cito")} />
          ))}
        </div>
      </section>

      <Sheet open={ticketSheetOpen} onClose={() => setTicketSheetOpen(false)} title="Full-Screen Mobile Ticket" fullScreen>
        <div className="space-y-4">
          <TicketWalletCard
            ticket={ticket}
            game={game}
            onViewFullScreen={() => undefined}
            onUpgrade={() => setUpgradeSheetOpen(true)}
            expanded
            hideActions
          />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-silver-300">
            Keep this screen ready at the gate. Your status updates automatically after venue arrival.
          </div>
        </div>
      </Sheet>

      <SeatUpgradeSheet open={upgradeSheetOpen} onClose={() => setUpgradeSheetOpen(false)} team={team} />

      <Sheet open={arrivalSheetOpen} onClose={() => setArrivalSheetOpen(false)} title="Venue Arrival" fullScreen>
        <VenueArrivalAnimation onComplete={handleArrivalComplete} />
      </Sheet>
    </div>
  );
}

function HeroStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-silver-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  body,
  highlight,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  highlight: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </div>
      <p className="mt-3 text-sm text-silver-200">{body}</p>
      <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-silver-300">
        <CircleCheckBig size={14} className="mr-1.5" />
        {highlight}
      </div>
    </div>
  );
}
