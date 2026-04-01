import PrayTimes from "praytimes";

// Initialize with Muslim World League method (sesuai Indonesia)
const prayTimes = new PrayTimes("MWL");

// Koordinat Cilandak Barat, Jakarta Selatan
const LOCATION = {
  latitude: -6.3,
  longitude: 106.8,
  timezone: 7, // WIB
};

export function getPrayerTimesForToday(): {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  city: string;
} {
  const today = new Date();
  const times = prayTimes.getTimes(today, [LOCATION.latitude, LOCATION.longitude], LOCATION.timezone);

  // Format: HH:MM (24 jam)
  const formatTime = (time: string): string => {
    const parts = time.split(":");
    const h = parts[0] ? parts[0].padStart(2, "0") : "00";
    const m = parts[1] ? parts[1].padStart(2, "0") : "00";
    return `${h}:${m}`;
  };

  return {
    subuh: formatTime(times.fajr),
    dzuhur: formatTime(times.dhuhr),
    ashar: formatTime(times.asr),
    maghrib: formatTime(times.maghrib),
    isya: formatTime(times.isha),
    city: "Cilandak Barat, Jakarta Selatan",
  };
}