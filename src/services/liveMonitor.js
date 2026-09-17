// Live Monitoring Engine & State Machine
import { LIVE_STATUS, PLATFORMS } from "../types/schemas.js";
import { db } from "../lib/database.js";
import { createEventKey } from "../lib/utils.js";
import { IdnProvider } from "./idnProvider.js";
import { ShowroomProvider } from "./showroomProvider.js";
import { routeLiveNotification } from "./notificationRouter.js";

export class LiveMonitorEngine {
  constructor() {
    this.idnProvider = new IdnProvider();
    this.showroomProvider = new ShowroomProvider();
    this.isChecking = false;
    this.listeners = [];
  }

  onUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyUpdate() {
    this.listeners.forEach(cb => cb());
  }

  getSystemHealth() {
    return {
      monitor: this.isChecking ? "RUNNING" : "HEALTHY",
      database: "HEALTHY",
      notification: "HEALTHY",
      idnStatus: this.idnProvider.status,
      idnLastChecked: this.idnProvider.lastChecked,
      showroomStatus: this.showroomProvider.status,
      showroomLastChecked: this.showroomProvider.lastChecked
    };
  }

  // Core execution step
  async executeCycle(customFeed = null) {
    if (this.isChecking) return;
    this.isChecking = true;

    try {
      const members = db.getMembers().filter(m => m.status === "active");

      // Check IDN and SHOWROOM
      const [idnResult, showroomResult] = customFeed ? [
        customFeed.idn || { success: true, liveMap: new Map() },
        customFeed.showroom || { success: true, liveMap: new Map() }
      ] : await Promise.all([
        this.idnProvider.fetchLiveStatus(members),
        this.showroomProvider.fetchLiveStatus(members)
      ]);

      const now = new Date().toISOString();

      // Process each member
      for (const member of members) {
        const prevState = db.getLiveState(member.id) || {
          memberId: member.id,
          status: LIVE_STATUS.OFFLINE,
          platform: null,
          liveId: null,
          liveUrl: null,
          startedAt: null
        };

        // Determine current status from providers
        let detectedPlatform = null;
        let detectedLiveInfo = null;

        if (idnResult.liveMap && idnResult.liveMap.has(member.id)) {
          detectedPlatform = PLATFORMS.IDN;
          detectedLiveInfo = idnResult.liveMap.get(member.id);
        } else if (showroomResult.liveMap && showroomResult.liveMap.has(member.id)) {
          detectedPlatform = PLATFORMS.SHOWROOM;
          detectedLiveInfo = showroomResult.liveMap.get(member.id);
        }

        const isCurrentlyLive = !!detectedLiveInfo;

        // Reliability Rule: If provider errored, don't drop to offline!
        if (!isCurrentlyLive) {
          const idnFailed = !idnResult.success && prevState.platform === PLATFORMS.IDN;
          const showroomFailed = !showroomResult.success && prevState.platform === PLATFORMS.SHOWROOM;

          if (prevState.status === LIVE_STATUS.LIVE && (idnFailed || showroomFailed)) {
            // Keep status or mark UNKNOWN, do NOT set OFFLINE
            db.setLiveState(member.id, {
              ...prevState,
              status: LIVE_STATUS.UNKNOWN,
              lastCheckedAt: now
            });
            continue;
          }
        }

        // State Machine Transition
        if (prevState.status === LIVE_STATUS.OFFLINE || prevState.status === LIVE_STATUS.UNKNOWN) {
          if (isCurrentlyLive) {
            // OFFLINE -> LIVE (Create Live Event & Dispatch Notifications)
            const liveId = detectedLiveInfo.liveId || ("live_" + Date.now());
            const liveUrl = detectedLiveInfo.liveUrl || (detectedPlatform === PLATFORMS.IDN ? member.idnUrl : member.showroomUrl);
            const startedAt = detectedLiveInfo.startedAt || now;
            const eventId = createEventKey(member.id, detectedPlatform, liveId);

            const newEvent = {
              eventId,
              memberId: member.id,
              platform: detectedPlatform,
              liveId,
              liveUrl,
              startedAt,
              endedAt: null
            };

            const eventCreated = db.addLiveEvent(newEvent);
            
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: detectedPlatform,
              status: LIVE_STATUS.LIVE,
              liveId,
              liveUrl,
              startedAt
            });

            if (eventCreated) {
              // Trigger notification dispatch
              routeLiveNotification(member, newEvent);
            }
          } else {
            // OFFLINE -> OFFLINE
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: null,
              status: LIVE_STATUS.OFFLINE,
              liveId: null,
              liveUrl: null,
              startedAt: null
            });
          }
        } else if (prevState.status === LIVE_STATUS.LIVE) {
          if (!isCurrentlyLive) {
            // LIVE -> OFFLINE (End live session)
            db.endLiveEvent(member.id, prevState.platform, prevState.liveId);
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: null,
              status: LIVE_STATUS.OFFLINE,
              liveId: null,
              liveUrl: null,
              startedAt: null
            });
          } else {
            // LIVE -> LIVE (Already live, update heartbeats, DO NOT recreate event)
            db.setLiveState(member.id, {
              ...prevState,
              lastCheckedAt: now
            });
          }
        }
      }

      this.notifyUpdate();
    } finally {
      this.isChecking = false;
    }
  }

  // Simulation Helper for Testing / Demo Live Transitions
  simulateLive(memberId, platform = PLATFORMS.IDN) {
    const member = db.getMemberById(memberId);
    if (!member) return;

    const liveId = "sim_" + Math.floor(Math.random() * 90000 + 10000);
    const liveUrl = platform === PLATFORMS.IDN ? member.idnUrl : member.showroomUrl;
    
    const liveMap = new Map();
    liveMap.set(memberId, {
      liveId,
      liveUrl,
      startedAt: new Date().toISOString()
    });

    const feed = {
      idn: platform === PLATFORMS.IDN ? { success: true, liveMap } : { success: true, liveMap: new Map() },
      showroom: platform === PLATFORMS.SHOWROOM ? { success: true, liveMap } : { success: true, liveMap: new Map() }
    };

    return this.executeCycle(feed);
  }

  simulateEndLive(memberId) {
    const feed = {
      idn: { success: true, liveMap: new Map() },
      showroom: { success: true, liveMap: new Map() }
    };
    return this.executeCycle(feed);
  }
}

export const liveMonitor = new LiveMonitorEngine();
