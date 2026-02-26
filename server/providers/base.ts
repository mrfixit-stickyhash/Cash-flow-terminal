export type MarketEvent = {
  type: "trade" | "quote" | "status";
  ticker: string;
  data: any;
};

export interface BaseProvider {
  connect(): void;
  subscribe(ticker: string): void;
  unsubscribe(ticker: string): void;
  close(): void;
}
