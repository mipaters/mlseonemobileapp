import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Navigation,
  Play,
  Share2,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Ticket,
  Train,
  Trophy,
  Wallet,
} from "lucide-react";
import { CONTENT_ITEMS } from "../../data/content";
import { FOOD_OPTIONS, SEAT_UPGRADES, gameByTeam } from "../../data/gameDay";
import { MERCHANDISE, merchById } from "../../data/merchandise";
import { REWARDS } from "../../data/rewards";
import { teamById } from "../../data/teams";
import { useAppState } from "../../store/AppState";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import type { ContentItem, GeneratedReel, MerchandiseItem, TeamId } from "../../types";

interface SharedCardProps {
  userText?: string;
  onPromptSelect?: (text: string) => void;
  onFocusInput?: () => void;
}

function CardShell({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="animate-fade-up rounded-3xl border border-white/10 bg-navy-900/80 p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-gold">{eyebrow}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 p-2 text-accent-gold">{icon}</div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-silver-400">{label}</span>
      <span className={`text-right ${accent ? "font-semibold text-white" : "text-silver-200"}`}>{value}</span>
    </div>
  );
}

function highlightPrice(price: number, discount: number, applyRewards: boolean) {
  if (!applyRewards) return `$${price}`;
  return `$${Math.max(0, price - discount)}`;
}

function filterWatchItems(userText: string | undefined) {
  const query = userText?.toLowerCase() ?? "";

  if (query.includes("matthews")) {
    return CONTENT_ITEMS.filter((item) => item.title.toLowerCase().includes("matthews")).slice(0, 3);
  }

  if (query.includes("vladdy") || query.includes("guerrero")) {
    return CONTENT_ITEMS.filter((item) => item.title.toLowerCase().includes("guerrero")).slice(0, 3);
  }

  if (query.includes("attend") || query.includes("which game")) {
    return CONTENT_ITEMS.filter((item) => item.category === "Game Preview" || item.category === "Experience").slice(0, 3);
  }

  return CONTENT_ITEMS.filter((item) => item.teamId === "both" || item.category === "Game Recap").slice(0, 3);
}

function filterMerchItems(userText: string | undefined, activeTeam: TeamId) {
  const query = userText?.toLowerCase() ?? "";
  const preferredTeam: TeamId | "both" =
    query.includes("jays") || query.includes("vladdy") || query.includes("guerrero")
      ? "jays"
      : query.includes("leafs") || query.includes("matthews")
        ? "leafs"
        : activeTeam;

  const preferredCategory = query.includes("jersey")
    ? "Jersey"
    : query.includes("hat") || query.includes("cap")
      ? "Headwear"
      : null;

  const primary = MERCHANDISE.filter(
    (item) =>
      (item.teamId === preferredTeam || item.teamId === "both") &&
      (preferredCategory ? item.category === preferredCategory : true)
  );

  if (primary.length >= 3) return primary.slice(0, 3);

  const fallback = MERCHANDISE.filter((item) => item.teamId === preferredTeam || item.teamId === "both");
  return Array.from(new Map([...primary, ...fallback].map((item) => [item.id, item])).values()).slice(0, 3);
}

function videoGradient(length: number) {
  return length === 2
    ? "from-leafs-700 via-navy-900 to-jays-700"
    : length === 5
      ? "from-accent-gold/35 via-navy-900 to-jays-700"
      : "from-jays-700 via-navy-900 to-leafs-700";
}

