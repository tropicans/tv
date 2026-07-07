# Phase 6: Backend API & Database for Cuti Archiving - Research
Researched: 2026-07-07
Domain: Database schema & Backend REST APIs
Confidence: HIGH

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** By default, `GET /api/agenda/cuti` will filter out archived leaves (`isArchived: false`), returning only active employee leaves.
- **D-02:** The `GET /api/agenda/cuti` API will accept a `filter` query parameter (`active`, `archived`, or `all`) to allow fetching leaves based on archiving status.
- **D-03:** The `DELETE /api/agenda/cuti/:id` route will perform a soft-delete by setting the `isArchived` flag to `true` in the database instead of permanently deleting the database row.
- **D-04:** A new route `POST /api/agenda/cuti/:id/restore` will be implemented to restore an archived leave by resetting its `isArchived` flag to `false`.
- **D-05:** The public display agenda API `GET /api/display/agenda` will automatically filter out archived leaves (`isArchived: false`), ensuring that only active leaves are visible on the public TV display screens.

### the agent's Discretion
- The exact implementation details of database queries and Express route validation are left to the developer.

### Deferred Ideas
- **LVARCH-10 (Auto-archiving Scheduler):** A scheduler/cron to automatically archive leaves that are passed by 30 days is deferred to v2 Requirements (out of scope for Phase 6).

## Architectural Responsibility Map

| Capability | Primary Tier | Rationale |
|---|---|---|
| Database Schema Update (`isArchived` flag) | Database Tier (Prisma PostgreSQL) | Adds the soft-delete state persistence layer to `EmployeeLeave` model. |
| Leave Status Query Filtering (`GET /api/agenda/cuti?filter=...`) | Application Tier (Express Router) | Parses query parameters and constructs correct Prisma `where` filter condition. |
| Leave Soft-Delete (`DELETE /api/agenda/cuti/:id`) | Application Tier (Express Router) | Updates the DB flag to `isArchived: true` instead of physically deleting rows. |
| Leave Restoration (`POST /api/agenda/cuti/:id/restore`) | Application Tier (Express Router) | Updates the DB flag back to `isArchived: false`. |
| Public Display Filtering (`GET /api/display/agenda`) | Application Tier (Express Router) | Filters out archived leaves at the DB query level before processing display formatting. |

## Summary

This phase introduces an archiving capability (soft-delete, filter, and restore) for the Employee Leave (`cuti`) records. By default, both the admin list view (`GET /api/agenda/cuti`) and the public display system (`GET /api/display/agenda`) will hide archived items, preserving historical logs without cluttering current visual displays.

**Actionable Primary Recommendation:**
Modify the Prisma schema in [schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma) to add `isArchived Boolean @default(false)` to `EmployeeLeave`. Generate the migrations locally on the host machine using the forwarded PostgreSQL database port `6000` with the command:
```bash
DATABASE_URL="postgresql://postgres:Satepad%40ng@localhost:6000/corporate_tv?schema=public" npx prisma migrate dev --name add_is_archived_to_employee_leave
```
This ensures the migration SQL is correctly generated and placed in the project directory, so it can be deployed on the target database automatically inside the Docker environment via `entrypoint.sh` using `npx prisma migrate deploy`.

## Standard Stack

| Library | Version | Purpose | Why Standard |
|---|---|---|---|
| Prisma Client | `^5.22.0` | Type-safe Database ORM Client | Official project ORM for model interactions |
| Express | `^5.2.1` | HTTP Route handler and API server | Official project web framework |
| tsx | `^4.21.0` | Run TypeScript files directly | Dev watcher and execution environment |

### Setup and Configuration Commands

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Apply migrations locally & update Prisma Client types:**
   ```bash
   $env:DATABASE_URL="postgresql://postgres:Satepad%40ng@localhost:6000/corporate_tv?schema=public"
   npx prisma migrate dev --name add_is_archived_to_employee_leave
   npx prisma generate
   ```
