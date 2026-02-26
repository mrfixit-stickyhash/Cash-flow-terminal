export type Trade = {
  price: number;
  size: number;
  side: "buy" | "sell";
  timestamp: number;
};

export type Quote = {
  bidPrice: number;
  askPrice: number;
  bidSize: number;
  askSize: number;
  timestamp: number;
};

export type Candle = {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type EventType = "MOVE_SPIKE_1M" | "MOVE_SPIKE_5M" | "VOLUME_SPIKE" | "SPREAD_WIDE";

export type MarketEvent = {
  id: string;
  type: EventType;
  ticker: string;
  startTime: number;
  endTime: number;
  metrics: Record<string, any>;
};

export type Insight = {
  id: string;
  ticker: string;
  eventId: string;
  headline: string;
  confidence: "low" | "medium" | "high";
  drivers: { text: string; timestamp: string | null; url: string | null }[];
  verify_next: { text: string }[];
  sources: { title: string | null; url: string }[];
  timestamp: number;
  raw?: string;
};
