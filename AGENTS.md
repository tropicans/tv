# AGENTS.md

## Repo map
- This repo has three distinct areas: `backend/` (Express + Prisma + Puppeteer API/scraper), `frontend-display/` (Create React App TV UI), and `stitch/` (design/prototype references, not runtime code).
- There is no root workspace package. Run Node commands from `backend/` or `frontend-display/`; use the repo root for Docker Compose only.
- Read `BLACKBOX.md` when work depends on the visual/design reference material under `stitch/`, but do not treat `stitch/` as the implementation source of truth.

## Run path
- Primary full-stack entrypoint is `docker compose up -d --build --remove-orphans` from repo root.
- Compose wiring is Postgres `:6000` -> backend `:6001` -> frontend-display `:6002`. The user-facing dashboard is `http://localhost:6002`.

## Backend facts
- Backend entrypoint is `backend/src/index.ts`; Docker actually starts via `backend/entrypoint.sh`, which runs `npx prisma migrate deploy` before `npx tsx src/index.ts`.
- Backend scripts live in `backend/package.json`: `npm run dev`, `npm run build`, `npm run start`, `npm run db:migrate`, `npm run db:seed`, `npm run db:generate`.
- Main API surfaces are `/api/display` and `/api/sync`; `/api/health` is the healthcheck.
- The scraper runs once shortly after boot and then every 30 minutes. Scraper changes should be validated in Docker context because Puppeteer depends on Chromium and `PUPPETEER_EXECUTABLE_PATH`.
- If Prisma schema changes, update schema/migration flow before verifying routes. The schema targets Alpine via `linux-musl-openssl-3.0.x`.
- Prayer times are computed in code from `backend/src/utils/prayerTimes.ts`; do not assume the `PrayerTime` Prisma model is the runtime source.

## Frontend-display facts
- `frontend-display/` is a standalone CRA app. Use `npm start`, `npm run build`, and `npm test` from that directory.
- Frontend entrypoints are `frontend-display/src/index.tsx`, `frontend-display/src/App.tsx`, and `frontend-display/src/api.ts`.
- The frontend API base defaults to `/api`. In Docker, `frontend-display/nginx.conf` proxies `/api/` to the backend container.
- `REACT_APP_API_URL` is a build-time CRA env, not a runtime toggle; changing it requires rebuilding the frontend image/app.
- Tailwind tokens and animation primitives live in `frontend-display/tailwind.config.js`.
- `frontend-display/src/App.test.tsx` is stale CRA boilerplate (`learn react`) and is not a trustworthy behaviour test.

## Verification rule
- Prefer executable sources over prose: trust Compose, package scripts, Dockerfiles, nginx config, and runtime entrypoints over the generic CRA README.
