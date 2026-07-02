# Phase 3: Agenda Display Responsiveness - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the public TV Agenda display routes (`/` and `/agenda`) mobile-responsive using Option 2 layout:
- Hiding secondary widgets (Video Embed and Weather) on viewport widths under 768px (Tailwind `md`).
- Stacking main widgets vertically and rendering cleanly without horizontal overflow/scrollbars.

</domain>

<decisions>
## Implementation Decisions

### Viewport Breakpoints & Hiding Widgets
- **D-01:** Responsive layout transition is triggered under 768px (Tailwind `md` breakpoint).
- **D-02:** Weather widget is hidden on `/agenda` route as well to maximize screen space for agenda and cuti items.
- **D-03:** Header layout content (logo/titles and digital clock) stacks vertically and centers on mobile viewports with font size adjustments (e.g. clock `text-4xl`).

### Weekly Calendar Mobile Layout
- **D-04:** The 5-day weekly calendar renders stacked vertically in a single scrollable column rather than a 5-column grid.
- **D-05:** Event cards are styled more compactly on mobile viewports by reducing padding (e.g. to `p-4`) and slightly scaling down fonts/headings.

### Cuti (Leave) List Stacking Position
- **D-06:** On mobile stacked layout, the Weekly Agenda calendar is placed first, followed by the Cuti Pegawai list below it.
- **D-07:** The Cuti list is displayed as a simple vertical stack, matching the desktop scroll order but without nested scrolling conflicts.

### Carousel Cycle & Scroll Animations
- **D-08:** The 15-second week auto-cycling (between Week 1 and Week 2) is disabled on mobile viewports, allowing users to manually switch weeks using buttons.
- **D-09:** The 25 FPS Cuti list auto-scrolling is disabled on mobile viewports, rendering as a natural static vertical list.

### the agent's Discretion
No specific areas deferred; standard layout implementation choices are left to the agent.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` — Defines active requirements (MOB-01 to MOB-03) and success criteria for Phase 3.
- `.planning/REQUIREMENTS.md` — Defines active requirements (MOB-01 to MOB-03).
- `BLACKBOX.md` — Visual guidelines and design system reference for TV displays.

### Design Prototypes
- `stitch/corporate_tv_dashboard_bahasa_indonesia_jadwal_sholat/code.html` — Original HTML prototype defining layout elements (weather, prayer times, clock, meeting list) and MD3 styles.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend-display/src/App.tsx`: Main routing and layout shell for `/` (default dashboard) and `/agenda`.
- `frontend-display/src/components/Header.tsx`: Header component.
- `frontend-display/src/components/AgendaDashboard.tsx`: Weekly calendar layout (`/agenda`).
- `frontend-display/src/components/MeetingList.tsx`: Agenda/Meeting List widget.
- `frontend-display/src/components/HourlyWeather.tsx`: Weather widget.
- `frontend-display/src/components/PrayerTimes.tsx`: Prayer times widget.
- `frontend-display/src/components/AnnouncementTicker.tsx`: Announcement marquee ticker.

### Established Patterns
- Tailwind breakpoints and Material Design 3 spacing and color system as configured in `frontend-display/tailwind.config.js`.

### Integration Points
- `/` route (rendered by `AppContent` in `App.tsx`) and `/agenda` route (rendered by `AgendaDashboard` in `App.tsx` and defined in `AgendaDashboard.tsx`).

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 3-Agenda Display Responsiveness*
*Context gathered: 2026-07-02*