3. **Rebuild and restart the Docker environment (from project root):**
   ```bash
   docker compose up -d --build --remove-orphans
   ```

## Architecture Patterns

### Data Flow for Soft-Delete and Restore Operations

```mermaid
sequenceDiagram
    autonumber
    actor Admin as CMS Admin
    participant API as Express Router (/api/agenda/cuti)
    participant DB as Postgres (via Prisma)

    Admin->>API: DELETE /cuti/:id (Request Soft-Delete)
    API->>DB: prisma.employeeLeave.update({ where: { id }, data: { isArchived: true } })
    DB-->>API: Returns Updated Leave Record
    API-->>Admin: 200 OK (Status: success, msg: archived)

    Admin->>API: POST /cuti/:id/restore (Request Restore)
    API->>DB: prisma.employeeLeave.update({ where: { id }, data: { isArchived: false } })
    DB-->>API: Returns Restored Leave Record
    API-->>Admin: 200 OK (Status: success, msg: restored)
```

### Soft-Delete Fetch & Public Display Filter Flow

```mermaid
graph TD
    A[Request GET /api/display/agenda] --> B[Query DB via Prisma]
    B --> C{isArchived == false?}
    C -->|Yes| D[Keep active leaves]
    C -->|No| E[Discard archived leaves]
    D --> F[Run dateFilter: filterPassedLeaves]
    F --> G[Return JSON payload for TV Screen]
```

## Don't Hand-Roll

| Problem | Standard Alternative | Why Standard is Better |
|---|---|---|
| Hand-rolling schema migrations | Prisma Migrations (`prisma migrate dev`) | Ensures database consistency, tracking schema history in SQL files, and deterministic schema deployment on boot. |
| Custom raw SQL for soft-deletes | Prisma `update()` API | Prevents syntax errors, provides auto-complete support, and ensures type safety. |
| Custom query validation | Strict parameter checks on `req.query.filter` | Simple, clear conditional blocks to map values to Boolean filters instead of custom query builders. |

## Common Pitfalls

- **Pitfall 1: Unfiltered public display endpoint**
  - *Why:* Developers might assume that `filterPassedLeaves` handles archiving, but it only checks start/end date ranges.
  - *Avoid:* Explicitly add `where: { isArchived: false }` to the `prisma.employeeLeave.findMany` call inside the `GET /api/display/agenda` endpoint handler.
  - *Warning Signs:* Archived leaves showing up on the TV display.

- **Pitfall 2: Local Prisma migration failures**
  - *Why:* The database URL configured inside the Docker backend service points to `postgres:5432`. Running prisma tools locally from the host using this exact URL will fail because `postgres` host is not resolvable from the host system.
  - *Avoid:* Override the `DATABASE_URL` environment variable during host-level operations to use `localhost:6000` (which is mapped to the Postgres service).
  - *Warning Signs:* `Can't reach database server at 'postgres':'5432'` errors in the terminal.

- **Pitfall 3: Broken database connection due to URL password encoding**
  - *Why:* The database password is `Satepad@ng`. The `@` symbol disrupts standard URL parser libraries if not encoded.
  - *Avoid:* Always encode `@` as `%40` in the database connection URL (e.g. `Satepad%40ng`).

## Code Examples

### 1. Database Schema Update
Modified model `EmployeeLeave` in [schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma):
```prisma
model EmployeeLeave {
  id           String   @id @default(uuid())
  employeeName String
  dateRange    String
  monthText    String
  isArchived   Boolean  @default(false) // <--- Added field
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 2. Updating GET, DELETE, and Restore Routes
Modified logic inside [agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts):

```typescript
// GET all leaves with archiving filter
router.get("/cuti", async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;

    let whereClause: any = {};
    if (filter === "archived") {
      whereClause.isArchived = true;
    } else if (filter === "all") {
      // Return both active and archived; do not specify isArchived
    } else {
      // Default to "active"
      whereClause.isArchived = false;
    }

    const leaves = await prisma.employeeLeave.findMany({
      where: whereClause,
      orderBy: { employeeName: "asc" },
    });
    res.json(leaves);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve employee leaves", details: err.message });
  }
});

