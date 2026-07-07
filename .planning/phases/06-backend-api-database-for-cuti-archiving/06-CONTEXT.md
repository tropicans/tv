# Phase 6: Backend API & Database for Cuti Archiving - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement database schema modifications and backend API changes to support employee leave (cuti) archiving (soft-delete, restore, and filtering) as well as updating the public display client API to hide archived leaves.

</domain>

<decisions>
## Implementation Decisions

### API Filter & Query Behavior
- **D-01:** By default, `GET /api/agenda/cuti` will filter out archived leaves (`isArchived: false`), returning only active employee leaves.
- **D-02:** The `GET /api/agenda/cuti` API will accept a `filter` query parameter (`active`, `archived`, or `all`) to allow fetching leaves based on archiving status.

### Soft-Delete & Restore CRUD Actions
- **D-03:** The `DELETE /api/agenda/cuti/:id` route will perform a soft-delete by setting the `isArchived` flag to `true` in the database instead of permanently deleting the database row.
- **D-04:** A new route `POST /api/agenda/cuti/:id/restore` will be implemented to restore an archived leave by resetting its `isArchived` flag to `false`.

### Public Display Filtering
- **D-05:** The public display agenda API `GET /api/display/agenda` will automatically filter out archived leaves (`isArchived: false`), ensuring that only active leaves are visible on the public TV display screens.

### the agent's Discretion
- The exact implementation details of database queries and Express route validation are left to the developer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` — Defines Phase 6 goals, active requirements (LVARCH-01 to LVARCH-05), and success criteria.
- `.planning/REQUIREMENTS.md` — Defines active requirements (LVARCH-01 to LVARCH-05).
- `BLACKBOX.md` — Defines design systems, tailwind colors, typography, and visual rules for PPKASN Corporate TV.

### Database & Router Codebases
- `backend/prisma/schema.prisma` — Defines the Prisma database schema (specifically the `EmployeeLeave` model).
- `backend/src/routes/agenda.ts` — Implements the CRUD routes for Employee Leave.
- `backend/src/routes/display.ts` — Implements the public display routes, including the `/agenda` endpoint.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/prisma/schema.prisma` — The `EmployeeLeave` model where `isArchived` Boolean will be added.
- `backend/src/routes/agenda.ts` — The router where GET, DELETE, and POST/PUT restore routes will be implemented/modified.
- `backend/src/routes/display.ts` — The router where public display data is prepared and filtered.

### Established Patterns
- Express Router and Prisma client for data querying.
- Date filtering utilities in `backend/src/utils/dateFilter.ts`.

### Integration Points
- Prisma schema migration run on container boot via `backend/entrypoint.sh`.
- Express route mounts at `/api/agenda` and `/api/display` in `backend/src/index.ts`.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- **LVARCH-10 (Auto-archiving Scheduler):** A scheduler/cron to automatically archive leaves that are passed by 30 days is deferred to v2 Requirements (out of scope for Phase 6).

</deferred>

---

*Phase: 6-Backend API & Database for Cuti Archiving*
*Context gathered: 2026-07-07*
