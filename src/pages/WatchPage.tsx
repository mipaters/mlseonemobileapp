import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Maximize,
  Minimize2,
  Pause,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import { CONTENT_ITEMS, DAILY_RECAP_CHAPTERS, contentById } from "../data/content";
import { GAMES } from "../data/gameDay";
import { FAN_DNA_BASE, MIKE_PROFILE } from "../data/profile";
import { playerById, teamById } from "../data/teams";
import { useAppState } from "../store/AppState";
import { HighlightBuilderSheet } from "../components/watch/HighlightBuilderSheet";
import { ContentDetailSheet } from "../components/content/ContentDetailSheet";
import { Button } from "../components/ui/Button";
import { ContentCard } from "../components/ui/ContentCard";
import { ProgressBar } from "../components/ui/ProgressBar";
import { ScrollRow } from "../components/ui/ScrollRow";
import dailyRecapBackground from "../assets/vladdy-jays-recap-background.jpg";

const DAILY_RECAP_ID = "daily-recap";
const TOTAL_RECAP_SECONDS = DAILY_RECAP_CHAPTERS.length * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function chapterTime(index: number) {
  return index * 60;
}

export function WatchPage() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [openContentId, setOpenContentId] = useState<string | null>(null);
  const watchedOnceRef = useRef(state.watchedContent.includes(DAILY_RECAP_ID));

  const recapSaved = state.savedContent.includes(DAILY_RECAP_ID);
  const matthews = playerById(MIKE_PROFILE.favouriteLeafsPlayer)?.name ?? "Auston Matthews";
  const vladdy = playerById(MIKE_PROFILE.favouriteJaysPlayer)?.name ?? "Vladimir Guerrero Jr.";

  const currentChapterIndex = Math.min(
    DAILY_RECAP_CHAPTERS.length - 1,
    Math.floor(elapsedSeconds / 60)
  );

  const relatedHighlights = useMemo(
    () =>
      CONTENT_ITEMS.filter((item) =>
        ["Goals", "Home Runs", "Game Recap"].includes(item.category)
      ).slice(0, 6),
    []
  );

  const selectedContent = openContentId ? contentById(openContentId) ?? null : null;

  useEffect(() => {
    if (state.watchedContent.includes(DAILY_RECAP_ID)) {
      watchedOnceRef.current = true;
    }
  }, [state.watchedContent]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => {
        if (current >= TOTAL_RECAP_SECONDS) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return TOTAL_RECAP_SECONDS;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      setElapsedSeconds(0);
    };
  }, []);

  function togglePlayback() {
    if (!watchedOnceRef.current) {
      watchedOnceRef.current = true;
      actions.markWatched(DAILY_RECAP_ID);
      actions.addSignal("Watched Daily Toronto Sports Recap");
      actions.addAgentActivity("Content Curation Agent", "Daily recap watched");
    }

    setIsPlaying((current) => !current);
  }

  function jumpToChapter(index: number) {
    setElapsedSeconds(chapterTime(index));
  }

  function toggleSaveRecap() {
    actions.toggleSave(DAILY_RECAP_ID);
    actions.showToast(recapSaved ? "Removed daily recap from saved" : "Saved daily recap to your library");
  }

  const playerCard = (
    <div
      className={`overflow-hidden rounded-[28px] border border-white/10 bg-navy-900 shadow-2xl ${
        isFullScreen ? "h-full rounded-none border-0" : ""
      }`}
      data-tour="daily-recap-player"
    >
      <div className="relative overflow-hidden">
        <div
          className={`relative flex items-end overflow-hidden bg-cover bg-center ${
            isFullScreen ? "min-h-[46vh]" : "min-h-[17rem]"
          }`}
          style={{ backgroundImage: `url(${dailyRecapBackground})` }}
        >
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.14),_transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative z-10 flex w-full items-end justify-between p-5">
            <div className="max-w-[75%]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Featured Daily Recap</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-white">Your Daily Toronto Sports Recap</h2>
              <p className="mt-2 text-sm text-silver-200">One recap built around the teams and players you care about.</p>
            </div>

            <button
              type="button"
              aria-label={isPlaying ? "Pause recap" : "Play recap"}
              onClick={togglePlayback}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between text-xs text-silver-300">
          <span>{formatTime(elapsedSeconds)}</span>
          <span>{formatTime(TOTAL_RECAP_SECONDS)}</span>
        </div>

        <div className="space-y-3">
          <ProgressBar value={elapsedSeconds} max={TOTAL_RECAP_SECONDS} colorClassName="bg-accent-gold" />
          <div className="relative h-3">
            {DAILY_RECAP_CHAPTERS.map((chapter, index) => {
              const left = `${(index / (DAILY_RECAP_CHAPTERS.length - 1)) * 100}%`;
              const isCurrent = index === currentChapterIndex;

              return (
                <button
                  key={chapter}
                  type="button"
                  aria-label={`Jump to ${chapter}`}
                  onClick={() => jumpToChapter(index)}
                  className={`absolute top-0 -translate-x-1/2 transition-transform ${isCurrent ? "scale-125" : "hover:scale-110"}`}
                  style={{ left }}
                >
                  <span
                    className={`block h-3 w-3 rounded-full border ${
                      isCurrent ? "border-accent-gold bg-accent-gold" : "border-white/30 bg-navy-800"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DAILY_RECAP_CHAPTERS.map((chapter, index) => (
              <button
                key={chapter}
                type="button"
                onClick={() => jumpToChapter(index)}
                className={`rounded-2xl border px-3 py-2 text-left text-xs transition-colors ${
                  index === currentChapterIndex
                    ? "border-accent-gold/40 bg-accent-gold/10 text-white"
                    : "border-white/10 bg-white/5 text-silver-300"
                }`}
              >
                <p className="font-semibold">{chapter}</p>
                <p className="mt-1 text-[11px] text-silver-400">{formatTime(chapterTime(index))}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={togglePlayback}>
            {isPlaying ? <Pause size={14} className="mr-1 inline -mt-0.5" /> : <Play size={14} className="mr-1 inline -mt-0.5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleSaveRecap}>
            <Bookmark size={14} className={`mr-1 inline -mt-0.5 ${recapSaved ? "fill-accent-gold text-accent-gold" : ""}`} />
            {recapSaved ? "Saved" : "Save"}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => actions.showToast("Link copied to share your recap")}>
            <Share2 size={14} className="mr-1 inline -mt-0.5" /> Share
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate("/cito")}>
            <Sparkles size={14} className="mr-1 inline -mt-0.5" /> Ask Cito
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsFullScreen((current) => !current)}>
            {isFullScreen ? <Minimize2 size={14} className="mr-1 inline -mt-0.5" /> : <Maximize size={14} className="mr-1 inline -mt-0.5" />}
            {isFullScreen ? "Minimize" : "Full screen"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative pb-10 animate-fade-up">
      <div className="px-4 pt-4" data-tour="daily-recap">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Watch</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Your Daily Toronto Sports Recap</h1>
        <p className="mt-2 max-w-md text-sm text-silver-300">One recap built around the teams and players you care about.</p>
      </div>

      <div className="mt-4 px-4">{playerCard}</div>

      <div className="mt-4 px-4" data-tour="highlight-builder">
        <div className="rounded-3xl border border-accent-gold/20 bg-gradient-to-br from-accent-gold/15 via-navy-900 to-jays-700/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Copilot Builder</p>
              <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-white">Build My Highlight Reel</h2>
              <p className="mt-2 text-sm text-silver-300">
                Create a reel around {matthews} goals, {vladdy} power moments, or both.
              </p>
            </div>
            <CheckCircle2 size={18} className="mt-1 text-accent-gold" />
          </div>
          <Button size="lg" className="mt-4 w-full" onClick={() => setBuilderOpen(true)}>
            Build My Highlight Reel
          </Button>
        </div>
      </div>

      <section className="mt-5 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Why this recap was created for Mike</p>
              <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-tight text-white">Built around Mike&apos;s Toronto fan DNA</h2>
            </div>
            <Sparkles size={18} className="text-accent-gold" />
          </div>
          <p className="mt-3 text-sm text-silver-300">
            Mike follows both the Leafs and Jays, with strong affinity scores for each. Copilot prioritized {matthews} and {vladdy},
            blended team-wide momentum, and balanced short-form recap content with what&apos;s next.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-navy-900 p-3">
              <p className="text-silver-400">Leafs affinity</p>
              <p className="mt-1 text-lg font-semibold text-white">{FAN_DNA_BASE.leafsAffinity}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-900 p-3">
              <p className="text-silver-400">Jays affinity</p>
              <p className="mt-1 text-lg font-semibold text-white">{FAN_DNA_BASE.jaysAffinity}%</p>
            </div>
          </div>
        </div>
      </section>

      <ScrollRow title="Related Highlights">
        {relatedHighlights.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            compact
            liked={state.likedContent.includes(item.id)}
            saved={state.savedContent.includes(item.id)}
            onOpen={() => setOpenContentId(item.id)}
            onLike={() => actions.toggleLike(item.id)}
            onSave={() => actions.toggleSave(item.id)}
          />
        ))}
      </ScrollRow>

      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Upcoming Games</h2>
          <span className="text-xs text-silver-400">Illustrative demo schedule</span>
        </div>
        <div className="space-y-3">
          {GAMES.map((game) => {
            const team = teamById(game.teamId);

            return (
              <div key={game.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">{team?.shortName ?? game.teamId}</p>
                    <h3 className="mt-1 text-base font-semibold text-white">
                      {team?.name} vs {game.opponent}
                    </h3>
                    <p className="mt-1 text-sm text-silver-300">
                      {game.dateLabel} · {game.timeLabel} · {game.venue}
                    </p>
                  </div>
                  {game.isNext && <span className="rounded-full bg-accent-green/15 px-3 py-1 text-xs font-semibold text-accent-green">Next up</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Recommended Reward</p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-tight text-white">Redeem a content boost for your next recap</h2>
          <p className="mt-2 text-sm text-silver-300">
            Use your Platinum balance to unlock bonus angles, alternate commentary, and premium recap packaging.
          </p>
          <Button size="md" className="mt-4 w-full" onClick={() => navigate("/rewards")}>
            See Rewards <ChevronRight size={16} className="ml-1 inline" />
          </Button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Relevant Ticket Opportunity</p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-tight text-white">Turn today&apos;s recap into a live Toronto sports weekend</h2>
          <p className="mt-2 text-sm text-silver-300">
            Copilot spotted upcoming Leafs and Jays home dates that fit Mike&apos;s usual watch-and-attend behaviour.
          </p>
          <Button size="md" variant="secondary" className="mt-4 w-full" onClick={() => navigate("/gameday")}>
            View Ticket Options <ChevronRight size={16} className="ml-1 inline" />
          </Button>
        </div>
      </section>

      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-navy-950 p-4">
          <div className="mx-auto flex h-full max-w-xl flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Full screen recap</p>
                <p className="text-sm text-silver-300">Continue watching your personalized Toronto sports story.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsFullScreen(false)}>
                <Minimize2 size={16} className="mr-1 inline -mt-0.5" /> Close
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{playerCard}</div>
          </div>
        </div>
      )}

      <HighlightBuilderSheet open={builderOpen} onClose={() => setBuilderOpen(false)} />
      <ContentDetailSheet item={selectedContent} onClose={() => setOpenContentId(null)} />
    </div>
  );
}
