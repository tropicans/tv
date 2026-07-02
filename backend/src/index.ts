import "dotenv/config";
import express from "express";
import cors from "cors";

import displayRoutes from "./routes/display";
import syncRoutes from "./routes/sync";
import agendaRoutes from "./routes/agenda";
import authRoutes, { authMiddleware } from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";
import cron from "node-cron";
import { scrapeMeetings } from "./services/scraper";
import { syncSlidesData } from "./services/slidesScraper";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public authentication routes
app.use("/api/auth", authRoutes);

// Public display widgets routes (for TV)
app.use("/api/display", displayRoutes);

// Protected administration and control routes
app.use("/api/sync", authMiddleware, syncRoutes);
app.use("/api/agenda", authMiddleware, agendaRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Run Scrapers initially on boot
setTimeout(() => {
  console.log("[Boot] Triggering initial scrape for sarpras-ppkasn...");
  scrapeMeetings().catch(console.error);
}, 10000);

// Run Scrapers automatically every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("[Cron] Running scheduled scrape for sarpras-ppkasn...");
  scrapeMeetings().catch(console.error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
