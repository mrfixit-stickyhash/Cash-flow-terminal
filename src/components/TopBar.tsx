import { useState } from "react";
import { useAppStore } from "../state/store";
import { useSettingsStore } from "../state/settingsStore";
import { Settings, RefreshCw, Zap, Search } from "lucide-react";
import { SettingsModal } from "./SettingsModal";

export function TopBar() {
  const { ticker, setTicker, quote, providerStatus, clearData } = useAppStore();
  const { autoExplain, setAutoExplain } = useSettingsStore();
  const [searchInput, setSearchInput] = useState(ticker);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim().toUpperCase() !== ticker) {
      clearData();
      setTicker(searchInput.trim().toUpperCase());
    }
  };

  const spread = quote ? ((quote.askPrice - quote.bidPrice) / quote.bidPrice) * 100 : 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-100">
      <div className="flex items-center gap-6">
        <form onSubmit={handleSearch} className="flex items-center bg-zinc-800 rounded px-2 py-1">
          <Search className="w-4 h-4 text-zinc-400 mr-2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent border-none outline-none w-24 text-sm font-mono uppercase"
            placeholder="TICKER"
          />
        </form>

        {quote ? (
          <div className="flex items-center gap-4 text-sm font-mono">
            <div className="flex flex-col">
              <span className="text-zinc-400 text-xs">LAST</span>
              <span className="font-semibold text-emerald-400">{quote.askPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-xs">BID</span>
              <span>{quote.bidPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-xs">ASK</span>
              <span>{quote.askPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-xs">SPREAD</span>
              <span className={spread > 0.15 ? "text-rose-400" : ""}>{spread.toFixed(3)}%</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 font-mono">Waiting for quote...</div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              providerStatus === "connected"
                ? "bg-emerald-500"
                : providerStatus === "auth_failed"
                ? "bg-rose-500"
                : "bg-zinc-500"
            }`}
          />
          <span className="text-zinc-400 uppercase">{providerStatus}</span>
        </div>

        <button
          onClick={() => setAutoExplain(!autoExplain)}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
            autoExplain ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          <Zap className="w-3 h-3" />
          Auto-Explain
        </button>

        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
