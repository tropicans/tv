# Phase 5: CMS Admin Tables & Forms - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Style the CRUD tables, forms, and statistics cards to fit smartphone viewports with touch-friendly elements in the CMS Admin panel:
- Ensure the overview stats cards and instructions panels stack vertically on small viewports.
- Stack CRUD forms (Agenda and Cuti) on top of their respective lists/tables when viewed on mobile screens.
- Implement responsive layout changes for tables, using horizontal scroll containers on tablets and card-list components on mobile screens.
- Guarantee touch targets are at least 44x44px for all inputs, delete buttons, autocomplete list items, and tab navigation buttons.

</domain>

<decisions>
## Implementation Decisions

### Statistics Cards Layout
- **D-01:** Overview stats cards will stack vertically (1 column) on viewports below 768px (Tailwind `md` breakpoint).
- **D-02:** Standard spacing, padding, and text sizing are maintained on stats cards for a cleaner, readable, and premium layout.

### Form & Table Grid Layout
- **D-03:** The 12-column grid layout for CRUD views (Agenda and Cuti) will stack vertically on viewports below 1024px (Tailwind `lg` breakpoint).
- **D-04:** Urutan Tumpukan: Form input is placed on top of the list table (`flex flex-col` or order utilities) to prioritize the CRUD flow on smaller viewports.

### Data Table Responsive View
- **D-05:** Dynamic Combo layout:
  - On tablet viewports (768px to 1023px), tables are wrapped in a scrollable horizontal container (`overflow-x-auto`) to avoid layout breakage.
  - On mobile viewports (below 768px, `md` breakpoint), the tables are refactored into a vertical list of card elements.
- **D-06:** The mobile card-list representation will show all vital fields:
  - Agenda: Title (prominent), Date/Day, Time, Location, and Delete Action.
  - Cuti: Employee Name (prominent), Date Range, Month, and Delete Action.

### Touch Target Sizing
- **D-07:** Minimum touch targets of 44x44px will be applied universally on mobile screens to all interactive elements, including:
  - Tab navigation buttons
  - Text and date inputs
  - Autocomplete dropdown list items (expanded vertical height/padding)
  - Trash action delete buttons (adding hover/click area padding around the icon)

### the agent's Discretion
- Exact styling details of the mobile card items (shadows, background colors, font weights) are left to the developer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` — Defines Phase 5 goals, active requirements (MOB-07 to MOB-09), and success criteria.
- `.planning/REQUIREMENTS.md` — Defines active requirements (MOB-07 to MOB-09).
- `BLACKBOX.md` — Defines design systems, tailwind colors, typography, and visual rules for PPKASN Corporate TV.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend-display/src/components/CmsDashboard.tsx` — Main CMS admin dashboard containing state, forms, tables, and tab views.

### Established Patterns
- Tailwind spacing, layout classes, and custom utility classes.

### Integration Points
- Grid views inside the `activeTab === "agenda"` and `activeTab === "cuti"` sections in `CmsDashboard.tsx`.

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

*Phase: 5-CMS Admin Tables & Forms*
*Context gathered: 2026-07-02*
