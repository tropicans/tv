# External Integrations

**Analysis Date:** 2026-07-02

## APIs & External Services

**TomTom Traffic API:**
- Used for real-time traffic monitoring at Bundaran HI, Jakarta.
  - SDK/Client: Native `fetch` REST API.
  - Auth: API key provided in the `TOMTOM_API_KEY` environment variable.
  - Endpoints used: `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`

**BMKG TEWS (Indonesian Meteorological, Climatological, and Geophysical Agency):**
- Used to retrieve the latest earthquake magnitudes and warnings.
  - Integration method: HTTP request fetching public XML feed, parsed with regex.
  - Auth: Publicly accessible, no authentication required.
  - Endpoints used: `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml`

**Antara News RSS:**
- Used to populate news ticker headlines.
  - Integration method: Public XML RSS feed parsed with regex.
  - Auth: Publicly accessible, no authentication required.
  - Endpoints used: `https://www.antaranews.com/rss/terkini.xml`

**Google Sheets CSV (Announcements):**
- Used to pull dynamic internal announcements from a shared spreadsheet.
  - Integration method: HTTP request fetching published CSV data.
  - Auth: Accessed via public sharing URL in `TICKER_SHEETS_URL`.
  - Endpoints used: Configured via environment variable.

**ExchangeRate API:**
- Used to retrieve USD to IDR exchange rates.
  - Integration method: REST API via standard `fetch`.
  - Auth: Public free endpoint.
  - Endpoints used: `https://api.exchangerate-api.com/v4/latest/USD`

**Sarpras Room Calendar Scraper:**
- Puppeteer scraper pulling scheduled room bookings from the target system.
  - Integration method: Automated browser interaction navigating grid cells and modals.
  - Auth: Public access to target web calendar.
  - Target URL: `https://sarpras-ppkasn.vercel.app/room`

## Data Storage

**PostgreSQL (Prisma ORM):**
- Primary database store for meetings and metadata.
  - Connection: Configured via the `DATABASE_URL` environment variable.
  - Client: Prisma ORM (Prisma client `^5.22.0`).
  - Migrations: Managed via `npx prisma migrate dev` / `npx prisma migrate deploy`.

**In-Memory Caching:**
- The backend caches news, BMKG, finance, and traffic ticker data for 5 minutes (`CACHE_TTL = 5 * 60 * 1000`) in `backend/src/services/ticker.ts` to prevent rate limits.

## Authentication & Identity

- No authentication or user accounts are currently implemented on backend API surfaces (`/api/display` or `/api/sync`). All data endpoints are public.

## Monitoring & Observability

- **Logs:** Standard output (stdout) and standard error (stderr) logging for Node.js backend. Cron operations and scraping logs are outputted directly to console.

## CI/CD & Deployment

- **Containerization:** Configured via `docker-compose.yml` defining three services:
  - `postgres` (using `postgres:15-alpine` image)
  - `backend` (built using `backend/Dockerfile`)
  - `frontend-display` (built using `frontend-display/Dockerfile`)
- **Wiring:** Compose connects the services using a bridge network called `corporate-tv`. Postgres listens on `6000`, Backend on `6001`, and Frontend on `6002`.

## Environment Configuration

**Development:**
- Required env vars:
  - `DATABASE_URL` - Database connection URI.
  - `PORT` - Port (6001).
  - `TOMTOM_API_KEY` - (Optional) TomTom traffic API key.
  - `TICKER_SHEETS_URL` - (Optional) CSV source for internal announcements.
- Secrets location: Local `.env` files (gitignored).

**Production:**
- Secrets and keys are injected into the Docker container environment at startup.

---

*Integration audit: 2026-07-02*
*Update when adding/removing external services*
