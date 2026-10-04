import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FloatingCitoButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/cito")}
      aria-label="Ask Cito"
      className="absolute right-3 bottom-20 z-40 h-13 w-13 p-3 rounded-full bg-gradient-to-br from-accent-gold to-amber-500 shadow-xl shadow-black/40 flex items-center justify-center animate-pulse-soft"
    >
      <Sparkles size={22} className="text-navy-950" />
    </button>
  );
}
