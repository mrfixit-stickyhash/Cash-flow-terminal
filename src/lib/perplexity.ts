import { useSettingsStore } from "../state/settingsStore";
import { useAppStore } from "../state/store";
import { MarketEvent, Insight } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function fetchInsight(event: MarketEvent) {
  const { perplexityKey } = useSettingsStore.getState();
  const { addInsight } = useAppStore.getState();

  if (!perplexityKey) {
    console.warn("Perplexity API key not set");
    return;
  }

  const prompt = `
Ticker: ${event.ticker}
Event: ${event.type}
Metrics: ${JSON.stringify(event.metrics)}
Window: ${new Date(event.startTime * 1000).toISOString()} to ${new Date(event.endTime * 1000).toISOString()}

Task:
1) Identify the most likely drivers based on the latest news/filings/announcements/macro/sector moves.
2) Provide 3-5 bullets with citations and timestamps if possible.
3) Provide 2-3 "verify next" steps.
4) Return STRICT JSON.

Format:
{
  "headline": string,
  "confidence": "low"|"medium"|"high",
  "drivers": [{"text": string, "timestamp": string|null, "url": string|null}],
  "verify_next": [{"text": string}],
  "sources": [{"title": string|null, "url": string}]
}
`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${perplexityKey}`,
      },
      body: JSON.stringify({
        model: "sonar-reasoning-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a finance research assistant. Provide grounded, source-cited answers. Do not invent sources. Prefer the most recent info. If unsure, say so. Return STRICT JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsedContent: any;
    try {
      // Try to parse JSON directly
      parsedContent = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON from Perplexity response");
      }
    }

    const insight: Insight = {
      id: uuidv4(),
      ticker: event.ticker,
      eventId: event.id,
      headline: parsedContent.headline,
      confidence: parsedContent.confidence,
      drivers: parsedContent.drivers,
      verify_next: parsedContent.verify_next,
      sources: parsedContent.sources,
      timestamp: Date.now(),
      raw: content,
    };

    addInsight(insight);
  } catch (error) {
    console.error("Error fetching insight", error);
    // Add a fallback insight with raw error
    addInsight({
      id: uuidv4(),
      ticker: event.ticker,
      eventId: event.id,
      headline: "Failed to fetch insight",
      confidence: "low",
      drivers: [{ text: String(error), timestamp: null, url: null }],
      verify_next: [],
      sources: [],
      timestamp: Date.now(),
      raw: String(error),
    });
  }
}
