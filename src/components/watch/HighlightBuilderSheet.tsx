import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";
import type { GeneratedReel } from "../../types";
import { useAppState } from "../../store/AppState";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";

interface HighlightBuilderSheetProps {
  open: boolean;
  onClose: () => void;
}

type TeamSelection = GeneratedReel["teamId"] | null;

const TEAM_OPTIONS: Array<{ label: string; value: Exclude<TeamSelection, null> }> = [
  { label: "Leafs", value: "leafs" },
  { label: "Jays", value: "jays" },
  { label: "Both", value: "both" },
];

const PLAYER_OPTIONS = [
  "Auston Matthews",
  "Vladimir Guerrero Jr.",
  "Team highlights",
] as const;

const CONTENT_OPTIONS = [
  "Goals",
  "Home Runs",
  "Best Plays",
  "Interviews",
  "Behind the Scenes",
  "Game Recaps",
] as const;

const LENGTH_OPTIONS = [2, 5, 10] as const;

const CUSTOMIZATION_OPTIONS = [
  "Include commentary",
  "Include upcoming games",
  "Include ticket recommendations",
  "Include rewards opportunities",
] as const;

const GENERATION_PHASES = [
  "Understanding your request",
  "Searching the content library",
  "Ranking your favourite moments",
  "Assembling the video",
  "Applying your preferences",
  "Your highlight reel is ready",
] as const;

const STEP_TITLES = [
  "Choose Teams",
  "Choose Players",
  "Choose Content",
  "Choose Length",
  "Customize",
] as const;

const STEP_DESCRIPTIONS = [
  "Tell SportsIQ which Toronto story should anchor your reel.",
  "Pick the stars or team-wide moments you want featured.",
  "Select the content mix for your highlight package.",
  "Choose how long your reel should run.",
  "Add the finishing touches to personalize the experience.",
] as const;

function toggleValue(current: string[], value: string) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function buildReelTitle(team: Exclude<TeamSelection, null>, selectedPlayers: string[]) {
  const featuredPlayers = selectedPlayers.filter((player) => player !== "Team highlights");

  if (featuredPlayers.length === 1) {
    return `${featuredPlayers[0]} Highlight Reel`;
  }

  if (featuredPlayers.length >= 2) {
    return `${featuredPlayers[0]} & ${featuredPlayers[1]} Highlight Reel`;
  }

  if (team === "both") return "Leafs + Jays Highlight Reel";
  return team === "leafs" ? "Leafs Highlight Reel" : "Blue Jays Highlight Reel";
}

