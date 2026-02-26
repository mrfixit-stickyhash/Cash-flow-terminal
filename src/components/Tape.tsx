import { useAppStore } from "../state/store";
import { format } from "date-fns";

export function Tape() {
  const { trades } = useAppStore();

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time & Sales</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs font-mono text-left">
          <thead className="sticky top-0 bg-zinc-950 text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="py-2 pl-4 font-normal">TIME</th>
              <th className="py-2 text-right font-normal">PRICE</th>
              <th className="py-2 pr-4 text-right font-normal">SIZE</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr key={i} className="border-b border-zinc-900/50 hover:bg-zinc-900 transition-colors">
                <td className="py-1.5 pl-4 text-zinc-400">
                  {format(new Date(trade.timestamp), "HH:mm:ss.SSS")}
                </td>
                <td className={`py-1.5 text-right ${trade.side === "buy" ? "text-emerald-400" : "text-rose-400"}`}>
                  {trade.price.toFixed(2)}
                </td>
                <td className="py-1.5 pr-4 text-right text-zinc-300">
                  {trade.size.toLocaleString()}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-zinc-600">
                  Waiting for trades...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
