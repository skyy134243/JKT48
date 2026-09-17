// Schemas and Constants for JKT48 Live Radar

export const PLATFORMS = {
  IDN: "idn",
  SHOWROOM: "showroom"
};

export const LIVE_STATUS = {
  OFFLINE: "OFFLINE",
  LIVE_DETECTED: "LIVE_DETECTED",
  LIVE: "LIVE",
  OFFLINE_DETECTED: "OFFLINE_DETECTED",
  UNKNOWN: "UNKNOWN"
};

export const OSHI_PRIORITY = {
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
  OFF: 0
};

export const DEFAULT_USER_PREFERENCES = {
  favoriteMembers: [],      // array of memberIds
  priorityMembers: {},      // map: { [memberId]: 1 | 2 | 3 }
  notifyAllMembers: false,  // true = notify for any member live
  notifyIDN: true,          // receive IDN notifications
  notifySHOWROOM: true,     // receive SHOWROOM notifications
  quietHours: {
    enabled: false,
    start: "23:00",
    end: "06:00",
    allowHighPriority: true
  },
  theme: "system"           // "light" | "dark" | "system"
};
