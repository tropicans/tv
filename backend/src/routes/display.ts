import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { getPrayerTimesForToday } from "../utils/prayerTimes";

const router = Router();

router.get("/data", async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const meetings = await prisma.meeting.findMany({
    where: {
      startTime: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0),
        lte: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999),
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Hitung jadwal otomatis berdasarkan koordinat
  const prayerTime = getPrayerTimesForToday();

  res.json({
    meetings,
    prayerTime,
  });
});

export default router;
