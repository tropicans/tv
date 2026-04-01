import { scrapeMeetings } from "./src/services/scraper";

async function main() {
  console.log("Starting scraper test...");
  await scrapeMeetings();
  console.log("Scraper test finished.");
}

main().catch(console.error);
