# Phase 6: Backend API & Database for Cuti Archiving - Patterns

## Files to Create/Modify

### 1. `backend/prisma/schema.prisma`
- **Role**: Database Schema Definition.
- **Proposed Data Flow**: 
  - Add the `isArchived` Boolean field (defaulting to `false`) to the `EmployeeLeave` model.
  - This field is updated to `true` upon soft-deletion, set back to `false` upon restoration, and used in queries to filter leaves.

### 2. `backend/src/routes/agenda.ts`
- **Role**: Express Router handling Employee Leave and Agenda Event admin CRUD API endpoints.
- **Proposed Data Flow**:
  - **`GET /cuti`**: Accept an optional query parameter `filter` (`active`, `archived`, or `all`). Retrieve leaves using a `where` condition mapped to this parameter. By default (or when `filter` is `active`), retrieve only non-archived leaves (`isArchived: false`).
  - **`DELETE /cuti/:id`**: Soft-delete a record by performing a Prisma update that sets `isArchived: true` instead of deleting the database row. Return the updated record details. Handle not found errors (`P2025`) with a `404` status code.
  - **`POST /cuti/:id/restore`**: Restore a soft-deleted record by setting `isArchived: false` via Prisma update. Return the updated record details. Handle not found errors (`P2025`) with a `404` status code.

### 3. `backend/src/routes/display.ts`
- **Role**: Express Router serving the public-facing display screens (`/api/display/*`).
- **Proposed Data Flow**:
  - **`GET /agenda`**: Modify the Prisma query fetching `EmployeeLeave` records to explicitly filter out archived leaves (`where: { isArchived: false }`). The returned array is then passed to `filterPassedLeaves` to filter out passed leaves based on the display timezone.

---

## Codebase Analogs

- **Boolean Flags/Defaults in Schema**:
  - *Analog*: [Announcement model in schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma#L11-L23) utilizes Boolean defaults (`isFeatured Boolean @default(false)`) and text defaults (`status String @default("draft")`).
- **Prisma Updates and CRUD in Routes**:
  - *Analog*: [agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts#L115-L146) implements `PUT /cuti/:id` and `DELETE /cuti/:id` which show standard parameters parsing, Prisma actions, error handling, and JSON response patterns.
- **Display Routes & Timezone-based Filtering**:
  - *Analog*: [display.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/display.ts#L62-L121) shows how `EmployeeLeave` records are fetched, display settings retrieved, and the `filterPassedLeaves` utility used.
- **Date Filter Utility**:
  - *Analog*: [dateFilter.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/utils/dateFilter.ts#L95-L120) exports `filterPassedLeaves` which determines if leaves should be kept based on current date and configured timezone.

---

## Code Excerpts

### 1. Existing Model Definition (for context)
From [backend/prisma/schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma#L80-L87):
```prisma
model EmployeeLeave {
  id           String   @id @default(uuid())
  employeeName String
  dateRange    String
  monthText    String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 2. Model Flags and Defaults
From [backend/prisma/schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma#L11-L23):
```prisma
model Announcement {
  id          String    @id @default(uuid())
  title       String
  description String?
  icon        String    @default("campaign")
  status      String    @default("draft") // draft, scheduled, live, expired
  isFeatured  Boolean   @default(false)
  // ...
}
```

### 3. Existing PUT & DELETE Cuti Endpoints
From [backend/src/routes/agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts#L115-L146):
```typescript
// UPDATE a leave
router.put("/cuti/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeName, dateRange, monthText } = req.body;

    const leave = await prisma.employeeLeave.update({
      where: { id },
      data: {
        employeeName,
        dateRange,
        monthText,
      },
    });
    res.json(leave);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update employee leave", details: err.message });
  }
});

// DELETE a leave
router.delete("/cuti/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.employeeLeave.delete({
      where: { id },
    });
    res.json({ status: "success", message: "Employee leave record deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete employee leave", details: err.message });
  }
});
```

### 4. Display Route Fetch & Date Filtering
From [backend/src/routes/display.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/display.ts#L68-L76):
```typescript
    const cutiList = await prisma.employeeLeave.findMany({
      orderBy: { employeeName: "asc" },
    });

    // Fetch display settings for timezone
    const displaySettings = await prisma.displaySettings.findFirst();
    const timezone = displaySettings?.timezone || "Asia/Jakarta";
    const filteredCutiList = filterPassedLeaves(cutiList, undefined, timezone);
```

---

## Pattern Integration Guidance

### 1. Database Schema Update
- Add `isArchived Boolean @default(false)` to the `EmployeeLeave` model in [schema.prisma](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/prisma/schema.prisma).
- Generate migrations locally on the host machine to target the forwarded PostgreSQL database port `6000` using:
  ```bash
  $env:DATABASE_URL="postgresql://postgres:Satepad%40ng@localhost:6000/corporate_tv?schema=public"
  npx prisma migrate dev --name add_is_archived_to_employee_leave
  npx prisma generate
  ```
- This ensures the migrations SQL structure is committed to the repo, and the database automatically executes `prisma migrate deploy` on next container startup.

### 2. Updating GET /api/agenda/cuti
- Modify the handler in [agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts) to read `req.query.filter`.
- Construct the `where` block dynamically:
  ```typescript
  const { filter } = req.query;
  const where: any = {};
  if (filter === "archived") {
    where.isArchived = true;
  } else if (filter === "all") {
    // No isArchived clause so both true & false are retrieved
  } else {
    // Default to "active"
    where.isArchived = false;
  }
  ```

### 3. Modifying DELETE /api/agenda/cuti/:id (Soft-Delete)
- Change the call from `prisma.employeeLeave.delete` to `prisma.employeeLeave.update`.
- Provide `{ isArchived: true }` in the update payload:
  ```typescript
  const leave = await prisma.employeeLeave.update({
    where: { id },
    data: { isArchived: true }
  });
  ```
- Catch and handle Prisma code `P2025` (Record to update not found) specifically to send a clear `404` status response.

### 4. Adding POST /api/agenda/cuti/:id/restore (Restore)
- Implement this new endpoint in [agenda.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/agenda.ts).
- Perform `prisma.employeeLeave.update` setting `{ isArchived: false }` for the target ID:
  ```typescript
  const leave = await prisma.employeeLeave.update({
    where: { id },
    data: { isArchived: false }
  });
  ```
- Catch and handle error code `P2025` to return a `404` status code.

### 5. Filtering Public Display Agenda
- In [display.ts](file:///C:/Users/yudhiar/Downloads/oprek/Dev/tv/backend/src/routes/display.ts), locate the `EmployeeLeave.findMany` call inside the `/agenda` router.
- Update the query with a strict condition:
  ```typescript
  const cutiList = await prisma.employeeLeave.findMany({
    where: { isArchived: false },
    orderBy: { employeeName: "asc" },
  });
  ```
- This ensures only active leave records are queried and then filtered by `filterPassedLeaves` based on date ranges, avoiding display of archived leaves on public screens.
