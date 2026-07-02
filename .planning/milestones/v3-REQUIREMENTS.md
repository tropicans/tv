# Requirements: CMS Single Source of Truth

**Status:** ✅ ARCHIVED 2026-07-02
**Core Value:** Establish the CMS as the single, authoritative data entry source for weekly agenda activities and employee leaves.

## Completed Requirements

### Scraper Deprecation
- [x] **CMS-SOT-01**: Disable and remove Google Slides sync on boot and scheduled cron runs for `syncSlidesData()` in `backend/src/index.ts`.
  - *Outcome*: Validated. The scheduler is disabled and slide sync code is inactive.
- [x] **CMS-SOT-02**: Retain the Puppeteer room booking scraper `scrapeMeetings()` as it is still required for the booking dashboard.
  - *Outcome*: Validated. Puppeteer rooms scraper remains active on boot and scheduler.

### CMS UI Simplification
- [x] **CMS-SOT-03**: Remove all slides URL inputs and "Sinkronkan Sekarang" button triggers from `CmsDashboard.tsx`.
  - *Outcome*: Validated. Removed settings forms, state variables, and manual sync triggers.
- [x] **CMS-SOT-04**: Replace the Scraper tab with a clean "Dashboard Ringkasan" showing database overview statistics (Total Agenda Events, Total Leave Records) and helpful instructions.
  - *Outcome*: Validated. Statistics cards and guide instructions rendered correctly.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-SOT-01 | Phase 1 (Backend Scraper Disable) | Passed |
| CMS-SOT-02 | Phase 1 (Backend Scraper Disable) | Passed |
| CMS-SOT-03 | Phase 2 (Frontend CMS Cleanup) | Passed |
| CMS-SOT-04 | Phase 2 (Frontend CMS Cleanup) | Passed |

---
*Archived: 2026-07-02*
