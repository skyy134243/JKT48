// Utility Functions for JKT48 Live Radar

export function formatTime(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return "";
  const date = new Date(isoStringOrTimestamp);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export function formatDateLabel(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return "";
  const date = new Date(isoStringOrTimestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) return "Hari ini";
  if (isYesterday) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function createEventKey(memberId, platform, liveId) {
  return `${memberId}-${platform}-${liveId}`;
}

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const Storage = {
  get(key, fallback = null) {
    try {
      if (typeof localStorage === "undefined") return fallback;
      const val = localStorage.getItem(`jkt48_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(`jkt48_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  },
  remove(key) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem(`jkt48_${key}`);
    } catch {}
  }
};

export const Session = {
  get(key, fallback = null) {
    try {
      if (typeof sessionStorage === "undefined") return fallback;
      const val = sessionStorage.getItem(`jkt48_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      if (typeof sessionStorage === "undefined") return;
      sessionStorage.setItem(`jkt48_${key}`, JSON.stringify(val));
    } catch {}
  },
  remove(key) {
    try {
      if (typeof sessionStorage === "undefined") return;
      sessionStorage.removeItem(`jkt48_${key}`);
    } catch {}
  }
};


