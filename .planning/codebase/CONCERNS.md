# Codebase Concerns

**Analysis Date:** 2026-07-02

## Tech Debt

**Regex-based XML/RSS parsing:**
- Issue: Custom regex parsing of XML responses instead of using a standard parser library.
- Files: `backend/src/services/ticker.ts` (lines 17–43)
- Why: Implemented quickly to avoid adding external XML parser dependencies.
- Impact: Unreliable if XML tags have attributes, contain nested structures, or include unexpected whitespace/newlines.
- Fix approach: Replace regex matches with a robust XML parser like `xml2js` or `fast-xml-parser`.

**Fragile Puppeteer DOM dependencies:**
- Issue: Scraper relies heavily on page query selectors and simulated DOM clicks to open booking detail modals.
- Files: `backend/src/services/scraper.ts` (lines 74–135)
- Why: The target site calendar does not expose a public API endpoint, necessitating DOM traversal.
- Impact: Any front-end layout or structure update on the target site (`https://sarpras-ppkasn.vercel.app/room`) will break the scraper.
- Fix approach: Implement error alerts if table selectors fail to load, or explore if the target site's underlying data fetch endpoint can be reached directly.

**Unused database models and seeding:**
- Issue: `PrayerTime` model is defined in the Prisma schema and populated during database seeding, but never queried by the runtime application.
- Files: `backend/prisma/schema.prisma` (lines 27–38), `backend/prisma/seed.ts` (lines 63–78)
- Why: Pre-calculated prayer times were planned to be DB-driven but were later implemented dynamically in code.
- Impact: Unused database table space and unnecessary migrations.
- Fix approach: Remove the `PrayerTime` model from the Prisma schema and drop the table.

## Known Bugs

**Date parser localization lock:**
- Symptoms: If the target website updates its locale or calendar display to English, scraped dates fail to parse correctly and fall back to incorrect times.
- Trigger: Scraper expects Indonesian month names (`januari`, `februari`, etc.).
- Files: `backend/src/services/scraper.ts` (lines 217–246)
- Root cause: Hardcoded dictionary matching Indonesian month strings.
- Fix: Use a localization-aware date parsing library like `luxon` or `moment`.

**Stale CRA boilerplate unit test:**
- Symptoms: Running frontend tests might fail or run unnecessary assertions on boilerplate elements.
- Trigger: Running `npm test` inside `frontend-display/`.
- Files: `frontend-display/src/App.test.tsx`
- Root cause: Standard Create React App template file checking for the "learn react" link, which has been replaced.
- Fix: Replace the assertions to check for core widgets (e.g., Header or MeetingList) or delete the boilerplate test.

## Security Considerations

**Public scraper trigger endpoint:**
- Risk: Anyone can hit `/api/sync/meetings` via a POST request, causing the server to spin up Puppeteer instances repeatedly.
- Files: `backend/src/routes/sync.ts` (lines 7–22)
- Current mitigation: A simple boolean lock (`isScraping`) prevents overlapping scraping runs, but doesn't prevent sequential abuse.
- Recommendations: Add an API key or bearer token check, or restrict this route to specific local IPs.

**Unsanitized scraped input:**
- Risk: Scraped data (titles, locations, user names) is inserted directly into the database and rendered on the dashboard without sanitization.
- Files: `backend/src/services/scraper.ts` (lines 285–302), `frontend-display/src/components/MeetingList.tsx`
- Current mitigation: None. React protects against basic HTML injection during rendering, but attribute or nested value vulnerabilities remain.
- Recommendations: Sanitize strings in `scraper.ts` before inserting them into the database.

## Performance Bottlenecks

**Non-atomic database syncing:**
- Problem: The sync process wipes out the current month's meetings before creating the new ones.
- Files: `backend/src/services/scraper.ts` (lines 292–300)
- Measurement: Takes ~1–3 seconds to execute database operations.
- Cause: Calls `deleteMany` and then runs sequential `create` calls.
- Impact: If a user queries `/api/display/data` during this window, the UI shows an empty meeting dashboard.
- Improvement path: Wrap the delete and create calls in a single database transaction (`prisma.$transaction`).

**Puppeteer startup overhead:**
- Problem: Running the scraper consumes significant memory and CPU.
- Files: `backend/src/services/scraper.ts` (lines 33–37)
- Cause: Launching full headless Chromium instances inside Docker.
- Improvement path: Ensure Chromium sandbox settings are optimized and reuse browser instances if possible.

## Fragile Areas

**Sequential cell clicks in scraper:**
- Why fragile: If a single cell click fails or a modal fails to render within the 3-second timeout, the rest of the scrape could desynchronize or miss records.
- Files: `backend/src/services/scraper.ts` (lines 109–192)
- Common failures: Slow page responsiveness causing the modal selector to be missing.
- Test coverage: Zero test coverage.

## Test Coverage Gaps

**Zero backend automated tests:**
- What's not tested: Scraper logic, date parsing helper, Express routing, and error middleware.
- Risk: Code changes can break scraper functionality without developer awareness until it fails in production.
- Priority: Medium.
- Difficulty to test: High, requires mock network/browser environments or database containers.

---

*Concerns audit: 2026-07-02*
*Update as issues are fixed or new ones discovered*
