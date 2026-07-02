import React, { useMemo } from "react";
import { PrayerTime } from "../types";

interface Props {
  prayerTime: PrayerTime | null;
}

const PRAYER_LABELS = [
  { key: "subuh", label: "Subuh" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" },
] as const;

const PrayerTimes: React.FC<Props> = ({ prayerTime }) => {
  const upcomingPrayer = useMemo(() => {
    if (!prayerTime) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const times = PRAYER_LABELS.map((p) => {
      const val = prayerTime[p.key as keyof PrayerTime] as string;
      const [h, m] = val.split(":").map(Number);
      return { ...p, minutes: h * 60 + m };
    });

    // Cari waktu berikutnya (yang akan datang)
    for (let i = 0; i < times.length; i++) {
      if (currentMinutes < times[i].minutes) {
        return times[i].key;
      }
    }

    // Kalau sudah lewat semua, berarti Subuh besok (ambil yang pertama)
    return times[0].key;
  }, [prayerTime]);

  if (!prayerTime) return null;

  return (
    <section className="col-span-5 row-span-1 bg-white/60 backdrop-blur-xl rounded-[1.5rem] px-6 py-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border border-white/40 h-auto md:h-full overflow-hidden">
      <div className="flex flex-col items-center gap-1 md:items-start border-b pb-3 md:border-r md:pb-0 md:pr-4 md:border-b-0 border-outline-variant/30 shrink-0 justify-center w-full md:w-auto">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-xl">mosque</span>
          <span className="font-label text-[11px] font-black text-on-surface uppercase tracking-[0.10em]">Waktu Shalat</span>
        </div>
        <span className="text-[10px] text-outline font-bold tracking-widest">CILANDAK (UTC+7)</span>
      </div>
      
      <div className="flex-grow flex flex-wrap justify-center sm:justify-around gap-2 sm:gap-4 md:gap-2 items-center px-2 w-full md:w-auto">
        {PRAYER_LABELS.map((p) => {
          const isUpcoming = upcomingPrayer === p.key;
          return (
            <div
              key={p.key}
              className={`flex flex-col items-center transition-all duration-300 ${
                isUpcoming
                  ? "bg-primary-fixed/30 px-3 py-2 rounded-xl scale-105"
                  : ""
              }`}
            >
              <span
                className={`font-label text-[9px] font-black uppercase mb-1 ${
                  isUpcoming ? "text-primary drop-shadow-sm" : "text-outline"
                }`}
              >
                {p.label}
              </span>
              <span
                className={`font-headline font-extrabold ${
                  isUpcoming ? "text-xl text-primary drop-shadow-sm" : "text-base text-on-surface"
                }`}
              >
                {prayerTime[p.key as keyof PrayerTime] as string}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PrayerTimes;
