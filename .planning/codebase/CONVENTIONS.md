# Coding Conventions

**Analysis Date:** 2026-07-02

## Naming Patterns

**Files:**
- `PascalCase.tsx` for React components.
- `kebab-case` for general folders and config documents.
- `camelCase.ts` for helper libraries and utils (`prayerTimes.ts`).
- `*.test.tsx` for React unit test files collocated with components.

**Functions & Methods:**
- `camelCase` for all standard functions and API handlers (`scrapeMeetings`, `getTickerData`).
- Event handlers are named descriptive of their action (e.g., `fetchDisplayData`).

**Variables:**
- `camelCase` for standard scope variables.
- `UPPER_SNAKE_CASE` for script-level config parameters and constants (`CACHE_TTL`, `API_BASE`).

**Types & Interfaces:**
- `PascalCase` for TS interfaces and models (`Meeting`, `BookingData`).
- No special prefixes (no `I` prefix for interfaces).

## Code Style

**Formatting:**
- 2-space indentation.
- Double quotes `"` preferred for import statements and general string expressions.
- Semicolons required at line endings.
- Extensively uses ES6 import/export syntax in backend and frontend.

**Linting:**
- Frontend uses standard ESLint configured via Create React App's default configuration (`eslintConfig` in `package.json` extending `react-app` and `react-app/jest`).
- No separate lint configs exist in the backend.

## Import Organization

**Order:**
1. External core packages (e.g., `react`, `express`, `puppeteer`).
2. Local database/ORM modules (e.g., `prisma` client).
3. Relative internal components/hooks (e.g., `./components/Header`, `../hooks/useDisplayData`).
4. Static assets and stylesheets (e.g., `logoBerAKHLAK.png`, `./index.css`).

## Error Handling

**REST API Handlers:**
- Async controller routes wrap logic in standard `try/catch` structures.
- Errors are passed to Express' `next` callback or handled by standard response generators (returning a status 500 JSON load on failure).

**Scrapers and Cron Tasks:**
- Scraper executions catch inner exceptions to ensure Puppeteer browsers are closed (`finally` statement) and error outputs are printed to standard error (`console.error`).
- `isScraping` state lock is reset in the scraper's `finally` block to allow future scraping attempts if an error occurs.

## Logging

- Logging relies exclusively on native `console.log` and `console.error` methods.
- Logs are prefixed with bracketed tags specifying the module name, for example:
  - `[Scraper] Starting Puppeteer scrape...`
  - `[Cron] Running scheduled scrape...`
  - `[Ticker Service] Cache expired...`
- Structured JSON logging is not configured; console outputs are raw strings.

## Comments

- **Scraper details:** Timezone hacks (Jakarta emulate timezone), regex capture groups, and field parsing are annotated.
- **API logic:** Explains why meetings are merged (duplicate schedules mapped to multiple room bookings).

---

*Convention analysis: 2026-07-02*
*Update when patterns change*
