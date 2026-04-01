import { useState, useEffect } from "react";
import { fetchServerTime } from "../api";

export function useClock() {
  const [now, setNow] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    const syncTime = async () => {
      try {
        const data = await fetchServerTime();
        if (data.timestamp) {
          const serverTime = new Date(data.timestamp).getTime();
          const localTime = Date.now();
          setTimeOffset(serverTime - localTime);
          setNow(new Date(serverTime)); // set immediately to fix initial flash
        }
      } catch (err) {
        console.error("Failed to sync clock with server:", err);
      }
    };

    syncTime(); // initial run

    // periodic sync every hour
    const syncInterval = setInterval(syncTime, 60 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    // run the clock taking the offset into account
    const interval = setInterval(() => setNow(new Date(Date.now() + timeOffset)), 1000);
    return () => clearInterval(interval);
  }, [timeOffset]);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}`;

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return { time, dateStr, now };
}
