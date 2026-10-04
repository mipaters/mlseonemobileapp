import { useNavigate } from "react-router-dom";
import {
  Dna,
  Archive,
  ShieldCheck,
  Activity,
  BarChart3,
  PlayCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { Sheet } from "../ui/Sheet";
import { useAppState } from "../../store/AppState";
import { MIKE_PROFILE } from "../../data/profile";

interface MenuItem {
  label: string;
  description: string;
  icon: typeof Dna;
  to?: string;
  action?: "walkthrough" | "reset";
}

const ITEMS: MenuItem[] = [
  { label: "Fan DNA", description: "Your living SportsIQ profile", icon: Dna, to: "/profile/fan-dna" },
  { label: "Digital Locker", description: "Gear, tickets, and badges", icon: Archive, to: "/profile/digital-locker" },
  { label: "Privacy & Data", description: "Control your personalization", icon: ShieldCheck, to: "/profile/privacy" },
  { label: "Agent Activity", description: "See SportsIQ working", icon: Activity, to: "/profile/agent-activity" },
  { label: "Executive View", description: "Business outcomes & architecture", icon: BarChart3, to: "/executive" },
  { label: "Start Executive Demo", description: "Guided walkthrough of MLSE One", icon: PlayCircle, action: "walkthrough" },
  { label: "Reset Demo", description: "Restore the original demo state", icon: RotateCcw, action: "reset" },
];

export function ProfileMenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { actions } = useAppState();

  function handleSelect(item: MenuItem) {
    if (item.to) {
      navigate(item.to);
    } else if (item.action === "walkthrough") {
      actions.startWalkthrough();
      navigate("/home");
    } else if (item.action === "reset") {
      actions.resetDemo();
      navigate("/home");
    }
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Mike Paterson">
      <div className="flex items-center gap-3 mb-4 -mt-1">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-leafs-600 to-jays-600 flex items-center justify-center text-sm font-bold">
          {MIKE_PROFILE.avatarInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{MIKE_PROFILE.name}</p>
          <p className="text-xs text-silver-400">
            {MIKE_PROFILE.membershipStatus} member since {MIKE_PROFILE.memberSince}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleSelect(item)}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-white/5 border border-white/5"
          >
            <item.icon size={18} className="text-accent-gold shrink-0" />
            <span>
              <span className="block text-sm font-medium text-white">{item.label}</span>
              <span className="block text-xs text-silver-500">{item.description}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-4 flex items-center justify-center gap-2 w-full text-sm text-silver-400 py-2"
      >
        <X size={14} /> Close
      </button>
    </Sheet>
  );
}
