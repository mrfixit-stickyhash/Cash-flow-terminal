import { create } from "zustand";
import { Trade, Quote, Candle, MarketEvent, Insight } from "../types";

interface AppState {
  ticker: string;
  setTicker: (ticker: string) => void;
  
  providerStatus: "connected" | "disconnected" | "auth_failed";
  setProviderStatus: (status: "connected" | "disconnected" | "auth_failed") => void;

  quote: Quote | null;
  setQuote: (quote: Quote) => void;

  trades: Trade[];
  addTrade: (trade: Trade) => void;

  candles: Candle[];
  addCandle: (candle: Candle) => void;
  updateLastCandle: (candle: Candle) => void;
  setCandles: (candles: Candle[]) => void;

  events: MarketEvent[];
  addEvent: (event: MarketEvent) => void;

  insights: Insight[];
  addInsight: (insight: Insight) => void;

  clearData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  ticker: "AAPL",
  setTicker: (ticker) => set({ ticker, quote: null, trades: [], candles: [], events: [], insights: [] }),

  providerStatus: "disconnected",
  setProviderStatus: (status) => set({ providerStatus: status }),

  quote: null,
  setQuote: (quote) => set({ quote }),

  trades: [],
  addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades].slice(0, 100) })),

  candles: [],
  addCandle: (candle) => set((state) => {
    // Keep last 1000 candles
    const newCandles = [...state.candles, candle];
    if (newCandles.length > 1000) newCandles.shift();
    return { candles: newCandles };
  }),
  updateLastCandle: (candle) => set((state) => {
    if (state.candles.length === 0) return { candles: [candle] };
    const newCandles = [...state.candles];
    newCandles[newCandles.length - 1] = candle;
    return { candles: newCandles };
  }),
  setCandles: (candles) => set({ candles }),

  events: [],
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),

  insights: [],
  addInsight: (insight) => set((state) => ({ insights: [insight, ...state.insights] })),

  clearData: () => set({ quote: null, trades: [], candles: [], events: [], insights: [] }),
}));
