import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAppState } from "../store/AppState";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ScrollRow } from "../components/ui/ScrollRow";
import { ContentCard } from "../components/ui/ContentCard";
import { ContentDetailSheet } from "../components/content/ContentDetailSheet";
import { StandingsSection, ScoringLeadersSection } from "../components/home/StandingsSection";
import { TeamNewsSection } from "../components/home/TeamNewsSection";
import { ArenaExperienceBanner } from "../components/home/ArenaExperienceBanner";
import { PartnerOffersSection } from "../components/home/PartnerOffersSection";
import { AskCitoBanner } from "../components/home/AskCitoBanner";
import copilotLogo from "../assets/microsoft-copilot-logo.png";
import { CONTENT_ROWS, CONTENT_ITEMS, contentById } from "../data/content";
import { MIKE_PROFILE } from "../data/profile";
import { gameByTeam } from "../data/gameDay";
import { MISSIONS } from "../data/rewards";

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const [openContentId, setOpenContentId] = useState<string | null>(null);

  const leafsGame = gameByTeam("leafs");
  const jaysGame = gameByTeam("jays");
  const activeMission = useMemo(() => state.missions.find((m) => !m.completed) ?? MISSIONS[0], [state.missions]);

  const visibleRows = CONTENT_ROWS.filter((row) => row.id !== "becauseYouFollowBoth" && row.id !== "recommendedExperiences").map(
    (row) => ({
      ...row,
      items: row.itemIds.map(contentById).filter((c): c is NonNullable<typeof c> => !!c && !state.hiddenContent.includes(c.id)),
    })
  );

  return (
    <div className="pb-6">
      <div className="px-4 pt-4" data-tour="hero-card">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-accent-teal">
          <Sparkles size={10} /> Made for you
        </p>
        <p className="font-display text-2xl font-semibold uppercase tracking-tight text-white mt-0.5">
          {timeOfDayGreeting()}, {MIKE_PROFILE.name.split(" ")[0]}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-silver-400 mt-0.5">
          <img src={copilotLogo} alt="Microsoft Copilot" className="h-4 w-4" />
          Your Leafs and Jays world, personalized by Microsoft Copilot.
        </p>

        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-leafs-700 via-navy-800 to-jays-700 p-4">
          <p className="text-xs uppercase tracking-wide text-accent-gold font-semibold">Your Toronto Sports Weekend</p>
          <div className="mt-2 space-y-1 text-sm text-silver-100">
            {leafsGame && (
              <p>
                🍁 Leafs vs {leafsGame.opponent} — {leafsGame.dateLabel}, {leafsGame.timeLabel}
              </p>
            )}
            {jaysGame && (
              <p>
                ⚾ Jays vs {jaysGame.opponent} — {jaysGame.dateLabel}, {jaysGame.timeLabel}
              </p>
            )}
            <p className="text-silver-400">Recommended: {activeMission.name} · +{activeMission.pointsReward} pts</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => navigate("/gameday")}>
              See My Weekend
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate("/cito")}>
              <Sparkles size={14} className="inline mr-1 -mt-0.5" /> Ask Cito
            </Button>
          </div>
        </div>

        <ArenaExperienceBanner />
      </div>

      {visibleRows.map((row) => (
        <ScrollRow key={row.id} title={row.title} eyebrow={row.id === "forYou" ? "Made for you" : undefined}>
          {row.items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              liked={state.likedContent.includes(item.id)}
              saved={state.savedContent.includes(item.id)}
              onOpen={() => setOpenContentId(item.id)}
              onLike={() => actions.toggleLike(item.id)}
              onSave={() => actions.toggleSave(item.id)}
            />
          ))}
        </ScrollRow>
      ))}

      <StandingsSection />
      <ScoringLeadersSection />
      <TeamNewsSection />
      <PartnerOffersSection />
      <AskCitoBanner />

      <ContentDetailSheet
        item={openContentId ? CONTENT_ITEMS.find((c) => c.id === openContentId) ?? null : null}
        onClose={() => setOpenContentId(null)}
      />
    </div>
  );
}
