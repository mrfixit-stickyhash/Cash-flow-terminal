import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  providerType: "demo" | "polygon" | "alpaca";
  setProviderType: (type: "demo" | "polygon" | "alpaca") => void;

  polygonKey: string;
  setPolygonKey: (key: string) => void;

  perplexityKey: string;
  setPerplexityKey: (key: string) => void;

  autoExplain: boolean;
  setAutoExplain: (auto: boolean) => void;

  cooldownSeconds: number;
  setCooldownSeconds: (seconds: number) => void;

  thresholds: {
    move1m: number;
    move5m: number;
    volumeSpike: number;
    spreadWide: number;
  };
  setThresholds: (thresholds: Partial<SettingsState["thresholds"]>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      providerType: "demo",
      setProviderType: (type) => set({ providerType: type }),

      polygonKey: "",
      setPolygonKey: (key) => set({ polygonKey: key }),

      perplexityKey: "",
      setPerplexityKey: (key) => set({ perplexityKey: key }),

      autoExplain: false,
      setAutoExplain: (auto) => set({ autoExplain: auto }),

      cooldownSeconds: 300,
      setCooldownSeconds: (seconds) => set({ cooldownSeconds: seconds }),

      thresholds: {
        move1m: 0.6,
        move5m: 1.2,
        volumeSpike: 3,
        spreadWide: 0.15,
      },
      setThresholds: (thresholds) => set((state) => ({ thresholds: { ...state.thresholds, ...thresholds } })),
    }),
    {
      name: "ai-market-terminal-settings",
    }
  )
);
