import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// ==================== AGENDA EVENT CRUD ====================

// GET all agenda events
router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await prisma.agendaEvent.findMany({
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve agenda events", details: err.message });
  }
});

// CREATE a new agenda event
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, timeText, location, dateText, date } = req.body;
    if (!title || !dateText || !date) {
      res.status(400).json({ error: "Title, dateText, and date are required" });
      return;
    }

    const event = await prisma.agendaEvent.create({
      data: {
        title,
        timeText: timeText || "",
        location: location || "",
        dateText,
        date: new Date(date),
      },
    });
    res.status(201).json(event);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create agenda event", details: err.message });
  }
});

// UPDATE an agenda event
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, timeText, location, dateText, date } = req.body;

    const event = await prisma.agendaEvent.update({
      where: { id },
      data: {
        title,
        timeText,
        location,
        dateText,
        date: date ? new Date(date) : undefined,
      },
    });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update agenda event", details: err.message });
  }
});

// DELETE an agenda event
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.agendaEvent.delete({
      where: { id },
    });
    res.json({ status: "success", message: "Event deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete agenda event", details: err.message });
  }
});

// ==================== EMPLOYEE LEAVE CRUD ====================

// GET all leaves
router.get("/cuti", async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;
    let where: any = {};

    if (filter === "archived") {
      where.isArchived = true;
    } else if (filter === "all") {
      // do not filter by isArchived
    } else {
      // Default: active (isArchived = false)
      where.isArchived = false;
    }

    const leaves = await prisma.employeeLeave.findMany({
      where,
      orderBy: { employeeName: "asc" },
    });
    res.json(leaves);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve employee leaves", details: err.message });
  }
});

// CREATE a new leave
router.post("/cuti", async (req: Request, res: Response) => {
  try {
    const { employeeName, dateRange, monthText } = req.body;
    if (!employeeName || !dateRange) {
      res.status(400).json({ error: "Employee name and date range are required" });
      return;
    }

    const leave = await prisma.employeeLeave.create({
      data: {
        employeeName,
        dateRange,
        monthText: monthText || "Juli 2026",
      },
    });
    res.status(201).json(leave);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create employee leave", details: err.message });
  }
});

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
    if (err.code === "P2025") {
      res.status(404).json({ error: "Employee leave record not found" });
    } else {
      res.status(500).json({ error: "Failed to update employee leave", details: err.message });
    }
  }
});

// DELETE a leave (soft-delete)
router.delete("/cuti/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.employeeLeave.update({
      where: { id },
      data: { isArchived: true },
    });
    res.json({ status: "success", message: "Employee leave record archived successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Employee leave record not found" });
    } else {
      res.status(500).json({ error: "Failed to delete employee leave", details: err.message });
    }
  }
});

// RESTORE a soft-deleted leave
router.post("/cuti/:id/restore", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leave = await prisma.employeeLeave.update({
      where: { id },
      data: { isArchived: false },
    });
    res.json(leave);
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Employee leave record not found" });
    } else {
      res.status(500).json({ error: "Failed to restore employee leave", details: err.message });
    }
  }
});

// ==================== SETTINGS MANAGEMENT ====================

// GET all settings
router.get("/settings", async (req: Request, res: Response) => {
  try {
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
      slidesUrl: slidesUrlSetting?.value || "",
      lastSyncTime: lastSyncTimeSetting?.value || null,
      lastSyncStatus: lastSyncStatusSetting?.value || null,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve settings", details: err.message });
  }
});

// UPDATE slides URL setting
router.post("/settings", async (req: Request, res: Response) => {
  try {
    const { slidesUrl } = req.body;
    if (!slidesUrl) {
      res.status(400).json({ error: "slidesUrl is required" });
      return;
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key: "agenda_slides_url" },
      update: { value: slidesUrl },
      create: { key: "agenda_slides_url", value: slidesUrl },
    });

    res.json({ status: "success", setting });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update slides URL setting", details: err.message });
  }
});

export default router;
