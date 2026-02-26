import { useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { SplitLayout } from "./components/SplitLayout";
import { connectMarketData, disconnectMarketData } from "./lib/providers/websocketClient";
import { useAppStore } from "./state/store";
import { useSettingsStore } from "./state/settingsStore";

export default function App() {
  const ticker = useAppStore((state) => state.ticker);
  const providerType = useSettingsStore((state) => state.providerType);
  const polygonKey = useSettingsStore((state) => state.polygonKey);

  useEffect(() => {
    connectMarketData();
    return () => disconnectMarketData();
  }, [ticker, providerType, polygonKey]);

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <TopBar />
      <SplitLayout />
    </div>
  );
}
