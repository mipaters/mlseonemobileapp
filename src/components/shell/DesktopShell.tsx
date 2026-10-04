import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Monitor, PlayCircle, RotateCcw, Smartphone } from "lucide-react";
import { PhoneFrame } from "./PhoneFrame";
import { MobileApp } from "./MobileApp";
import { WalkthroughOverlay } from "./WalkthroughOverlay";
import { Toast } from "../ui/Toast";
import { AppRoutes } from "../../routes/AppRoutes";
import { useAppState } from "../../store/AppState";
import { MIKE_PROFILE } from "../../data/profile";
import mlseLogo from "../../assets/mlse-logo.png";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useAppState();
  const isExecutive = location.pathname.startsWith("/executive");

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-navy-900/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <img src={mlseLogo} alt="MLSE" className="h-9 w-9 rounded-md" />
        <span className="text-lg font-extrabold tracking-tight text-white">
          MLSE <span className="text-accent-gold">ONE</span>
        </span>
        <span className="ml-1 text-xs text-silver-500">Presentation mode · {MIKE_PROFILE.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/home")}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
            !isExecutive ? "border-accent-gold text-accent-gold bg-accent-gold/10" : "border-white/10 text-silver-400 hover:bg-white/5"
          }`}
        >
          <Smartphone size={14} /> Fan View
        </button>
        <button
          onClick={() => navigate("/executive")}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
            isExecutive ? "border-accent-gold text-accent-gold bg-accent-gold/10" : "border-white/10 text-silver-400 hover:bg-white/5"
          }`}
        >
          <Monitor size={14} /> Executive View
        </button>
        <button
          onClick={() => actions.startWalkthrough()}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 text-silver-300 hover:bg-white/5"
        >
          <PlayCircle size={14} /> Start Executive Demo
        </button>
        <button
          onClick={() => {
            actions.resetDemo();
            actions.showToast("Demo reset");
          }}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 text-silver-300 hover:bg-white/5"
        >
          <RotateCcw size={14} /> Reset Demo
        </button>
      </div>
    </header>
  );
}

function SignalsSidePanel() {
  const { state } = useAppState();
  return (
    <aside className="hidden xl:flex w-72 shrink-0 flex-col gap-3 border-l border-white/10 bg-navy-900/60 p-4 overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wide text-silver-400">Live SportsIQ Signals</p>
      <div className="flex flex-col gap-2">
        {state.signals.slice(0, 10).map((signal, i) => (
          <div key={`${signal.label}-${i}`} className="rounded-lg border border-white/5 bg-white/5 p-2.5">
            <p className="text-xs text-white">{signal.label}</p>
            <p className="text-[10px] text-silver-500 mt-0.5">{signal.timestamp}</p>
          </div>
        ))}
        {state.signals.length === 0 && (
          <p className="text-xs text-silver-500">No signals captured yet. Interact with the app to generate some.</p>
        )}
      </div>
    </aside>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { state, actions } = useAppState();
  return (
    <div className="flex h-screen w-screen flex-col bg-navy-950 text-silver-100">
      <TopBar />
      <div className="flex-1 overflow-hidden">{children}</div>
      <Toast message={state.toast} onDismiss={actions.clearToast} />
      <WalkthroughOverlay />
    </div>
  );
}

export function DesktopShell() {
  const location = useLocation();
  const isExecutive = location.pathname.startsWith("/executive");

  if (isExecutive) {
    return (
      <Shell>
        <div className="h-full overflow-y-auto">
          <AppRoutes />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex h-full">
        <div className="flex-1 flex items-center justify-center overflow-y-auto py-8">
          <PhoneFrame>
            <MobileApp />
          </PhoneFrame>
        </div>
        <SignalsSidePanel />
      </div>
    </Shell>
  );
}