export function CitoWeekendCard({ onFocusInput }: SharedCardProps) {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const leafsGame = gameByTeam("leafs");
  const jaysGame = gameByTeam("jays");
  const mission = state.missions.find((entry) => !entry.completed);
  const preview = CONTENT_ITEMS.find((item) => item.id === "combined-personalized-recap") ?? CONTENT_ITEMS[0];

  return (
    <CardShell eyebrow="Toronto Sports Weekend" title="Your personalized doubleheader itinerary" icon={<Sparkles size={16} />}>
      <div className="space-y-4">
        <div className="grid gap-3">
          {leafsGame ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-white">Saturday · Leafs</p>
              <p className="mt-1 text-sm text-silver-300">
                {leafsGame.timeLabel} vs {leafsGame.opponent} at {leafsGame.venue}
              </p>
            </div>
          ) : null}
          {jaysGame ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-white">Sunday · Jays</p>
              <p className="mt-1 text-sm text-silver-300">
                {jaysGame.timeLabel} vs {jaysGame.opponent} at {jaysGame.venue}
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
          <DetailRow label="Watch first" value={preview.title} accent />
          <DetailRow label="Ticket note" value="Your Leafs and Jays mobile tickets are ready to open." />
          <DetailRow label="Mission pick" value={mission ? `${mission.name} · ${mission.progress}/${mission.target}` : "All missions complete"} />
          <DetailRow label="Transit + weather" value="TTC + GO look clear. Expect cool Saturday and a brighter Sunday." />
          <DetailRow label="Recommended next step" value="Open your tickets tonight, then save a combined recap for Sunday night." />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => {
              actions.showToast("Added to My Plan");
              actions.addSignal("Added Toronto sports weekend plan");
            }}
          >
            Add to My Plan
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate("/gameday")}>
            View Tickets
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate("/watch")}>
            Watch Preview
          </Button>
          <Button size="sm" variant="ghost" onClick={onFocusInput}>
            Ask Follow-Up
          </Button>
        </div>
      </div>
    </CardShell>
  );
}

export function CitoGameDayPlanCard({ team }: { team: TeamId }) {
  const { state, actions } = useAppState();
  const teamInfo = teamById(team);
  const game = gameByTeam(team);
  const ticket = state.tickets.find((entry) => entry.teamId === team);
  const food = FOOD_OPTIONS[team][0];
  const mission = state.missions.find((entry) => !entry.completed);
  const merch = team === "leafs" ? merchById("matthews-jersey") : merchById("jays-cap");
  const planAccepted = state.gameDayPlanAccepted[team];

  if (!game || !ticket || !teamInfo || !food) {
    return (
      <CardShell eyebrow="Game-Day Agent" title="Plan details are warming up" icon={<ShieldCheck size={16} />}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-silver-300">
          I&apos;m still syncing the latest game-day details for you.
        </div>
      </CardShell>
    );
  }

  const departureTime = team === "leafs" ? "Leave by 5:45 PM" : "Leave by 11:45 AM";
  const arrivalTime = team === "leafs" ? "Aim to arrive by 6:20 PM" : "Aim to arrive by 12:20 PM";
  const transit = team === "leafs" ? "TTC Line 1 to Union, then a short indoor walk." : "GO + Union transfer keeps you on track for first pitch.";
  const extraLine =
    team === "leafs"
      ? "Seat-upgrade windows usually stay open through warmups."
      : "Batting practice access is best if you enter no later than 12:10 PM.";

  return (
    <CardShell eyebrow={`${teamInfo.shortName} Game-Day`} title={`${teamInfo.name} plan ready`} icon={<CalendarClock size={16} />}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Mobile ticket</p>
              <p className="mt-1 text-sm text-silver-300">
                Section {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
              </p>
            </div>
            <div className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold text-accent-gold">{ticket.gate}</div>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
          <DetailRow label="Game" value={`${game.dateLabel} · ${game.timeLabel} vs ${game.opponent}`} accent />
          <DetailRow label="Departure" value={departureTime} />
          <DetailRow label="Transit" value={transit} />
          <DetailRow label="Arrival" value={arrivalTime} />
          <DetailRow label="Gate" value={ticket.gate} />
          <DetailRow label="Seat location" value={`Section ${ticket.section}, Row ${ticket.row}, Seat ${ticket.seat}`} />
          <DetailRow label="Food pick" value={`${food.name} · ${food.location}`} />
          <DetailRow label="Upgrade note" value={extraLine} />
          <DetailRow label="Gear pick" value={merch?.name ?? "Toronto crossover hoodie"} />
          <DetailRow label="Rewards mission" value={mission ? mission.name : "You&apos;re caught up on missions"} />
          {team === "jays" ? <DetailRow label="Recap preference" value="Quick 2-minute post-game recap is queued for you." /> : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="secondary" onClick={() => actions.showToast("Added to your calendar")}>
            Add to Calendar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              actions.acceptGameDayPlan(team);
              actions.addSignal(`Accepted ${team === "leafs" ? "Leafs" : "Jays"} game-day plan`);
              actions.addAgentActivity("Game-Day Agent", `${team === "leafs" ? "Leafs" : "Jays"} game-day plan accepted`);
              actions.showToast("Game-day plan accepted! You earned bonus points.");
            }}
            disabled={planAccepted}
          >
            {planAccepted ? "Plan accepted ✓" : "Accept Plan"}
          </Button>
        </div>
      </div>
    </CardShell>
  );
}

