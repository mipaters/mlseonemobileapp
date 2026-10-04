import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { WatchPage } from "../pages/WatchPage";
import { GameDayPage } from "../pages/GameDayPage";
import { RewardsPage } from "../pages/RewardsPage";
import { CitoPage } from "../pages/CitoPage";
import { FanDnaPage } from "../pages/profile/FanDnaPage";
import { DigitalLockerPage } from "../pages/profile/DigitalLockerPage";
import { AgentActivityPage } from "../pages/profile/AgentActivityPage";
import { PrivacyPage } from "../pages/profile/PrivacyPage";
import { ExecutiveViewPage } from "../pages/ExecutiveViewPage";
import { ArchitecturePage } from "../pages/ArchitecturePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/watch" element={<WatchPage />} />
      <Route path="/gameday" element={<GameDayPage />} />
      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/cito" element={<CitoPage />} />
      <Route path="/profile/fan-dna" element={<FanDnaPage />} />
      <Route path="/profile/digital-locker" element={<DigitalLockerPage />} />
      <Route path="/profile/agent-activity" element={<AgentActivityPage />} />
      <Route path="/profile/privacy" element={<PrivacyPage />} />
      <Route path="/executive" element={<ExecutiveViewPage />} />
      <Route path="/executive/architecture" element={<ArchitecturePage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
