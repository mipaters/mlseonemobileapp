import { useState } from "react";
import { Play, Heart, Bookmark } from "lucide-react";
import type { ContentItem } from "../../types";

interface ContentCardProps {
  item: ContentItem;
  liked?: boolean;
  saved?: boolean;
  onOpen: () => void;
  onLike?: () => void;
  onSave?: () => void;
  compact?: boolean;
}

export function ContentCard({ item, liked, saved, onOpen, onLike, onSave, compact }: ContentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleOpen() {
    if (item.videoUrl) {
      setIsPlaying(true);
      return;
    }
    onOpen();
  }

  return (
    <div
      className={`group relative shrink-0 text-left rounded-2xl overflow-hidden border border-white/10 bg-navy-800 ${
        compact ? "w-40" : "w-48"
      }`}
    >
      {isPlaying && item.videoUrl ? (
        <video
          src={item.videoUrl}
          controls
          autoPlay
          className={`${compact ? "h-24" : "h-28"} w-full bg-black object-cover`}
        />
      ) : (
        <button
          onClick={handleOpen}
          aria-label={`Play ${item.title}`}
          className={`relative ${compact ? "h-24" : "h-28"} w-full flex items-end p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-gold`}
          style={{ background: `linear-gradient(135deg, ${item.thumbnailGradient[0]}, ${item.thumbnailGradient[1]})` }}
        >
          {item.durationMinutes && (
            <span className="absolute top-2 right-2 bg-black/40 text-[10px] text-white px-1.5 py-0.5 rounded">
              {item.durationMinutes} min
            </span>
          )}
          <Play size={22} className="text-white/90 drop-shadow" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {onLike && (
              <span
                role="button"
                tabIndex={0}
                aria-label={liked ? "Unlike" : "Like"}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    onLike();
                  }
                }}
                className="p-1.5 rounded-full bg-black/40"
              >
                <Heart size={13} className={liked ? "fill-accent-red text-accent-red" : "text-white"} />
              </span>
            )}
            {onSave && (
              <span
                role="button"
                tabIndex={0}
                aria-label={saved ? "Unsave" : "Save"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    onSave();
                  }
                }}
                className="p-1.5 rounded-full bg-black/40"
              >
                <Bookmark size={13} className={saved ? "fill-accent-gold text-accent-gold" : "text-white"} />
              </span>
            )}
          </div>
        </button>
      )}
      <button onClick={onOpen} className="block w-full text-left p-2.5">
        <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">{item.title}</p>
        <p className="text-[10px] text-silver-500 mt-1 line-clamp-1">{item.reason}</p>
      </button>
    </div>
  );
}
