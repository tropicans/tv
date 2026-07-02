# Milestone v3: CMS Single Source of Truth

**Status:** ✅ SHIPPED 2026-07-02
**Phases:** 1-2
**Total Plans:** 2

## Overview

Deprecate the Google Slides scraping/synchronization engine to establish the custom CMS admin panel as the Single Source of Truth for all activity agendas and leave listings. Refactor the CMS dashboard interface to display database statistics instead of Google Slides URL settings.

## Phases

### Phase 1: Disable Scraper (Backend)

**Goal**: Disable the automated Google Slides scraper scheduler and boot trigger.
**Depends on**: None
**Plans**: 1 plan

Plans:
- [x] Phase 1: Decommission Slides Scraper

**Details:**
- Remove slides scraper execution from index.ts startup.
- Remove slides scraper execution from the cron scheduler.
- Keep Puppeteer room bookings scraper active.
- Verify that no slides scraper execution starts on container boot.

### Phase 2: CMS UI Refactor (Frontend)

**Goal**: Remove Google Slides configuration forms and replace the Scraper tab with a statistics Overview Dashboard.
**Depends on**: Phase 1
**Plans**: 1 plan

Plans:
- [x] Phase 2: Refactor CMS Settings Tab

**Details:**
- Replace the Scraper/Settings tab in `CmsDashboard.tsx` with a dashboard displaying the count of agenda events and leaves.
- Add descriptive instructions on how these items map to the TV columns.
- Rebrand UI text from "Setneg CMS" to "Agenda CMS".
- Remove email login, keeping Google Sign-in only.

---

## Milestone Summary

**Key Decisions:**
- Decision: Deprecate Google Slides Scraper (Rationale: Establish custom CMS as the Single Source of Truth to prevent sync delays and external dependencies).
- Decision: Display statistics overview dashboard (Rationale: Provide a direct summary of events and leaves to replace the obsolete scraper settings tab).

**Issues Resolved:**
- Removed slides sync boot trigger and cron scheduler.
- Cleaned up Google Slides URL configuration forms and sync buttons in CMS.
- Added Overview Dashboard with real-time stats for events and leaves.
- Removed email verification login to support Google Sign-in exclusively.
- Renamed "Setneg CMS" to "Agenda CMS".
- Filtered out passed leaves from the display based on local Jakarta time.

**Issues Deferred:**
- None.

**Technical Debt Incurred:**
- Kept the deprecated slides scraper source code in `src/services/slidesScraper.ts` for history, though completely disabled from all code invocation paths.
- Removed unused slidesUrl configuration fields and settings tabs.

---

_For current project status, see .planning/ROADMAP.md_
