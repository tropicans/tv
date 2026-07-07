import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { getPrayerTimesForToday } from "../utils/prayerTimes";
import { filterPassedLeaves } from "../utils/dateFilter";

const router = Router();

router.get("/data", async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rawMeetings = await prisma.meeting.findMany({
    where: {
      startTime: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0),
        lte: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999),
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Gabungkan jadwal rapat yang sama persis (kegiatan & waktu sama) tapi meminjam banyak ruangan
  const groupedMap = new Map();
  
  for (const m of rawMeetings) {
    // Cek apakah endTime null
    const endStr = m.endTime ? m.endTime.toISOString() : "";
    const key = `${m.title}-${m.startTime.toISOString()}-${endStr}`;
    
    if (groupedMap.has(key)) {
      const existing = groupedMap.get(key);
      if (!existing.location.includes(m.location)) {
        existing.location = `${existing.location}, ${m.location}`;
      }
    } else {
      groupedMap.set(key, { ...m });
    }
  }

  const meetings = Array.from(groupedMap.values());

  // Hitung jadwal otomatis berdasarkan koordinat
  const prayerTime = getPrayerTimesForToday();

  res.json({
    meetings,
    prayerTime,
  });
});

router.get("/ticker", async (_req: Request, res: Response) => {
  try {
    const { getTickerData } = require("../services/ticker");
    const tickerData = await getTickerData();
    res.json(tickerData);
  } catch (err) {
    console.error("Error in /ticker route:", err);
    res.status(500).json({ error: "Failed to load ticker data" });
  }
});

router.get("/agenda", async (_req: Request, res: Response) => {
  try {
    const agendaEvents = await prisma.agendaEvent.findMany({
      orderBy: { date: "asc" },
    });

    const cutiList = await prisma.employeeLeave.findMany({
      where: { isArchived: false },
      orderBy: { employeeName: "asc" },
    });

    // Fetch display settings for timezone
    const displaySettings = await prisma.displaySettings.findFirst();
    const timezone = displaySettings?.timezone || "Asia/Jakarta";
    const filteredCutiList = filterPassedLeaves(cutiList, undefined, timezone);

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

export default router;