// DELETE a leave (soft-delete)
router.delete("/cuti/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leave = await prisma.employeeLeave.update({
      where: { id },
      data: { isArchived: true },
    });
    res.json({
      status: "success",
      message: "Employee leave record archived successfully",
      data: leave
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Employee leave record not found" });
      return;
    }
    res.status(500).json({ error: "Failed to archive employee leave", details: err.message });
  }
});

// RESTORE a leave (unarchive)
router.post("/cuti/:id/restore", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leave = await prisma.employeeLeave.update({
      where: { id },
      data: { isArchived: false },
    });
    res.json({
      status: "success",
      message: "Employee leave record restored successfully",
      data: leave
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Employee leave record not found" });
      return;
    }
    res.status(500).json({ error: "Failed to restore employee leave", details: err.message });
  }
});
```

### 3. Display Filtering
Modified logic inside [display.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/display.ts):

```typescript
router.get("/agenda", async (_req: Request, res: Response) => {
  try {
    const agendaEvents = await prisma.agendaEvent.findMany({
      orderBy: { date: "asc" },
    });

    // Modified to fetch only active (non-archived) employee leaves
    const cutiList = await prisma.employeeLeave.findMany({
      where: { isArchived: false },
      orderBy: { employeeName: "asc" },
    });

    // Fetch display settings for timezone
    const displaySettings = await prisma.displaySettings.findFirst();
    const timezone = displaySettings?.timezone || "Asia/Jakarta";
    const filteredCutiList = filterPassedLeaves(cutiList, undefined, timezone);

    // Group agenda events by dateText
    const groupedMap = new Map<string, { dateText: string; date: Date; events: any[] }>();
    for (const event of agendaEvents) {
      if (!groupedMap.has(event.dateText)) {
        groupedMap.set(event.dateText, {
          dateText: event.dateText,
          date: event.date,
          events: []
        });
      }
      groupedMap.get(event.dateText)!.events.push({
        id: event.id,
        title: event.title,
        timeText: event.timeText,
        location: event.location,
      });
    }

    const groupedAgenda = Array.from(groupedMap.values());

    // Get current slides URL and last sync info
    const slidesUrlSetting = await prisma.systemSetting.findUnique({
      where: { key: "agenda_slides_url" },
    });
    const lastSyncTimeSetting = await prisma.systemSetting.findUnique({
      where: { key: "agenda_last_sync_time" },
    });
    const lastSyncStatusSetting = await prisma.systemSetting.findUnique({
      where: { key: "agenda_last_sync_status" },
    });

    res.json({
      agenda: groupedAgenda,
      cuti: filteredCutiList,
      settings: {
        slidesUrl: slidesUrlSetting?.value || null,
        lastSyncTime: lastSyncTimeSetting?.value || null,
        lastSyncStatus: lastSyncStatusSetting?.value || null,
      },
    });
  } catch (err) {
    console.error("Error in /display/agenda route:", err);
    res.status(500).json({ error: "Failed to load agenda display data" });
  }
});
```

## Sources
- **Project Context files:** [06-CONTEXT.md](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/.planning/phases/06-backend-api-database-for-cuti-archiving/06-CONTEXT.md), [REQUIREMENTS.md](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/.planning/REQUIREMENTS.md), [ROADMAP.md](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/.planning/ROADMAP.md)
- **Local Database setup:** [schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma), [docker-compose.yml](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/docker-compose.yml)
- **Local Application routing:** [agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts), [display.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/display.ts)
- **Prisma Schema documentation & best practices**
- **Confidence breakdown:** 100% (All database parameters, existing architectures, routes, and Docker port forwards verified directly from the source repository).
