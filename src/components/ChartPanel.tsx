import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { useAppStore } from "../state/store";

export function ChartPanel() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const { candles, ticker } = useAppStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" }, // zinc-950
        textColor: "#a1a1aa", // zinc-400
      },
      grid: {
        vertLines: { color: "#27272a" }, // zinc-800
        horzLines: { color: "#27272a" },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: "#71717a", // zinc-500
          style: 3,
        },
        horzLine: {
          width: 1,
          color: "#71717a",
          style: 3,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#27272a",
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399", // emerald-400
      downColor: "#fb7185", // rose-400
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#fb7185",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#3f3f46", // zinc-700
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    
    // Initial resize after a short delay to ensure container is rendered
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !volumeSeriesRef.current || candles.length === 0) return;

    const formattedCandles = candles.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const formattedVolume = candles.map((c) => ({
      time: c.time as any,
      value: c.volume,
      color: c.close >= c.open ? "#10b98180" : "#f43f5e80", // emerald-500/50 : rose-500/50
    }));

    seriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolume);
  }, [candles]);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 relative">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold text-zinc-100/50 tracking-tight">{ticker}</h2>
        <p className="text-sm text-zinc-400/50 font-mono">1m Candles</p>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full h-full" />
    </div>
  );
}
