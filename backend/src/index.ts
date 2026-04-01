import "dotenv/config";
import express from "express";
import cors from "cors";

import displayRoutes from "./routes/display";
import syncRoutes from "./routes/sync";
import { errorHandler } from "./middleware/errorHandler";
import cron from "node-cron";
import { scrapeMeetings } from "./services/scraper";

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


app.use("/api/display", displayRoutes);
app.use("/api/sync", syncRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Run Scraper initially on boot
setTimeout(() => {
  scrapeMeetings().catch(console.error);
}, 10000);

// Run Scraper automatically every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("[Cron] Running scheduled scrape for sarpras-ppkasn...");
  scrapeMeetings().catch(console.error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
