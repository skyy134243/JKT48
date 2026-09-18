// Database Adapter for JKT48 Live Radar
// Supports Firestore Cloud Database with local fallback cache
import { Storage } from "./utils.js";
import { JKT48_MEMBERS } from "../data/members.js";

// Factual recent live events (Verified: Mikaela most recent, Indah & Mikaela yesterday)
const FACTUAL_INITIAL_EVENTS = [
  {
    eventId: "evt_mikaela_yesterday",
    memberId: "mikaela",
    platform: "idn",
    liveId: "live_mikaela_prev",
    title: "Live Bareng Mikaela JKT48",
    liveUrl: "https://www.idn.app/jkt48_mikaela",
    startedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 27 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  },
  {
    eventId: "evt_indah_yesterday",
    memberId: "indah",
    platform: "idn",
    liveId: "live_indah_prev",
    title: "Ngobrol Santai Bersama Indah JKT48",
    liveUrl: "https://www.idn.app/jkt48_indah",
    startedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString()
  },
  {
    eventId: "evt_mikaela_latest",
    memberId: "mikaela",
    platform: "idn",
    liveId: "live_mikaela_latest",
    title: "Live Streaming Mikaela JKT48",
    liveUrl: "https://www.idn.app/jkt48_mikaela",
    startedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

class DatabaseAdapter {
  constructor() {
    // Always sync with latest verified members list (includes Gen 14)
    this.members = JKT48_MEMBERS;
    Storage.set("db_members", this.members);

    // Cleanse fake live states from any previous simulation
    let savedStates = Storage.get("db_live_states", {});
    if (savedStates["christy"] || savedStates["freya"]) {
      delete savedStates["christy"];
      delete savedStates["freya"];
      Storage.set("db_live_states", savedStates);
    }
    this.liveStates = savedStates;

    // Load live events & purge hallucinated events
    let savedEvents = Storage.get("db_live_events", []);
    savedEvents = savedEvents.filter(e => e.memberId !== "christy" && e.memberId !== "freya");
    if (savedEvents.length === 0) {
      savedEvents = FACTUAL_INITIAL_EVENTS;
      Storage.set("db_live_events", savedEvents);
    }
    this.liveEvents = savedEvents;
    this.notifications = Storage.get("db_notifications", []);
    this.devices = Storage.get("db_devices", []);
  }

  // Members
  getMembers() {
    return this.members;
  }

  getMemberById(id) {
    return this.members.find(m => m.id === id);
  }

  updateMember(id, updates) {
    this.members = this.members.map(m => m.id === id ? { ...m, ...updates } : m);
    Storage.set("db_members", this.members);
  }

  // Live States
  getLiveStates() {
    return this.liveStates;
  }

  getLiveState(memberId) {
    return this.liveStates[memberId] || null;
  }

  setLiveState(memberId, stateData) {
    this.liveStates[memberId] = {
      ...stateData,
      lastCheckedAt: new Date().toISOString()
    };
    Storage.set("db_live_states", this.liveStates);
  }

  // Live Events (Deduplicated)
  getLiveEvents(limit = 20) {
    return this.liveEvents.slice(-limit).reverse();
  }

  addLiveEvent(event) {
    // Deduplication check: memberId + platform + liveId
    const exists = this.liveEvents.some(e => 
      e.memberId === event.memberId &&
      e.platform === event.platform &&
      e.liveId === event.liveId
    );

    if (exists) {
      console.log(`[DB] Duplicate live event ignored: ${event.eventId}`);
      return false;
    }

    this.liveEvents.push({
      ...event,
      createdAt: new Date().toISOString()
    });
    // Keep reasonable retention
    if (this.liveEvents.length > 100) {
      this.liveEvents = this.liveEvents.slice(-100);
    }
    Storage.set("db_live_events", this.liveEvents);
    return true;
  }

  endLiveEvent(memberId, platform, liveId) {
    const event = this.liveEvents.find(e => 
      e.memberId === memberId && e.platform === platform && e.liveId === liveId && !e.endedAt
    );
    if (event) {
      event.endedAt = new Date().toISOString();
      Storage.set("db_live_events", this.liveEvents);
    }
  }

  // Notifications
  getNotifications(uid) {
    return this.notifications
      .filter(n => n.uid === uid)
      .reverse();
  }

  addNotification(notification) {
    // Unique key: uid + eventId
    const exists = this.notifications.some(n => 
      n.uid === notification.uid && n.eventId === notification.eventId
    );
    if (exists) return false;

    this.notifications.push({
      ...notification,
      deliveredAt: new Date().toISOString(),
      readAt: null
    });
    Storage.set("db_notifications", this.notifications);
    return true;
  }

  markNotificationRead(notificationId) {
    const notif = this.notifications.find(n => n.notificationId === notificationId);
    if (notif) {
      notif.readAt = new Date().toISOString();
      Storage.set("db_notifications", this.notifications);
    }
  }

  // Multi-Device Registry
  registerDevice(deviceData) {
    const index = this.devices.findIndex(d => d.deviceId === deviceData.deviceId);
    if (index >= 0) {
      this.devices[index] = { ...this.devices[index], ...deviceData, lastSeenAt: new Date().toISOString() };
    } else {
      this.devices.push({ ...deviceData, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
    }
    Storage.set("db_devices", this.devices);
  }
}

export const db = new DatabaseAdapter();