export function HighlightBuilderSheet({ open, onClose }: HighlightBuilderSheetProps) {
  const { actions } = useAppState();
  const [step, setStep] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<TeamSelection>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [selectedCustomization, setSelectedCustomization] = useState<string[]>([]);
  const [mode, setMode] = useState<"builder" | "generating" | "complete">("builder");
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedReel, setGeneratedReel] = useState<GeneratedReel | null>(null);

  const resetBuilder = useCallback(() => {
    setStep(0);
    setSelectedTeam(null);
    setSelectedPlayers([]);
    setSelectedContent([]);
    setSelectedLength(null);
    setSelectedCustomization([]);
    setMode("builder");
    setGenerationStep(0);
    setGeneratedReel(null);
  }, []);

  useEffect(() => {
    if (!open) {
      resetBuilder();
    }
  }, [open, resetBuilder]);

  useEffect(() => {
    if (mode !== "generating") return;

    if (generationStep < GENERATION_PHASES.length) {
      const timer = window.setTimeout(() => {
        setGenerationStep((current) => current + 1);
      }, 800);

      return () => window.clearTimeout(timer);
    }

    if (!selectedTeam || !selectedLength) return;

    const reel: GeneratedReel = {
      id: `reel-${Date.now()}`,
      title: buildReelTitle(selectedTeam, selectedPlayers),
      teamId: selectedTeam,
      lengthMinutes: selectedLength,
      createdAt: new Date().toISOString(),
      chapters: selectedContent.map((content) => content),
    };

    actions.addReel(reel);
    actions.addSignal("Generated a highlight reel");
    actions.addAgentActivity("Video Assembly Agent", "Highlight package assembled");
    actions.showToast(`Saved "${reel.title}" to your Digital Locker`);
    setGeneratedReel(reel);
    setMode("complete");
  }, [actions, generationStep, mode, selectedContent, selectedLength, selectedPlayers, selectedTeam]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return selectedTeam !== null;
      case 1:
        return selectedPlayers.length > 0;
      case 2:
        return selectedContent.length > 0;
      case 3:
        return selectedLength !== null;
      case 4:
        return true;
      default:
        return false;
    }
  }, [selectedContent.length, selectedLength, selectedPlayers.length, selectedTeam, step]);

  const handleClose = useCallback(() => {
    resetBuilder();
    onClose();
  }, [onClose, resetBuilder]);

  const activeTitle =
    mode === "generating" ? "SportsIQ is building your reel" : mode === "complete" ? "Your reel is ready" : "Build My Highlight Reel";

  return (
    <Sheet open={open} onClose={handleClose} title={activeTitle}>
      {mode === "builder" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Step {step + 1} of 5</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{STEP_TITLES[step]}</h3>
              </div>
              <Sparkles className="text-accent-gold" size={18} />
            </div>
            <p className="mt-2 text-sm text-silver-300">{STEP_DESCRIPTIONS[step]}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STEP_TITLES.map((title, index) => (
                <Chip key={title} label={title} active={index === step} onClick={index <= step ? () => setStep(index) : undefined} />
              ))}
            </div>
          </div>

          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {TEAM_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  active={selectedTeam === option.value}
                  onClick={() => setSelectedTeam(option.value)}
                />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {PLAYER_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  active={selectedPlayers.includes(option)}
                  onClick={() => setSelectedPlayers((current) => toggleValue(current, option))}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-wrap gap-2">
              {CONTENT_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  active={selectedContent.includes(option)}
                  onClick={() => setSelectedContent((current) => toggleValue(current, option))}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-wrap gap-2">
              {LENGTH_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={`${option} minutes`}
                  active={selectedLength === option}
                  onClick={() => setSelectedLength(option)}
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {CUSTOMIZATION_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    active={selectedCustomization.includes(option)}
                    onClick={() => setSelectedCustomization((current) => toggleValue(current, option))}
                  />
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-navy-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-silver-400">Preview</p>
                <h4 className="mt-2 text-base font-semibold text-white">
                  {selectedTeam ? buildReelTitle(selectedTeam, selectedPlayers) : "Your Toronto highlight reel"}
                </h4>
                <p className="mt-2 text-sm text-silver-300">
                  {selectedLength ?? 0} minute reel with {selectedContent.length || 0} selected content categories and{" "}
                  {selectedCustomization.length} personalization preference{selectedCustomization.length === 1 ? "" : "s"}.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button size="md" variant="ghost" className="flex-1" onClick={step === 0 ? handleClose : () => setStep((current) => current - 1)}>
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < 4 ? (
              <Button size="md" className="flex-1" disabled={!canAdvance} onClick={() => setStep((current) => current + 1)}>
                Next
              </Button>
            ) : (
              <Button
                size="md"
                className="flex-1"
                onClick={() => {
                  setMode("generating");
                  setGenerationStep(0);
                }}
              >
                Create My Reel
              </Button>
            )}
          </div>
        </div>
      )}

      {mode === "generating" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-accent-gold/20 bg-gradient-to-br from-leafs-700/40 via-navy-900 to-jays-700/40 p-5">
            <p className="text-sm text-silver-200">SportsIQ is turning your selections into a personalized Toronto highlight experience.</p>
          </div>
          <div className="space-y-3">
            {GENERATION_PHASES.map((phase, index) => {
              const isComplete = index < generationStep;
              const isActive = index === generationStep;

              return (
                <div
                  key={phase}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    isComplete
                      ? "border-accent-green/30 bg-accent-green/10"
                      : isActive
                        ? "border-accent-gold/30 bg-accent-gold/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="text-accent-green" size={18} />
                  ) : isActive ? (
                    <LoaderCircle className="animate-spin text-accent-gold" size={18} />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  )}
                  <span className="text-sm text-white">{phase}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "complete" && generatedReel && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-accent-green/20 bg-gradient-to-br from-accent-green/20 via-navy-900 to-leafs-700/25 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-accent-green" size={22} />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-green">Saved to Digital Locker</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{generatedReel.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-silver-300">
              {generatedReel.lengthMinutes} minute reel with {generatedReel.chapters.length} chapters, built around your Toronto favourites.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-silver-400">Included Chapters</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {generatedReel.chapters.map((chapter) => (
                <Chip key={chapter} label={chapter} active />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="md"
              className="flex-1"
              onClick={() => {
                actions.showToast("Open Digital Locker to watch your new highlight reel");
                handleClose();
              }}
            >
              Watch Now
            </Button>
            <Button size="md" variant="secondary" className="flex-1" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
