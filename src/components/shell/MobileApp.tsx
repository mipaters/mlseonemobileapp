import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { BottomNav } from "./BottomNav";
import { FloatingCitoButton } from "./FloatingCitoButton";
import { ProfileMenuSheet } from "./ProfileMenuSheet";
import { WalkthroughOverlay } from "./WalkthroughOverlay";
import { Toast } from "../ui/Toast";
import { AppRoutes } from "../../routes/AppRoutes";
import { useAppState } from "../../store/AppState";

export function MobileApp() {
  const { state, actions } = useAppState();
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const isExecutive = location.pathname.startsWith("/executive");
  const isCito = location.pathname === "/cito";
  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="relative flex h-full w-full flex-col bg-navy-950 text-silver-100">
      {!isExecutive && <MobileHeader onAvatarClick={() => setProfileOpen(true)} hideLogo={isHome} />}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <AppRoutes />
      </main>
      {!isExecutive && <BottomNav />}
      {!isExecutive && !isCito && <FloatingCitoButton />}
      <ProfileMenuSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
      <Toast message={state.toast} onDismiss={actions.clearToast} />
      <WalkthroughOverlay />
    </div>
  );
}
