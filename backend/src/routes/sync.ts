import { Router } from "express";
import { scrapeMeetings } from "../services/scraper";

const router = Router();

// Endpoint to trigger a manual UI scrape
router.post("/meetings", async (req, res, next) => {
  try {
    // We launch it asynchronously and don't block the request response 
    // because scraping takes ~10+ seconds
    scrapeMeetings().catch(err => {
      console.error("[Scraper API] Error running async scrape:", err);
    });
    
    res.json({
      status: "success",
      message: "Scraping process triggered successfully in the background. Please check console logs."
    });
  } catch (error) {
    next(error);
  }
});

export default router;
