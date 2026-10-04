import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, EyeOff, Sparkles, Play } from "lucide-react";
import type { ContentItem } from "../../types";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { useAppState } from "../../store/AppState";
import { teamById } from "../../data/teams";

export function ContentDetailSheet({ item, onClose }: { item: ContentItem | null | undefined; onClose: () => void }) {
  const { state, actions } = useAppState();
  const navigate = useNavigate();

  if (!item) return null;

  const team = item.teamId !== "both" ? teamById(item.teamId) : null;
  const liked = state.likedContent.includes(item.id);
  const saved = state.savedContent.includes(item.id);

  function markWatchedAndSignal() {
    if (!item) return;
    actions.markWatched(item.id);
    actions.addSignal(`Watched ${item.title}`);
    actions.addAgentActivity("Content Curation Agent", `Watch event recorded for ${item.title}`);
    actions.showToast(`Added "${item.title}" to your watch history`);
  }

  return (
    <Sheet open={!!item} onClose={onClose} title={item.category}>
      <div
        className="h-36 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `linear-gradient(135deg, ${item.thumbnailGradient[0]}, ${item.thumbnailGradient[1]})` }}
      >
        <button
          onClick={markWatchedAndSignal}
          aria-label="Play"
          className="h-14 w-14 rounded-full bg-black/40 flex items-center justify-center"
        >
          <Play size={26} className="text-white" />
        </button>
      </div>
      <h3 className="text-lg font-bold text-white">{item.title}</h3>
      <p className="text-xs text-silver-500 mt-1">
        {team ? team.name : "Leafs & Jays"} · {item.category}
        {item.durationMinutes ? ` · ${item.durationMinutes} min` : ""}
      </p>
      <p className="text-sm text-silver-300 mt-3">{item.description}</p>
      <p className="text-xs text-accent-gold mt-2">Why you're seeing this: {item.reason}</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button size="sm" onClick={markWatchedAndSignal}>
          <Play size={14} className="inline mr-1 -mt-0.5" /> Watch
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            actions.toggleSave(item.id);
            actions.showToast(saved ? "Removed from saved" : "Saved to your library");
          }}
        >
          <Bookmark size={14} className={`inline mr-1 -mt-0.5 ${saved ? "fill-accent-gold" : ""}`} /> {saved ? "Saved" : "Save"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            actions.toggleLike(item.id);
          }}
        >
          <Heart size={14} className={`inline mr-1 -mt-0.5 ${liked ? "fill-accent-red text-accent-red" : ""}`} /> {liked ? "Liked" : "Like"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            actions.hideContent(item.id);
            actions.showToast("Hidden from your feed");
            onClose();
          }}
        >
          <EyeOff size={14} className="inline mr-1 -mt-0.5" /> Hide
        </Button>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate("/cito");
        }}
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-accent-gold border border-accent-gold/30 rounded-xl py-2.5"
      >
        <Sparkles size={14} /> Ask Cito about this
      </button>
    </Sheet>
  );
}
