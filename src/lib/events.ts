import { useAppStore } from "../state/store";
import { useSettingsStore } from "../state/settingsStore";
import { Candle, MarketEvent } from "../types";
import { v4 as uuidv4 } from "uuid";
import { fetchInsight } from "./perplexity";

let lastInsightTime = 0;

export function detectEvents(candle: Candle) {
  const { candles, addEvent, ticker } = useAppStore.getState();
  const { thresholds, autoExplain, cooldownSeconds } = useSettingsStore.getState();

  if (candles.length < 5) return;

  const last1m = candles[candles.length - 1];
  const last5m = candles.slice(-5);

  const move1m = ((last1m.close - last1m.open) / last1m.open) * 100;
  const move5m = ((last1m.close - last5m[0].open) / last5m[0].open) * 100;

  const avgVolume = candles.slice(-30).reduce((sum, c) => sum + c.volume, 0) / Math.min(30, candles.length);
  const volumeSpike = last1m.volume / avgVolume;

  let triggered = false;
  let eventType: MarketEvent["type"] | null = null;
  let metrics: any = {};

  if (Math.abs(move1m) > thresholds.move1m) {
    triggered = true;
    eventType = "MOVE_SPIKE_1M";
    metrics = { move: move1m, window: "1m" };
  } else if (Math.abs(move5m) > thresholds.move5m) {
    triggered = true;
    eventType = "MOVE_SPIKE_5M";
    metrics = { move: move5m, window: "5m" };
  } else if (volumeSpike > thresholds.volumeSpike) {
    triggered = true;
    eventType = "VOLUME_SPIKE";
    metrics = { spike: volumeSpike, window: "1m" };
  }

  if (triggered && eventType) {
    const event: MarketEvent = {
      id: uuidv4(),
      type: eventType,
      ticker,
      startTime: last5m[0].time,
      endTime: last1m.time,
      metrics,
    };
    addEvent(event);

    if (autoExplain) {
      const now = Date.now() / 1000;
      if (now - lastInsightTime > cooldownSeconds) {
        lastInsightTime = now;
        fetchInsight(event);
      }
    }
  }
}
