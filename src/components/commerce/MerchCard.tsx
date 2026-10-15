import { ChevronRight } from "lucide-react";
import type { MerchandiseItem } from "../../types";

interface MerchCardProps {
  item: MerchandiseItem;
  onOpen: () => void;
}

const teamBadgeClasses: Record<MerchandiseItem["teamId"], string> = {
  leafs: "bg-leafs-700/80 text-white",
  jays: "bg-jays-700/80 text-white",
  both: "bg-gradient-to-r from-leafs-700 to-jays-700 text-white",
};

export function MerchCard({ item, onOpen }: MerchCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-navy-900 text-left transition-transform hover:-translate-y-0.5"
    >
      <div
        className="h-32 p-4"
        style={{
          background: `linear-gradient(135deg, ${item.image[0]}, ${item.image[1]})`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${teamBadgeClasses[item.teamId]}`}>
            {item.teamId === "both" ? "Leafs + Jays" : item.teamId === "leafs" ? "Leafs" : "Jays"}
          </span>
          <ChevronRight size={18} className="text-white/80" />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{item.name}</h3>
          <p className="text-xs text-silver-400">{item.category}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-accent-gold">${item.price}</span>
          <span className="text-xs text-silver-500">Tap for details</span>
        </div>
      </div>
    </button>
  );
}
