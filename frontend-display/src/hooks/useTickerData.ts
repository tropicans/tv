import { useState, useEffect, useCallback } from "react";
import { fetchTickerData } from "../api";

export interface TickerData {
  announcements: string;
  bmkg: string;
  bmkgAlert: boolean;
  traffic: string;
  news: string;
  finance: string;
}

export function useTickerData() {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchTickerData();
      setTickerData(data);
      setError(null);
    } catch (err) {
      console.error("useTickerData Hook Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60 * 1000); // 1 minute poll
    return () => clearInterval(interval);
  }, [load]);

  return { tickerData, loading, error, refetch: load };
}
