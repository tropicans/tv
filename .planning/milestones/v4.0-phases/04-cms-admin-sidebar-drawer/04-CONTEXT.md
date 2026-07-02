# Phase 4: CMS Admin Sidebar Drawer - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a collapsible sidebar navigation drawer with a burger menu toggle for small screens (viewports under 1024px):
- Adding hamburger toggle button next to the page header title, visible on viewports under 1024px (Tailwind `lg`).
- Displaying sidebar as an overlay drawer sliding from the left when open.
- Rendering a backdrop overlay covering the main panel when the sidebar is active.
- Tapping the backdrop or selecting any sidebar navigation link closes the drawer automatically.

</domain>

<decisions>
## Implementation Decisions

### Viewport Breakpoints & Toggle
- **D-01:** Responsive sidebar drawer layout is triggered under 1024px (Tailwind `lg` breakpoint).
- **D-02:** Hamburger menu toggle button using the `Menu` icon from Lucide React is displayed next to the main content title on screens below 1024px.
- **D-03:** Close button using the `X` icon from Lucide React is displayed in the sidebar's branding header on screens below 1024px.

### Sidebar Drawer Transition & Overlay
- **D-04:** Sidebar is styled as `fixed` position on viewports under 1024px, translating off-screen (`-translate-x-full`) by default, and sliding in (`translate-x-0`) with a smooth CSS transition (`transition-transform duration-300 ease-in-out`).
- **D-05:** A semi-transparent backdrop overlay (`bg-slate-900/40 backdrop-blur-sm`) covers the main canvas under 1024px when the sidebar is open.
- **D-06:** Tapping the backdrop overlay or any navigation links inside the sidebar automatically closes the drawer menu (sets `isSidebarOpen` state to `false`).

### the agent's Discretion
- Layout tuning for small viewport title headings and clock padding in the main content header is left to the developer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` — Defines active requirements (MOB-04 to MOB-06) and success criteria for Phase 4.
- `.planning/REQUIREMENTS.md` — Defines active requirements (MOB-04 to MOB-06).
- `BLACKBOX.md` — Visual guidelines and design system reference for TV displays.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend-display/src/components/CmsDashboard.tsx`: Main CMS admin interface containing the sidebar aside panel and main content view.

### Established Patterns
- Responsive layout handling using Tailwind breakpoint utilities and React state resize listeners (similar to `AgendaDashboard.tsx`).

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

*Phase: 4-CMS Admin Sidebar Drawer*
*Context gathered: 2026-07-02*
