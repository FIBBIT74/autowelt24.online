import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import cron from "node-cron";
import { runAllParsers } from "./scripts/parsers/run.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRAPED_DIR = path.join(__dirname, "data/scraped");

function loadScraped(source: string) {
  const file = path.join(SCRAPED_DIR, `${source}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf-8"));
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Scraped cars API
  app.get("/api/scraped-cars", (req, res) => {
    try {
      const as24 = loadScraped("autoscout24");
      const mde  = loadScraped("mobile-de");
      const kaz  = loadScraped("kleinanzeigen");
      const cars = [
        ...(as24?.cars ?? []),
        ...(mde?.cars  ?? []),
        ...(kaz?.cars  ?? []),
      ];
      res.json({
        total: cars.length,
        lastUpdated: as24?.scrapedAt ?? kaz?.scrapedAt ?? mde?.scrapedAt ?? null,
        cars,
      });
    } catch (err) {
      console.error("/api/scraped-cars error:", err);
      res.status(500).json({ error: String(err) });
    }
  });

  // Run parsers once a day at 03:00
  cron.schedule("0 3 * * *", () => {
    console.log("[Cron] Starting daily parser run...");
    runAllParsers().catch(console.error);
  });
  console.log("[Cron] Parser scheduled: daily at 03:00");

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
