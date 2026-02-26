import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { DemoProvider } from "./providers/demo";
import { PolygonProvider } from "./providers/polygon";
import { BaseProvider } from "./providers/base";

export function setupWsServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    let provider: BaseProvider | null = null;

    ws.on("message", (message: string) => {
      try {
        const msg = JSON.parse(message);
        
        if (msg.type === "subscribe") {
          const { ticker, providerType, apiKey } = msg.payload;
          
          if (provider) {
            provider.close();
          }

          if (providerType === "polygon") {
            provider = new PolygonProvider(apiKey, (event) => {
              ws.send(JSON.stringify(event));
            });
          } else {
            provider = new DemoProvider((event) => {
              ws.send(JSON.stringify(event));
            });
          }

          provider.connect();
          provider.subscribe(ticker);
        } else if (msg.type === "unsubscribe") {
          if (provider) {
            provider.unsubscribe(msg.payload.ticker);
          }
        }
      } catch (e) {
        console.error("Error parsing message", e);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      if (provider) {
        provider.close();
      }
    });
  });
}