export function CitoHighlightPackageCard() {
  const { actions } = useAppState();
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [mode, setMode] = useState<"select" | "assembling" | "ready">("select");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [reel, setReel] = useState<GeneratedReel | null>(null);
  const timersRef = useRef<number[]>([]);
  const phases = ["Searching the content library…", "Ranking the top Matthews and Vladdy moments…", "Assembling the video…"];

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const startAssembly = (length: number) => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    setSelectedLength(length);
    setMode("assembling");
    setPhaseIndex(0);

    [1, 2].forEach((index) => {
      const timer = window.setTimeout(() => setPhaseIndex(index), index * 500);
      timersRef.current.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      const generated: GeneratedReel = {
        id: `reel-${Date.now()}`,
        title: "Matthews & Guerrero Jr. Highlights",
        teamId: "both",
        lengthMinutes: length,
        createdAt: new Date().toISOString(),
        chapters: ["Matthews Moments", "Guerrero Jr. Moments", "Combined Recap"],
      };

      actions.addReel(generated);
      actions.addSignal("Generated combined highlight package");
      actions.addAgentActivity("Video Assembly Agent", "Highlight package assembled");
      actions.showToast("Your highlight reel is ready and saved to your Digital Locker");
      setReel(generated);
      setMode("ready");
    }, 1600);

    timersRef.current.push(finishTimer);
  };

  return (
    <CardShell eyebrow="Video Assembly Agent" title="Build your combined highlight package" icon={<Play size={16} />}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[2, 5, 10].map((length) => (
            <Chip
              key={length}
              label={`${length} minutes`}
              active={selectedLength === length}
              onClick={() => startAssembly(length)}
            />
          ))}
        </div>

        {mode === "assembling" ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            {phases.map((phase, index) => (
              <div key={phase} className="flex items-center gap-3 text-sm">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    index < phaseIndex ? "bg-accent-green" : index === phaseIndex ? "animate-pulse bg-accent-gold" : "bg-white/20"
                  }`}
                />
                <span className={index <= phaseIndex ? "text-white" : "text-silver-400"}>{phase}</span>
              </div>
            ))}
          </div>
        ) : null}

        {mode === "ready" && reel && selectedLength ? (
          <div className="space-y-4">
            <div className={`overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${videoGradient(selectedLength)} p-5`}>
              <div className="flex min-h-36 items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">Ready to play</p>
                  <h4 className="mt-2 text-xl font-bold text-white">{reel.title}</h4>
                  <p className="mt-2 text-sm text-silver-200">{selectedLength}-minute reel · saved to your Digital Locker</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white">
                  <Play size={22} className="ml-1" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-sm font-semibold text-white">Included chapters</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {reel.chapters.map((chapter) => (
                  <span key={chapter} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver-200">
                    {chapter}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => actions.showToast("Already saved to your Digital Locker")}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={() => actions.showToast("Share link copied")}>
                <Share2 size={14} className="mr-1 inline" />
                Share
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </CardShell>
  );
}

export function CitoRewardsCard() {
  const { state, actions } = useAppState();
  const affordable = REWARDS.filter((reward) => reward.pointCost <= state.rewardsBalance);
  const rewardOptions = affordable.length > 0 ? affordable.slice(0, 4) : [...REWARDS].sort((a, b) => a.pointCost - b.pointCost).slice(0, 3);

  return (
    <CardShell eyebrow="Rewards Agent" title="Rewards you can use right now" icon={<Trophy size={16} />}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-accent-gold/20 bg-accent-gold/10 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Current balance</p>
          <p className="mt-1 text-2xl font-bold text-white">{state.rewardsBalance.toLocaleString()} pts</p>
        </div>

        <div className="space-y-3">
          {rewardOptions.map((reward) => {
            const canRedeem = state.rewardsBalance >= reward.pointCost;

            return (
              <div key={reward.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{reward.name}</p>
                    <p className="mt-1 text-sm text-silver-300">{reward.description}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-silver-100">
                    {reward.pointCost.toLocaleString()} pts
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  disabled={!canRedeem}
                  onClick={() => {
                    actions.redeemReward(reward.id, reward.pointCost);
                    actions.addSignal(`Redeemed reward: ${reward.name}`);
                    actions.addAgentActivity("Rewards Agent", "Reward redeemed via Ask Cito");
                    actions.showToast(`Redeemed: ${reward.name}`);
                  }}
                >
                  {canRedeem ? "Redeem" : "Need more points"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}

export function CitoSeatUpgradeCard() {
  const { state, actions } = useAppState();
  const team = state.activeGameDayTeam;
  const options = SEAT_UPGRADES[team];
  const recommended = options.find((option) => option.recommended) ?? options[0];
  const currentTicket = state.tickets.find((entry) => entry.teamId === team);
  const [selectedId, setSelectedId] = useState(recommended.id);
  const [compareAll, setCompareAll] = useState(false);
  const [applyRewards, setApplyRewards] = useState(true);

  useEffect(() => {
    setSelectedId(recommended.id);
    setCompareAll(false);
    setApplyRewards(true);
  }, [recommended.id, team]);

  const selected = options.find((option) => option.id === selectedId) ?? recommended;
  const visible = compareAll ? options : [selected];

  return (
    <CardShell eyebrow="Game-Day Agent" title="Seat upgrade comparison" icon={<Ticket size={16} />}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Current seat</p>
              <p className="mt-1 text-sm text-silver-300">
                {currentTicket ? `Section ${currentTicket.section}, Row ${currentTicket.row}, Seat ${currentTicket.seat}` : "Saved ticket on file"}
              </p>
            </div>
            <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold text-accent-gold">
              {state.rewardsBalance.toLocaleString()} pts
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip label={compareAll ? "Comparing all options" : "Focus on selected"} active={compareAll} onClick={() => setCompareAll((value) => !value)} />
            <Chip label={applyRewards ? "Rewards applied" : "Apply rewards"} active={applyRewards} onClick={() => setApplyRewards((value) => !value)} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {options.map((option) => (
            <Chip key={option.id} label={option.section} active={selectedId === option.id} onClick={() => setSelectedId(option.id)} />
          ))}
        </div>

        <div className="grid gap-3">
          {visible.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedId(option.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                option.id === selected.id ? "border-accent-gold bg-accent-gold/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{option.section}</p>
                    {option.recommended ? (
                      <span className="rounded-full bg-accent-green/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-200">
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-silver-300">{option.description}</p>
                </div>
                {option.id === selected.id ? <CheckCircle2 size={18} className="text-accent-gold" /> : null}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-2 text-silver-300">{option.distanceFromCurrent}</div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-2 text-silver-300">Save {option.rewardsDiscount} pts</div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-2 font-semibold text-white">
                  {highlightPrice(option.priceDifference, option.rewardsDiscount, applyRewards)}
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            actions.upgradeSeat(team, selected.section);
            actions.addSignal("Upgraded seat via Ask Cito");
            actions.addAgentActivity("Game-Day Agent", "Seat upgrade recommended and accepted");
            actions.showToast("Seat upgraded! Your ticket has been updated.");
          }}
        >
          Confirm Upgrade
        </Button>
      </div>
    </CardShell>
  );
}

export function CitoMerchandiseCard({ userText }: SharedCardProps) {
  const { state, actions } = useAppState();
  const items = useMemo(() => filterMerchItems(userText, state.activeGameDayTeam), [state.activeGameDayTeam, userText]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const readSize = (item: MerchandiseItem) => selectedSizes[item.id] ?? item.sizes[0];

  return (
    <CardShell eyebrow="Commerce Agent" title="Fan gear picked for Mike" icon={<Shirt size={16} />}>
      <div className="space-y-3">
        {items.map((item) => {
          const selectedSize = readSize(item);
          const redeemCost = item.price * 100;
          const canRedeem = state.rewardsBalance >= redeemCost;

          return (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className={`rounded-2xl bg-gradient-to-br ${item.teamId === "jays" ? "from-jays-700 to-navy-900" : item.teamId === "leafs" ? "from-leafs-700 to-navy-900" : "from-accent-gold/30 to-navy-900"} p-3`}>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-silver-200">${item.price} · {item.category}</p>
              </div>

              <p className="mt-3 text-sm text-silver-300">{item.reason}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    active={selectedSize === size}
                    onClick={() => setSelectedSizes((current) => ({ ...current, [item.id]: size }))}
                  />
                ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button size="sm" variant="secondary" onClick={() => actions.showToast(`Saved ${item.name} for later`)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    actions.addToCart({ itemId: item.id, size: selectedSize, color: item.colors[0], quantity: 1 });
                    actions.addSignal(`Added ${item.name} to cart via Ask Cito`);
                    actions.showToast(`${item.name} added to cart`);
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!canRedeem}
                  onClick={() => {
                    actions.redeemReward(`merch-${item.id}`, redeemCost);
                    actions.showToast(`Redeemed points for ${item.name}`);
                  }}
                >
                  Redeem Points
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

export function CitoVenueHelpCard({ userText }: SharedCardProps) {
  const { state, actions } = useAppState();
  const team = state.activeGameDayTeam;
  const ticket = state.tickets.find((entry) => entry.teamId === team);
  const food = FOOD_OPTIONS[team][0];
  const query = userText?.toLowerCase() ?? "";

  const destination = query.includes("gate")
    ? { title: ticket?.gate ?? "Main gate", subtitle: "Head toward the illuminated entry signs by the arena windows.", walk: "3 minute walk", wait: "Entry line is moving well right now." }
    : query.includes("eat") || query.includes("food")
      ? { title: food.name, subtitle: food.location, walk: "4 minute walk", wait: `${food.waitMinutes} minute estimated wait` }
      : query.includes("seat")
        ? { title: `Section ${ticket?.section ?? "114"} · Row ${ticket?.row ?? "12"} · Seat ${ticket?.seat ?? "7"}`, subtitle: "Follow the nearest section markers and take the left aisle.", walk: "5 minute walk", wait: "No queue expected." }
        : { title: "Merchandise Store", subtitle: team === "leafs" ? "Team Store near Section 111" : "Jays Shop near Gate 9", walk: "4 minute walk", wait: "Checkout line looks light." };

  return (
    <CardShell eyebrow="Venue Help" title="Quick wayfinding from your current spot" icon={<Navigation size={16} />}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MapPin size={16} className="text-accent-gold" />
            Current location: Main Concourse
          </div>
          <p className="mt-2 text-sm text-silver-300">{destination.subtitle}</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
          <DetailRow label="Destination" value={destination.title} accent />
          <DetailRow label="Walk time" value={destination.walk} />
          <DetailRow label="Direction cue" value="Stay on the main concourse, then follow the closest overhead section marker." />
          <DetailRow label="Wait time" value={destination.wait} />
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            actions.addAgentActivity("Game-Day Agent", "Wayfinding guidance surfaced in Ask Cito");
            actions.showToast("Directions shown");
          }}
        >
          Get Directions
        </Button>
      </div>
    </CardShell>
  );
}

export function CitoTicketCard() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const team = state.activeGameDayTeam;
  const teamInfo = teamById(team);
  const ticket = state.tickets.find((entry) => entry.teamId === team);
  const game = gameByTeam(team);

  if (!ticket || !game || !teamInfo) {
    return (
      <CardShell eyebrow="Ticket Wallet" title="Ticket unavailable" icon={<CreditCard size={16} />}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-silver-300">
          I couldn&apos;t find a saved mobile ticket just yet.
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell eyebrow="Ticket Wallet" title={`${teamInfo.shortName} mobile ticket`} icon={<CreditCard size={16} />}>
      <div className="space-y-4">
        <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${team === "leafs" ? "from-leafs-700 to-navy-900" : "from-jays-700 to-navy-900"} p-4`}>
          <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">{game.dateLabel} · {game.timeLabel}</p>
          <h4 className="mt-2 text-xl font-bold text-white">{teamInfo.name}</h4>
          <p className="mt-1 text-sm text-silver-200">vs {game.opponent} at {game.venue}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">Section {ticket.section}</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">Row {ticket.row} · Seat {ticket.seat}</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">{ticket.gate}</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">{ticket.status}</div>
        </div>

        <Button size="sm" className="w-full" onClick={() => navigate("/gameday")}>
          View Full Ticket
        </Button>
      </div>
    </CardShell>
  );
}

