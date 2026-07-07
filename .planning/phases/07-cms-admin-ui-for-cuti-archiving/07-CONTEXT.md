# Phase 7: CMS Admin UI for Cuti Archiving - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Update the "Kelola Cuti" page in the CMS Admin panel to replace the "Hapus" (hard delete) action with an "Arsipkan" (soft-delete/archive) action. Provide a sub-tabs filter to toggle between "Cuti Aktif" and "Cuti Terarsip" lists, along with a "Pulihkan" (Restore) action for archived items.

</domain>

<decisions>
## Implementation Decisions

### Filter UI & Layout
- **D-01:** Implement a sub-tabs layout with two horizontal button tabs ("Cuti Aktif" and "Cuti Terarsip") in the panel header of the "Daftar Cuti Terdaftar" card. This keeps the filter contextual.

### CRUD Actions (Archive & Restore)
- **D-02:** Change the "Hapus" button/action in the active leave list to "Arsipkan" with an archive icon (`Archive` from `lucide-react`) and trigger a confirmation dialog.
- **D-03:** Add a "Pulihkan" (Restore) button with a restore/reload icon (`RotateCcw` or `RefreshCw` from `lucide-react`) for items in the "Cuti Terarsip" list.
- **D-04:** Use the updated API client helper `deleteLeaveItem` (or alias it with `deleteEmployeeLeave`) and a new helper `restoreLeaveItem` to interface with the backend.

### Data Loading & Syncing
- **D-05:** Maintain a single list state and use the `filter` parameter of `fetchEmployeeLeaves` to reload the data dynamically on tab change.

### the agent's Discretion
- The exact styling details of the tabs and components (Tailwind classes, custom styling of the confirmation dialog) are left to the developer's discretion, keeping it premium and consistent with PPKASN TV aesthetics.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `c:/Users/yudhiar/Downloads/oprek/Dev/tv/.planning/ROADMAP.md` — Defines active requirements and goals.
- `c:/Users/yudhiar/Downloads/oprek/Dev/tv/.planning/REQUIREMENTS.md` — Defines requirements (LVARCH-06 to LVARCH-09).
- `c:/Users/yudhiar/Downloads/oprek/Dev/tv/BLACKBOX.md` — Defines design systems, tailwind colors, typography, and visual rules for PPKASN Corporate TV.

### Frontend Codebase
- `c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display/src/api.ts` — Location for API client helpers.
- `c:/Users/yudhiar/Downloads/oprek/Dev/tv/frontend-display/src/components/CmsDashboard.tsx` — Main CMS Admin UI component.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CmsDashboard.tsx` — Existing dashboard component.
- `api.ts` — API client helpers.
- `lucide-react` icons — `Archive` and `RotateCcw` / `RefreshCw` to represent actions.

### Established Patterns
- Tabs are managed via `useState` and state variables like `activeTab`.
- API requests are made using custom helper functions and error/loading states.

### Integration Points
- The `fetchEmployeeLeaves` helper and `handleDeleteCutiItem` inside `CmsDashboard.tsx`.

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

*Phase: 7-CMS Admin UI for Cuti Archiving*
*Context gathered: 2026-07-07*
