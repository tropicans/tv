import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { getPrayerTimesForToday } from "../utils/prayerTimes";

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

export default router;
