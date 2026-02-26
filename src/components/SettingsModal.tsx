import { useState } from "react";
import { useSettingsStore } from "../state/settingsStore";
import { X } from "lucide-react";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = useSettingsStore();
  const [providerType, setProviderType] = useState(settings.providerType);
  const [polygonKey, setPolygonKey] = useState(settings.polygonKey);
  const [perplexityKey, setPerplexityKey] = useState(settings.perplexityKey);
  const [cooldown, setCooldown] = useState(settings.cooldownSeconds.toString());
  const [move1m, setMove1m] = useState(settings.thresholds.move1m.toString());
  const [move5m, setMove5m] = useState(settings.thresholds.move5m.toString());
  const [volumeSpike, setVolumeSpike] = useState(settings.thresholds.volumeSpike.toString());
  const [spreadWide, setSpreadWide] = useState(settings.thresholds.spreadWide.toString());

  const handleSave = () => {
    settings.setProviderType(providerType);
    settings.setPolygonKey(polygonKey);
    settings.setPerplexityKey(perplexityKey);
    settings.setCooldownSeconds(parseInt(cooldown) || 300);
    settings.setThresholds({
      move1m: parseFloat(move1m) || 0.6,
      move5m: parseFloat(move5m) || 1.2,
      volumeSpike: parseFloat(volumeSpike) || 3,
      spreadWide: parseFloat(spreadWide) || 0.15,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-medium text-zinc-100">Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Provider Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Market Data</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Provider</label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as any)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="demo">Demo (Simulated)</option>
                <option value="polygon">Polygon.io</option>
                <option value="alpaca">Alpaca (Coming Soon)</option>
              </select>
            </div>

            {providerType === "polygon" && (
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Polygon API Key</label>
                <input
                  type="password"
                  value={polygonKey}
                  onChange={(e) => setPolygonKey(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter Polygon API Key"
                />
              </div>
            )}
          </section>

          {/* AI Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">AI Insights (BYOK)</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Perplexity API Key</label>
              <input
                type="password"
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                placeholder="pplx-..."
              />
              <p className="text-xs text-zinc-500">Stored locally in your browser. Never sent to our servers.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Auto-Explain Cooldown (seconds)</label>
              <input
                type="number"
                value={cooldown}
                onChange={(e) => setCooldown(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </section>

          {/* Event Thresholds */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Event Thresholds</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">1m Move (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={move1m}
                  onChange={(e) => setMove1m(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">5m Move (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={move5m}
                  onChange={(e) => setMove5m(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Volume Spike (x Avg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={volumeSpike}
                  onChange={(e) => setVolumeSpike(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Spread Wide (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={spreadWide}
                  onChange={(e) => setSpreadWide(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
