import { Newspaper, ExternalLink } from "lucide-react";
import { TEAM_NEWS } from "../../data/standings";
import { teamById } from "../../data/teams";
import { SectionHeader } from "../ui/SectionHeader";

export function TeamNewsSection() {
  return (
    <section className="mt-6">
      <SectionHeader eyebrow="Top News" title="Around Your Teams" />
      <div className="px-4 space-y-2">
        {TEAM_NEWS.map((story) => (
          <a
            key={story.id}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-800 p-3 hover:bg-navy-700 transition-colors"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
              <Newspaper size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white leading-snug">{story.headline}</p>
              <p className="text-[11px] text-silver-500 mt-0.5 uppercase tracking-wide">
                {teamById(story.teamId)?.name} · {story.source} · {story.timeAgo}
              </p>
            </div>
            <ExternalLink size={14} className="text-silver-500 shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}
