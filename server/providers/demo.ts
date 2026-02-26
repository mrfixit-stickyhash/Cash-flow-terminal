import { BaseProvider, MarketEvent } from "./base";

export class DemoProvider implements BaseProvider {
  private interval: NodeJS.Timeout | null = null;
  private currentTicker: string | null = null;
  private price: number = 150.0;
  private onEvent: (event: MarketEvent) => void;

  constructor(onEvent: (event: MarketEvent) => void) {
    this.onEvent = onEvent;
  }

  connect(): void {
    this.onEvent({ type: "status", ticker: "system", data: { status: "connected" } });
  }

  subscribe(ticker: string): void {
    this.currentTicker = ticker;
    this.price = Math.random() * 200 + 50; // Random starting price
    
    if (this.interval) clearInterval(this.interval);
    
    this.interval = setInterval(() => {
      if (!this.currentTicker) return;

      // Random walk
      const change = (Math.random() - 0.5) * 0.5;
      this.price += change;
      
      const spread = this.price * 0.001; // 0.1% spread
      const bid = this.price - spread / 2;
      const ask = this.price + spread / 2;

      // Emit quote
      this.onEvent({
        type: "quote",
        ticker: this.currentTicker,
        data: {
          bidPrice: bid,
          askPrice: ask,
          bidSize: Math.floor(Math.random() * 10) * 100,
          askSize: Math.floor(Math.random() * 10) * 100,
          timestamp: Date.now()
        }
      });

      // Emit trade with some probability
      if (Math.random() > 0.3) {
        const isBuy = Math.random() > 0.5;
        const tradePrice = isBuy ? ask : bid;
        const size = Math.floor(Math.random() * 500) + 1;
        
        this.onEvent({
          type: "trade",
          ticker: this.currentTicker,
          data: {
            price: tradePrice,
            size,
            side: isBuy ? "buy" : "sell",
            timestamp: Date.now()
          }
        });
      }
    }, 500); // 500ms ticks
  }

  unsubscribe(ticker: string): void {
    if (this.currentTicker === ticker) {
      this.currentTicker = null;
      if (this.interval) clearInterval(this.interval);
    }
  }

  close(): void {
    if (this.interval) clearInterval(this.interval);
    this.onEvent({ type: "status", ticker: "system", data: { status: "disconnected" } });
  }
}
