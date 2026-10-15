import type { ReactNode } from "react";
import { CalendarDays, DoorOpen, Expand, MapPin, ScanLine, Sparkles, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { teamById } from "../../data/teams";
import type { Game, Ticket } from "../../types";

interface TicketWalletCardProps {
  ticket: Ticket;
  game: Game;
  onViewFullScreen: () => void;
  onUpgrade: () => void;
  expanded?: boolean;
  hideActions?: boolean;
}

const barcodePattern = [5, 2, 3, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 2, 6, 1, 3, 2, 5, 2, 4, 1, 6, 2];

const statusBadgeClasses: Record<Ticket["status"], string> = {
  Upcoming: "bg-white/10 text-silver-100 border border-white/10",
  Active: "bg-accent-green/20 text-green-200 border border-accent-green/30",
  Upgraded: "bg-accent-gold/20 text-accent-gold border border-accent-gold/30",
};

const teamCardClasses = {
  leafs: "from-leafs-700 via-navy-900 to-navy-950",
  jays: "from-jays-700 via-navy-900 to-navy-950",
} as const;

export function TicketWalletCard({
  ticket,
  game,
  onViewFullScreen,
  onUpgrade,
  expanded = false,
  hideActions = false,
}: TicketWalletCardProps) {
  const team = teamById(ticket.teamId);
  const teamName = team?.name ?? ticket.teamId.toUpperCase();
  const teamGradient = teamCardClasses[ticket.teamId];

  return (
    <div className={`overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${teamGradient} shadow-2xl`}>
      <button
        type="button"
        onClick={onViewFullScreen}
        className={`w-full text-left ${expanded ? "p-5" : "p-4"}`}
        aria-label={`Open ${teamName} ticket`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-gold">Mobile Ticket</p>
            <h3 className={`${expanded ? "mt-2 text-2xl" : "mt-1 text-xl"} font-bold text-white`}>{teamName}</h3>
            <p className="mt-1 text-sm text-silver-200">vs {game.opponent}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>

        <div className={`${expanded ? "mt-6" : "mt-5"} grid grid-cols-2 gap-3 text-sm text-silver-100`}>
          <InfoCell icon={<CalendarDays size={14} />} label="Date" value={game.dateLabel} />
          <InfoCell icon={<Star size={14} />} label="Time" value={game.timeLabel} />
          <InfoCell icon={<MapPin size={14} />} label="Venue" value={game.venue} />
          <InfoCell icon={<DoorOpen size={14} />} label="Gate" value={ticket.gate} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
          <SeatCell label="Section" value={ticket.section} />
          <SeatCell label="Row" value={ticket.row} />
          <SeatCell label="Seat" value={ticket.seat} />
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-silver-400">
            <ScanLine size={14} />
            Admit one
          </div>
          <div className="mt-3 flex h-16 items-end gap-1 overflow-hidden rounded-xl bg-white px-3 py-2">
            {barcodePattern.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className="rounded-sm bg-navy-950"
                style={{ width: `${width}px`, height: `${40 + ((index * 7) % 20)}px` }}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] tracking-[0.28em] text-silver-300">MLSE•{ticket.id.toUpperCase()}</p>
        </div>
      </button>

      {!hideActions && (
        <div className="flex gap-2 border-t border-white/10 bg-black/15 p-4 pt-3">
          <Button className="flex-1" variant="secondary" onClick={onViewFullScreen}>
            <Expand size={15} className="mr-2 inline" />
            View Full-Screen Ticket
          </Button>
          <Button className="flex-1" onClick={onUpgrade}>
            <Sparkles size={15} className="mr-2 inline" />
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoCell({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-silver-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function SeatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-silver-400">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
