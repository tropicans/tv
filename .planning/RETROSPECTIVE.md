# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v4.0 — Mobile Responsiveness

**Shipped:** 2026-07-02
**Phases:** 3 | **Plans:** 5 | **Sessions:** 4

### What Was Built
- **Responsive TV Display**: Vertical stacking of widgets (Header, Meetings, Prayer Times, Announcement Ticker) and conditional rendering hiding secondary components (Weather, Video Embed) on screens < 768px.
- **Collapsible Drawer Sidebar**: CMS sidebar drawer component with hamburger menu toggle, overlay backdrop dismiss actions, and auto-close trigger on link selection for screens < 1024px.
- **Responsive CMS Forms & Tables**: Form stacking above table lists, horizontal overflow wrappers for tablet tables, card lists for mobile devices, and min 44x44px touch target sizes for all inputs and buttons.

### What Worked
- Combined related phase implementations (Phase 4 Sidebar Drawer and Phase 5 Forms/Tables) into a unified codebase refactor, preventing redundant modifications to `CmsDashboard.tsx`.
- Wrote detailed Jest unit tests simulating window resize actions to systematically verify breakpoints and layout class rendering without manual browser testing.

### What Was Inefficient
- Executing tests inside Docker containers using one-shot docker runs (`node:20-alpine`) took longer (around 30 seconds per test run) than local execution.

### Patterns Established
- Breakpoint-based unit test mocks utilizing custom `setWindowWidth` helpers to verify Tailwind layout responses (e.g. asserting `lg:static`, `lg:translate-x-0` presence on desktop vs `-translate-x-full` on mobile).

### Key Lessons
- Ensuring forms are positioned above list tables when stacked on small viewports significantly improves user accessibility in responsive CRUD views.
- Applying explicit minimum heights and paddings (e.g. `min-h-[44px]`) to all navigation elements and interactive buttons makes interfaces immediately touch-friendly.

### Cost Observations
- Model mix: 100% Gemini 3.5 Flash (Medium)
- Sessions: 4
- Notable: High context efficiency by combining frontend refactoring tasks.

---

## Milestone: v5.0 — Cuti Archiving

**Shipped:** 2026-07-07
**Phases:** 2 | **Plans:** 2 | **Sessions:** 1

### What Was Built
- **Archiving DB Schema & Migration**: Added `isArchived` Boolean column to the `EmployeeLeave` model in Prisma and generated/applied the Postgres database migration.
- **Soft-Delete & Filtering API**: Refactored backend DELETE to soft-delete, created POST `/restore` to restore leaves, and updated GET routes to support filter queries (`active`, `archived`, `all`) and automatically hide archived leaves from the public display.
- **CMS Admin UI split tab and modals**: Replaced the hard Hapus button with an Arsipkan button, created tab sub-navigation for "Cuti Aktif" and "Cuti Terarsip", added Pulihkan button for archived leaves, and built custom Tailwind overlays for modal confirmation.

### What Worked
- Replacing the raw `window.confirm` with custom React component states for dialog modal overlays created a highly polished, interactive UI.
- Mocking the new API helpers in Jest test suites allowed testing the UI behavior easily without modifying global tests.

### What Was Inefficient
- Node.js missing on the host environment required using the absolute path to the NVM symlink node binary (`C:\nvm4w\nodejs\node.exe`) for executing local GSD tools.

### Patterns Established
- Component state-driven confirmation modals replacing default browser dialogs.
- Active/Archived sub-tab horizontal navigation with stateful query parameters for data lists.

### Key Lessons
- Soft-deletions preserve employee data history and prevent accidental permanent deletions of records.
- Standardizing confirmation interactions as Tailwind overlay components improves the aesthetic consistency of admin panels.

### Cost Observations
- Model mix: 100% Gemini 3.5 Flash (Medium)
- Sessions: 1
- Notable: Fast implementation of backend-to-frontend archiving workflow.

---

## Cross-Milestone Trends

## Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v3.0 | 3 | 2 | Single source of truth CMS migration |
| v4.0 | 4 | 3 | Breakpoint testing pattern via simulated resize events |
| v5.0 | 1 | 2 | Soft-delete archiving and horizontal list tab filtering |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v3.0 | 1 | 100% | 0 |
| v4.0 | 3 | 100% | 0 |
| v5.0 | 5 | 100% | 0 |

### Top Lessons (Verified Across Milestones)

1. Combining backend/frontend data modifications into a single source of truth eliminates scraper sync issues.
2. Simulated viewport tests are extremely effective in guaranteeing responsive layouts work correctly under specific breakpoints.
3. Soft-delete archiving provides historical log preservation and preserves system audit trails.
