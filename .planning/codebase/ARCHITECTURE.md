# Architecture

**Analysis Date:** 2026-07-02

## Pattern Overview

**Overall:** Decoupled Full-Stack Web Application (Express API + React TV Dashboard).

**Key Characteristics:**
- **Asymmetric Dockerized Services:** Backend handles heavy scraping workloads (Chromium execution via Puppeteer) and API endpoints; frontend-display operates as a thin client serving HTML/JS and fetching data.
- **Tonal Layering & No-Lines UI:** The frontend closely follows the Material Design 3 design system outlined in `BLACKBOX.md` with borders replaced by tonal shifts.
- **Self-Healing Cron Scraper:** Backend periodically triggers a Puppeteer script that refreshes database records. A lock mechanism ensures overlapping runs do not occur.

## Layers

### Backend Layers

**Route Layer:**
- Purpose: Map HTTP endpoints to handlers and parse incoming requests.
- Contains: `backend/src/routes/display.ts` and `backend/src/routes/sync.ts`.
- Depends on: Services, utilities, and Prisma client.

**Service Layer:**
- Purpose: Execute business logic and orchestrate integrations.
- Contains:
  - `backend/src/services/scraper.ts` (Puppeteer browser control and DOM scraping).
  - `backend/src/services/ticker.ts` (Aggregates BMKG, RSS news, Google Sheets CSV, and finance data).
- Depends on: Prisma client, external services.

**Data Access Layer:**
- Purpose: Provide database ORM interface.
- Contains: `backend/src/prisma.ts` (Prisma client singleton) and `backend/prisma/schema.prisma`.

### Frontend Layers

**Component Layer:**
- Purpose: Render widgets and layouts based on UI specifications.
- Contains: `frontend-display/src/components/*` (Clock, Weather, PrayerTimes, MeetingList, Ticker, etc.).
- Depends on: UI components, React hooks.

**State & Data Hook Layer:**
- Purpose: Fetch API data and manage React state.
- Contains: `frontend-display/src/hooks/useDisplayData.ts`.
- Depends on: `frontend-display/src/api.ts` (fetch requests).

## Data Flow

### Scheduled Scrape Flow (Cron/Boot)
1. Backend boots up or cron triggers after 30 minutes.
2. `scrapeMeetings()` from `backend/src/services/scraper.ts` checks `isScraping` lock.
3. Puppeteer launches headless browser, navigates to `https://sarpras-ppkasn.vercel.app/room`.
4. Page grid is crawled to find active booking cells, clicking each to trigger a modal.
5. Modal data is extracted via regex, formatted into unified schemas (with Asia/Jakarta timezone offsets).
6. Existing meetings for the current month are removed and new records inserted into PostgreSQL via Prisma.

### Dashboard Data Request Flow
1. React frontend mounts `App.tsx` and calls the `useDisplayData()` hook.
2. Hook performs parallel fetch requests to `/api/display/data` and `/api/display/ticker`.
3. `/api/display/data` route handler:
   - Fetches this month's meetings from PostgreSQL.
   - De-duplicates/groups meetings sharing identical times and names but distinct locations.
   - Computes Islamic prayer times locally using `praytimes` utility for the Jakarta Selatan coordinate.
4. Response containing meeting list and prayer times is returned to React.
5. React updates local state, re-rendering UI widgets on the grid.

## Key Abstractions

**Scraper Lock (`isScraping`):**
- Purpose: Prevent concurrent scraping executions.
- Pattern: In-memory boolean flag checking within `scraper.ts`.

**Prayer Time Calculator (`getPrayerTimesForToday`):**
- Purpose: Abstract away prayer time math.
- Pattern: Wrapper function in `backend/src/utils/prayerTimes.ts` utilizing the `praytimes` npm library with hardcoded coordinates.

**Infinite Marquee Scroll (`MeetingList` and `AnnouncementTicker`):**
- Purpose: Smooth animation of lists and text on TV.
- Pattern: Custom Tailwind CSS transitions, CSS animations, and `framer-motion` hooks.

## Entry Points

**Backend Service Entry:**
- Location: `backend/src/index.ts`
- Responsibilities: Launches Express server, maps API routes, registers global middleware, initializes cron scheduler.

**Frontend UI Entry:**
- Location: `frontend-display/src/index.tsx`
- Responsibilities: Mounts the main React application tree onto the root DOM element.

## Error Handling

**Backend Route Level:**
- Custom middleware `backend/src/middleware/errorHandler.ts` catches unhandled exceptions in routes and returns a formatted JSON response (`status: 500`).

**Scraper Fail-Safes:**
- Puppeteer logic is wrapped in `try/catch/finally` blocks ensuring that even if page loading fails or times out, the browser closes gracefully and the `isScraping` lock is reset.

**Frontend Error Boundary:**
- If the backend is unreachable or returns a 500 error, `App.tsx` catches the failure and renders a full-screen error dialog rather than crashing the browser.

---

*Architecture analysis: 2026-07-02*
*Update when major patterns change*
