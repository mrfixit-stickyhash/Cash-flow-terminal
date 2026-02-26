import { useAppStore } from "../../state/store";
import { useSettingsStore } from "../../state/settingsStore";
import { Trade, Quote, Candle } from "../../types";
import { detectEvents } from "../events";

let ws: WebSocket | null = null;
let currentMinute: number | null = null;
let currentCandle: Candle | null = null;

export function connectMarketData() {
  const { ticker, setProviderStatus, addTrade, setQuote, addCandle, updateLastCandle } = useAppStore.getState();
  const { providerType, polygonKey } = useSettingsStore.getState();

  if (ws) {
    ws.close();
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  ws = new WebSocket(`${protocol}//${host}`);

  ws.onopen = () => {
    setProviderStatus("connected");
    ws?.send(
      JSON.stringify({
        type: "subscribe",
        payload: {
          ticker,
          providerType,
          apiKey: providerType === "polygon" ? polygonKey : "",
        },
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      
      if (msg.type === "status") {
        if (msg.data.status === "auth_failed") {
          setProviderStatus("auth_failed");
        } else if (msg.data.status === "connected") {
          setProviderStatus("connected");
        } else if (msg.data.status === "disconnected") {
          setProviderStatus("disconnected");
        }
      } else if (msg.type === "trade") {
        const trade = msg.data as Trade;
        useAppStore.getState().addTrade(trade);
        
        // Aggregate to candle
        const timeInSeconds = Math.floor(trade.timestamp / 1000);
        const minute = Math.floor(timeInSeconds / 60) * 60;
        
        if (minute !== currentMinute) {
          if (currentCandle) {
            // Finalize previous candle
            detectEvents(currentCandle);
          }
          currentMinute = minute;
          currentCandle = {
            time: minute,
            open: trade.price,
            high: trade.price,
            low: trade.price,
            close: trade.price,
            volume: trade.size
          };
          useAppStore.getState().addCandle(currentCandle);
        } else if (currentCandle) {
          currentCandle.high = Math.max(currentCandle.high, trade.price);
          currentCandle.low = Math.min(currentCandle.low, trade.price);
          currentCandle.close = trade.price;
          currentCandle.volume += trade.size;
          useAppStore.getState().updateLastCandle(currentCandle);
        }
      } else if (msg.type === "quote") {
        useAppStore.getState().setQuote(msg.data as Quote);
      }
    } catch (e) {
      console.error("Error parsing WS message", e);
    }
  };

  ws.onclose = () => {
    useAppStore.getState().setProviderStatus("disconnected");
  };
}

export function disconnectMarketData() {
  if (ws) {
    ws.close();
    ws = null;
  }
}
