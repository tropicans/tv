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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v3.0 | 3 | 2 | Single source of truth CMS migration |
| v4.0 | 4 | 3 | Breakpoint testing pattern via simulated resize events |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v3.0 | 1 | 100% | 0 |
| v4.0 | 3 | 100% | 0 |

### Top Lessons (Verified Across Milestones)

1. Combining backend/frontend data modifications into a single source of truth eliminates scraper sync issues.
2. Simulated viewport tests are extremely effective in guaranteeing responsive layouts work correctly under specific breakpoints.
