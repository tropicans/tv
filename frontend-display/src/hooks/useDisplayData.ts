import { useState, useEffect, useCallback } from "react";
import { DisplayData } from "../types";
import { fetchDisplayData } from "../api";

const POLL_INTERVAL = 30000;

export function useDisplayData() {
  const [data, setData] = useState<DisplayData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchDisplayData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return { data, error, refetch: load };
}
