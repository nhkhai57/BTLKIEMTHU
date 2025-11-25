const API_BASE = "http://localhost:3000/api";

// ===== GET =====
async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`);
  if (!res.ok) throw new Error("Lỗi khi GET " + endpoint);
  return await res.json();
}

// ===== POST =====
async function apiPost(endpoint, data) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  // Nếu backend trả lỗi 401 hoặc 500
  if (!res.ok) {
    let msg = "Lỗi server hoặc sai dữ liệu.";
    try {
      const errData = await res.json();
      msg = errData.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}

// ===== PUT =====
async function apiPut(endpoint, data) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Lỗi PUT " + endpoint);
  return await res.json();
}

// ===== DELETE =====
async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Lỗi DELETE " + endpoint);
  return await res.json();
}
