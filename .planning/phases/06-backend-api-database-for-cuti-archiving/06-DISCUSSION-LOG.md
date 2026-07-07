# Phase 6: Backend API & Database for Cuti Archiving - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 6-Backend API & Database for Cuti Archiving
**Areas discussed:** Filter Behavior

---

## Filter Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Default to 'active' | returns only active leaves, `isArchived: false` | ✓ |
| Default to 'all' | returns both active and archived leaves | |

**User's choice:** Default to 'active'
**Notes:** Decided that GET `/api/agenda/cuti` will filter out archived leaves by default, returning only active employee leaves (`isArchived: false`). This keeps responses clean and prevents archived leaves from leaking into the UI before the UI components have been fully updated.

---

## the agent's Discretion

- Route paths for restore and verbs: `POST /api/agenda/cuti/:id/restore` is selected as the RESTful action endpoint for restoring an archived leave.
- Soft-delete behavior: `DELETE /api/agenda/cuti/:id` is updated to set `isArchived: true` in the database, in line with requirements.

## Deferred Ideas

- **LVARCH-10 (Auto-archiving leaves scheduler/cron after 30 days):** Deferred to v2 requirements as it is out of scope for Phase 6.
