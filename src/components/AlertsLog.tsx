import { useAppStore } from "../state/store";
import { format } from "date-fns";
import { AlertCircle, TrendingUp, TrendingDown, Activity } from "lucide-react";

export function AlertsLog() {
  const { events } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "MOVE_SPIKE_1M":
      case "MOVE_SPIKE_5M":
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case "VOLUME_SPIKE":
        return <Activity className="w-4 h-4 text-indigo-400" />;
      case "SPREAD_WIDE":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatMetric = (key: string, value: any) => {
    if (typeof value === "number") {
      if (key.includes("move") || key.includes("spread")) return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
      if (key.includes("spike")) return `${value.toFixed(1)}x`;
      return value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950 border-t border-zinc-800">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Event Log</h3>
        <span className="text-xs text-zinc-500 font-mono">{events.length} events</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {events.map((event) => (
          <div key={event.id} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(event.type)}
                <span className="text-sm font-medium text-zinc-200">{event.type.replace(/_/g, " ")}</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {format(new Date(event.endTime * 1000), "HH:mm:ss")}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(event.metrics).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">{key}</span>
                  <span className="text-xs text-zinc-300 font-mono">{formatMetric(key, value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-zinc-600">
            No events detected yet
          </div>
        )}
      </div>
    </div>
  );
}
