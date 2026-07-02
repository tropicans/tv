const API_BASE = process.env.REACT_APP_API_URL || "/api";

// Helper to get headers with Authorization token if available
function getHeaders(extraHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// 1. Authentication APIs
export async function loginWithEmail(email: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Email tidak terdaftar sebagai Admin");
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const res = await fetch(`${API_BASE}/auth/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Gagal login dengan akun Google");
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  }
  return data;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export async function fetchAuthConfig() {
  const res = await fetch(`${API_BASE}/auth/config`);
  if (!res.ok) throw new Error("Failed to fetch auth config");
  return res.json();
}


// 2. Display APIs (Public)
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

export async function fetchTickerData() {
  const res = await fetch(`${API_BASE}/display/ticker`);
  if (!res.ok) throw new Error("Failed to fetch ticker data");
  return res.json();
}

// Agenda Display API (Public)
export async function fetchAgendaDisplayData() {
  const res = await fetch(`${API_BASE}/display/agenda`);
  if (!res.ok) throw new Error("Failed to fetch agenda display data");
  return res.json();
}


// 3. CMS Scraper settings and trigger sync (Protected)
export async function fetchCmsSettings() {
  const res = await fetch(`${API_BASE}/agenda/settings`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateCmsSettings(slidesUrl: string) {
  const res = await fetch(`${API_BASE}/agenda/settings`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ slidesUrl }),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function triggerCmsSync() {
  const res = await fetch(`${API_BASE}/sync/agenda`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to trigger sync");
  return res.json();
}


// 4. Agenda CRUD APIs (Protected)
export async function fetchAgendaEvents() {
  const res = await fetch(`${API_BASE}/agenda`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch agenda events");
  return res.json();
}

export async function createAgendaEvent(data: any) {
  const res = await fetch(`${API_BASE}/agenda`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create agenda event");
  return res.json();
}

export async function updateAgendaEvent(id: string, data: any) {
  const res = await fetch(`${API_BASE}/agenda/${id}`, {
    method: "PUT",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update agenda event");
  return res.json();
}

export async function deleteAgendaEvent(id: string) {
  const res = await fetch(`${API_BASE}/agenda/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete agenda event");
  return res.json();
}


// 5. Employee Cuti CRUD APIs (Protected)
export async function fetchEmployeeLeaves() {
  const res = await fetch(`${API_BASE}/agenda/cuti`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch employee leaves");
  return res.json();
}

export async function createEmployeeLeave(data: any) {
  const res = await fetch(`${API_BASE}/agenda/cuti`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create employee leave");
  return res.json();
}

export async function updateEmployeeLeave(id: string, data: any) {
  const res = await fetch(`${API_BASE}/agenda/cuti/${id}`, {
    method: "PUT",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update employee leave");
  return res.json();
}

export async function deleteEmployeeLeave(id: string) {
  const res = await fetch(`${API_BASE}/agenda/cuti/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete employee leave");
  return res.json();
}