export function CitoWatchSuggestionsCard({ userText }: SharedCardProps) {
  const navigate = useNavigate();
  const suggestions = filterWatchItems(userText);

  return (
    <CardShell eyebrow="Content Curation" title="What to watch next" icon={<Play size={16} />}>
      <div className="space-y-3">
        {suggestions.map((item) => (
          <WatchSuggestionRow key={item.id} item={item} onWatch={() => navigate("/watch")} />
        ))}
      </div>
    </CardShell>
  );
}

function WatchSuggestionRow({ item, onWatch }: { item: ContentItem; onWatch: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{item.title}</p>
          <p className="mt-1 text-sm text-silver-300">{item.description}</p>
          <p className="mt-2 text-xs text-accent-gold">{item.reason}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={onWatch}>
          Watch
        </Button>
      </div>
    </div>
  );
}

export function CitoFallbackCard({ onPromptSelect }: SharedCardProps) {
  const fallbackPrompts = [
    "What's happening this weekend?",
    "Plan my night at the Leafs game.",
    "Plan my afternoon at the Jays game.",
    "Build me a five-minute highlight reel.",
    "What can I get with my points?",
    "Where should I eat at the venue?",
  ];

  return (
    <CardShell eyebrow="Ask Cito" title="Here are a few good next moves" icon={<Star size={16} />}>
      <div className="space-y-3">
        <p className="text-sm text-silver-300">
          I can help with weekend plans, game-day prep, highlights, rewards, seat upgrades, tickets, gear, and venue help.
        </p>
        <div className="flex flex-wrap gap-2">
          {fallbackPrompts.map((prompt) => (
            <Chip key={prompt} label={prompt} onClick={onPromptSelect ? () => onPromptSelect(prompt) : undefined} />
          ))}
        </div>
      </div>
    </CardShell>
  );
}

export function CitoStatPills() {
  const { state } = useAppState();
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
        <Clock3 size={16} className="mx-auto text-accent-gold" />
        <p className="mt-2 text-xs text-silver-400">Rewards</p>
        <p className="text-sm font-semibold text-white">{state.rewardsBalance.toLocaleString()}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
        <Train size={16} className="mx-auto text-accent-gold" />
        <p className="mt-2 text-xs text-silver-400">Active team</p>
        <p className="text-sm font-semibold text-white">{state.activeGameDayTeam === "leafs" ? "Leafs" : "Jays"}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
        <Wallet size={16} className="mx-auto text-accent-gold" />
        <p className="mt-2 text-xs text-silver-400">Locker</p>
        <p className="text-sm font-semibold text-white">{state.digitalLocker.length} items</p>
      </div>
    </div>
  );
}
