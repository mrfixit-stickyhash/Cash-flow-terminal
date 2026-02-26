import { useAppStore } from "../state/store";
import { format } from "date-fns";
import { ExternalLink, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Insight } from "../types";

export function InsightCard({ insight }: { insight: Insight }) {
  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case "high":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "low":
        return <HelpCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{insight.headline}</h3>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded text-xs font-medium text-zinc-400 shrink-0">
          {getConfidenceIcon(insight.confidence)}
          <span className="capitalize">{insight.confidence}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Likely Drivers</h4>
          <ul className="space-y-2">
            {insight.drivers.map((driver, i) => (
              <li key={i} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>
                  {driver.text}
                  {driver.timestamp && (
                    <span className="text-xs text-zinc-500 ml-2 font-mono">({driver.timestamp})</span>
                  )}
                  {driver.url && (
                    <a
                      href={driver.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 ml-2 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {insight.verify_next.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Verify Next</h4>
            <ul className="space-y-1">
              {insight.verify_next.map((step, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">→</span>
                  {step.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {insight.sources.length > 0 && (
          <div className="pt-3 border-t border-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sources</h4>
            <div className="flex flex-wrap gap-2">
              {insight.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 transition-colors truncate max-w-[200px]"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{source.title || new URL(source.url).hostname}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>{format(new Date(insight.timestamp), "HH:mm:ss")}</span>
        <span>{insight.ticker}</span>
      </div>
    </div>
  );
}
