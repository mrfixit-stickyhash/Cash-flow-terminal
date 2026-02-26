import { useAppStore } from "../state/store";
import { InsightCard } from "./InsightCard";
import { Bot, RefreshCw } from "lucide-react";
import { fetchInsight } from "../lib/perplexity";

export function InsightFeed() {
  const { insights, events } = useAppStore();

  const handleManualRefresh = () => {
    if (events.length > 0) {
      fetchInsight(events[0]);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950 h-full">
      <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-wide">AI Analyst Notes</h3>
        </div>
        <button 
          onClick={handleManualRefresh}
          className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          title="Manual Refresh (uses latest event)"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}

        {insights.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-4">
            <Bot className="w-12 h-12 text-zinc-800" />
            <p className="text-sm max-w-[200px]">
              Waiting for market events to generate insights...
            </p>
            <p className="text-xs text-zinc-600 font-mono">
              Ensure Perplexity API key is set in Settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
