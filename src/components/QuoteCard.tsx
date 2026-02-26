import { useAppStore } from "../state/store";

export function QuoteCard() {
  const { quote, ticker, candles } = useAppStore();

  const lastCandle = candles[candles.length - 1];
  const lastPrice = lastCandle?.close || quote?.askPrice || 0;
  
  // Calculate day range roughly from candles if available
  const dayHigh = candles.length > 0 ? Math.max(...candles.map(c => c.high)) : lastPrice;
  const dayLow = candles.length > 0 ? Math.min(...candles.map(c => c.low)) : lastPrice;

  const spread = quote ? ((quote.askPrice - quote.bidPrice) / quote.bidPrice) * 100 : 0;

  return (
    <div className="p-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{ticker}</h2>
        <span className="text-xl font-mono text-emerald-400">{lastPrice.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">BID</span>
            <span className="text-zinc-300">{quote?.bidPrice.toFixed(2) || "-"}</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">B.SIZE</span>
            <span className="text-zinc-300">{quote?.bidSize || "-"}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">ASK</span>
            <span className="text-zinc-300">{quote?.askPrice.toFixed(2) || "-"}</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">A.SIZE</span>
            <span className="text-zinc-300">{quote?.askSize || "-"}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-500">SPREAD</span>
          <span className={spread > 0.15 ? "text-rose-400" : "text-zinc-300"}>
            {spread.toFixed(3)}%
          </span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-500">DAY RANGE</span>
          <span className="text-zinc-300">
            {dayLow.toFixed(2)} - {dayHigh.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
