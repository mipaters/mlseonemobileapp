import { Home, PlayCircle, Ticket, Award, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/watch", label: "Watch", icon: PlayCircle },
  { to: "/gameday", label: "Game Day", icon: Ticket },
  { to: "/rewards", label: "Rewards", icon: Award },
  { to: "/cito", label: "Cito", icon: Sparkles },
];

export function BottomNav() {
  return (
    <nav
      className="safe-bottom sticky bottom-0 z-30 bg-navy-900/95 backdrop-blur border-t border-white/10 grid grid-cols-5"
      aria-label="Primary"
    >
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium min-h-[56px] ${
              isActive ? "text-accent-gold" : "text-silver-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? "fill-accent-gold/10" : ""} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
