import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import { setupWsServer } from "./server/wsServer";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Setup WebSocket Server
  setupWsServer(server);

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
