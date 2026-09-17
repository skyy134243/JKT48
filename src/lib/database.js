// Database Adapter for JKT48 Live Radar
// Supports Firestore Cloud Database with local fallback cache
import { Storage } from "./utils.js";
import { JKT48_MEMBERS } from "../data/members.js";

class DatabaseAdapter {
  constructor() {
    // Always sync with latest verified members list (includes Gen 14)
    this.members = JKT48_MEMBERS;
    Storage.set("db_members", this.members);
    this.liveStates = Storage.get("db_live_states", {});
    this.liveEvents = Storage.get("db_live_events", []);
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
