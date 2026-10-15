import { MobileApp } from "./components/shell/MobileApp";
import { DesktopShell } from "./components/shell/DesktopShell";
import { useIsDesktop } from "./hooks/useIsDesktop";

function App() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopShell /> : <MobileApp />;
}

export default App;
