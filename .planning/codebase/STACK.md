# Technology Stack

**Analysis Date:** 2026-07-02

## Languages

**Primary:**
- TypeScript `^6.0.2` (Backend) / `^4.9.5` (Frontend) - All application code.

**Secondary:**
- JavaScript - Configuration files (e.g., tailwind.config.js, postcss.config.js).
- Shell (Bash) - Docker entrypoint scripts (`entrypoint.sh`).

## Runtime

**Environment:**
- Node.js (Backend: configured via Alpine Docker container; Local: standard Node.js environment).
- Browser Runtime (Frontend: standard modern web browsers).

**Package Manager:**
- npm (Lockfile: `package-lock.json` present in both `backend/` and `frontend-display/`).

## Frameworks

**Core:**
- Express `^5.2.1` - Backend REST API server.
- React `^19.2.4` - Frontend single-page application (SPA).

**Testing:**
- Jest (via `react-scripts` `5.0.1`) - Frontend unit and component testing.
- React Testing Library (DOM `^10.4.1`, Jest DOM `^6.9.1`, React `^16.3.2`) - Component testing.

**Build/Dev:**
- react-scripts `5.0.1` - Frontend bundling, development server, and test runner.
- Tailwind CSS `^3.4.1` - Utility-first styling framework on the frontend.
- tsx `^4.21.0` - Fast TypeScript execution/watch runner for backend development.
- typescript `^6.0.2` (Backend) / `^4.9.5` (Frontend) - TypeScript compilation.

## Key Dependencies

**Critical:**
- `@prisma/client` `^5.22.0` - Database access and queries on the backend.
- `puppeteer` `^24.40.0` - Headless Chromium automation for scraping meetings.
- `praytimes` `^0.0.5` - Calculation of Islamic prayer times in code.
- `node-cron` `^4.2.1` - Scheduled background cron jobs for the scraper.
- `framer-motion` `^12.38.0` - Interactive UI animations on the frontend.

**Infrastructure:**
- `cors` `^2.8.6` - Cross-Origin Resource Sharing middleware for Express.
- `dotenv` `^17.3.1` - Loading environment variables from `.env` files.
- `lucide-react` `^1.7.0` - Icon set for the frontend UI.

## Configuration

**Environment:**
- Backend configured via `.env` file or container environment variables.
  - `DATABASE_URL` - PostgreSQL database connection URL.
  - `PORT` - Port to run the Express backend (defaults to 6001).
  - `TOMTOM_API_KEY` - API key for TomTom traffic flows.
  - `TICKER_SHEETS_URL` - Google Sheets CSV URL for announcements.
- Frontend configured at build-time using `REACT_APP_API_URL` (typically proxied via Nginx in Docker).

**Build:**
- `backend/tsconfig.json` - Compiler settings for backend.
- `frontend-display/tsconfig.json` - Compiler settings for frontend.
- `frontend-display/tailwind.config.js` - Custom theme and styling configuration.

## Platform Requirements

**Development:**
- Docker and Docker Compose (specifically for running PostgreSQL locally).
- Any OS supporting Node.js (Windows, macOS, Linux).

**Production:**
- Multi-container Docker deployment using `docker compose`.
  - Postgres container: `postgres:15-alpine`
  - Backend container: Custom Node.js image running entrypoint.sh.
  - Frontend-display container: Custom Nginx-based image serving static files and proxying API calls.

---

*Stack analysis: 2026-07-02*
*Update after major dependency changes*
