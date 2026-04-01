const API_BASE = process.env.REACT_APP_API_URL || "/api";

export async function fetchDisplayData() {
  const res = await fetch(`${API_BASE}/display/data`);
  if (!res.ok) throw new Error("Failed to fetch display data");
  return res.json();
}

export async function fetchServerTime() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Failed to fetch server time");
  return res.json();
}
