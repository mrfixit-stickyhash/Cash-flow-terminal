import { BaseProvider, MarketEvent } from "./base";
import WebSocket from "ws";

export class PolygonProvider implements BaseProvider {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private onEvent: (event: MarketEvent) => void;
  private currentTicker: string | null = null;

  constructor(apiKey: string, onEvent: (event: MarketEvent) => void) {
    this.apiKey = apiKey;
    this.onEvent = onEvent;
  }

  connect(): void {
    this.ws = new WebSocket("wss://socket.polygon.io/stocks");

    this.ws.on("open", () => {
      this.ws?.send(JSON.stringify({ action: "auth", params: this.apiKey }));
    });

    this.ws.on("message", (data: string) => {
      const messages = JSON.parse(data);
      for (const msg of messages) {
        if (msg.ev === "status") {
          if (msg.status === "auth_success") {
            this.onEvent({ type: "status", ticker: "system", data: { status: "connected" } });
            if (this.currentTicker) {
              this.subscribe(this.currentTicker);
            }
          } else if (msg.status === "auth_failed") {
            this.onEvent({ type: "status", ticker: "system", data: { status: "auth_failed" } });
          }
        } else if (msg.ev === "T") {
          // Trade
          this.onEvent({
            type: "trade",
            ticker: msg.sym,
            data: {
              price: msg.p,
              size: msg.s,
              side: msg.c?.includes(37) ? "sell" : "buy", // Simplified side estimation
              timestamp: msg.t
            }
          });
        } else if (msg.ev === "Q") {
          // Quote
          this.onEvent({
            type: "quote",
            ticker: msg.sym,
            data: {
              bidPrice: msg.bp,
              askPrice: msg.ap,
              bidSize: msg.bs,
              askSize: msg.as,
              timestamp: msg.t
            }
          });
        }
      }
    });

    this.ws.on("close", () => {
      this.onEvent({ type: "status", ticker: "system", data: { status: "disconnected" } });
    });
    
    this.ws.on("error", (err) => {
      console.error("Polygon WS Error", err);
    });
  }

  subscribe(ticker: string): void {
    this.currentTicker = ticker;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: "subscribe", params: `T.${ticker},Q.${ticker}` }));
    }
  }

  unsubscribe(ticker: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: "unsubscribe", params: `T.${ticker},Q.${ticker}` }));
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}
