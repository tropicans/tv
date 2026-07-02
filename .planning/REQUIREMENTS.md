# Requirements: CMS Single Source of Truth

**Defined:** 2026-07-02
**Core Value:** Establish the CMS as the single, authoritative data entry source for weekly agenda activities and employee leaves.

## v1 Requirements (This Milestone)

### Scraper Deprecation
- [ ] **CMS-SOT-01**: Disable and remove Google Slides sync on boot and scheduled cron runs for `syncSlidesData()` in `backend/src/index.ts`.
- [ ] **CMS-SOT-02**: Retain the Puppeteer room booking scraper `scrapeMeetings()` as it is still required for the booking dashboard.

### CMS UI Simplification
- [ ] **CMS-SOT-03**: Remove all slides URL inputs and "Sinkronkan Sekarang" button triggers from `CmsDashboard.tsx`.
- [ ] **CMS-SOT-04**: Replace the Scraper tab with a clean "Dashboard Ringkasan" showing database overview statistics (Total Agenda Events, Total Leave Records) and helpful instructions.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-SOT-01 | Phase 1 (Backend Scraper Disable) | Pending |
| CMS-SOT-02 | Phase 1 (Backend Scraper Disable) | Pending |
| CMS-SOT-03 | Phase 2 (Frontend CMS Cleanup) | Pending |
| CMS-SOT-04 | Phase 2 (Frontend CMS Cleanup) | Pending |

---
*Last updated: 2026-07-02*
