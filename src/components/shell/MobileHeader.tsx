import { Bell } from "lucide-react";
import { MIKE_PROFILE } from "../../data/profile";
import mlseLogo from "../../assets/mlse-logo.png";

export function MobileHeader({ onAvatarClick, hideLogo }: { onAvatarClick: () => void; hideLogo?: boolean }) {
  return (
    <header
      className="safe-top flex items-center justify-between px-4 py-3 bg-navy-900/95 backdrop-blur border-b border-white/10 sticky top-0 z-30"
      data-tour="profile"
    >
      <div className="flex items-center gap-2">
        {!hideLogo && <img src={mlseLogo} alt="MLSE" className="h-8 w-8 rounded-md" />}
        <span className="text-lg font-extrabold tracking-tight text-white">
          MLSE <span className="text-accent-gold">ONE</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="hidden xs:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-accent-gold border border-accent-gold/40 rounded-full px-2 py-0.5"
          data-tour="platinum-status"
        >
          {MIKE_PROFILE.membershipStatus}
        </span>
        <button aria-label="Notifications" className="p-1.5 rounded-full hover:bg-white/10 text-silver-300">
          <Bell size={19} />
        </button>
        <button
          onClick={onAvatarClick}
          aria-label="Open profile menu"
          className="h-8 w-8 rounded-full bg-gradient-to-br from-leafs-600 to-jays-600 flex items-center justify-center text-xs font-bold text-white border border-white/20"
        >
          {MIKE_PROFILE.avatarInitials}
        </button>
      </div>
    </header>
  );
}
