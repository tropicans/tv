# Roadmap: CMS Single Source of Truth

## Milestone 3: CMS Single Source of Truth

### Phase 1: Disable Scraper (Backend)
- **Goal**: Disable the automated Google Slides scraper scheduler and boot trigger.
- **Tasks**:
  - Remove slides scraper execution from index.ts startup.
  - Remove slides scraper execution from the cron scheduler.
  - Keep Puppeteer room bookings scraper active.
- **Verification**: Check container logs to verify no slides scraper execution starts.

### Phase 2: CMS UI Refactor (Frontend)
- **Goal**: Remove Google Slides configuration forms and replace the Scraper tab with a statistics Overview Dashboard.
- **Tasks**:
  - Replace the Scraper/Settings tab in `CmsDashboard.tsx` with a dashboard displaying the count of agenda events and leaves.
  - Add descriptive instructions on how these items map to the TV columns.
- **Verification**: Run build and verify that the CMS features a clean interface with no mention of Google Slides URL settings.

---
*Last updated: 2026-07-02*
