// SHOWROOM Live Provider — Real API Integration
// Uses SHOWROOM public API to detect live JKT48 members
// Endpoint: https://www.showroom-live.com/api/live/onlives (all live rooms)
// Per-room: https://www.showroom-live.com/api/room/status?room_url_key=JKT48_XXX

import { PLATFORMS } from "../types/schemas.js";
import { SHOWROOM_SLUG_MAP } from "../data/members.js";

export class ShowroomProvider {
  constructor() {
    this.name = PLATFORMS.SHOWROOM;
    this.status = "HEALTHY";
    this.lastChecked = null;
    this.ONLIVES_URL = "https://www.showroom-live.com/api/live/onlives";
    this.ROOM_STATUS_URL = "https://www.showroom-live.com/api/room/status";
  }

  /**
   * Primary detection method: Fetch all currently live rooms from SHOWROOM
   * and filter for JKT48 members by matching room_url_key
   */
  async fetchLiveStatus(members) {
    this.lastChecked = new Date().toISOString();
    const liveResults = new Map();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(this.ONLIVES_URL, {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "JKT48LiveRadar/1.0"
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`SHOWROOM API returned ${response.status}`);
      }

      const data = await response.json();

      // The onlives API returns: { onlives: [{ genre_id, lives: [...] }, ...] }
      // Each live room has: room_url_key, live_id, started_at, streaming_url_list, view_num, etc.
      if (data && data.onlives && Array.isArray(data.onlives)) {
        for (const genre of data.onlives) {
          if (!genre.lives || !Array.isArray(genre.lives)) continue;

          for (const room of genre.lives) {
            const slug = room.room_url_key;

            // Check if this room belongs to a JKT48 member
            if (slug && SHOWROOM_SLUG_MAP.has(slug)) {
              const memberId = SHOWROOM_SLUG_MAP.get(slug);

              liveResults.set(memberId, {
                isLive: true,
                liveId: String(room.live_id || room.bcsvr_key || `sr_${Date.now()}`),
                liveUrl: `https://www.showroom-live.com/r/${slug}`,
                startedAt: room.started_at
                  ? new Date(room.started_at * 1000).toISOString()
                  : new Date().toISOString(),
                platform: PLATFORMS.SHOWROOM,
                viewCount: room.view_num || 0,
                roomName: room.main_name || "",
                thumbnailUrl: room.image || null,
                streamUrl: room.streaming_url_list?.[0]?.url || null
              });
            }
          }
        }
      }

      this.status = "HEALTHY";
      console.log(`[ShowroomProvider] ✅ Checked onlives — ${liveResults.size} JKT48 member(s) live`);

      return {
        success: true,
        sourceStatus: "HEALTHY",
        liveMap: liveResults
      };
    } catch (err) {
      console.warn("[ShowroomProvider] ❌ Fetch error:", err.message);

      // Fallback: Try checking individual rooms for key members
      if (err.name === "AbortError") {
        this.status = "TIMEOUT";
      } else {
        this.status = "DEGRADED";
      }

      // Attempt fallback: per-room status check for a subset of members
      try {
        await this._fallbackPerRoomCheck(members, liveResults);
        if (liveResults.size > 0) {
          console.log(`[ShowroomProvider] 🔄 Fallback found ${liveResults.size} live member(s)`);
          return {
            success: true,
            sourceStatus: "DEGRADED",
            liveMap: liveResults
          };
        }
      } catch (fallbackErr) {
        console.warn("[ShowroomProvider] Fallback also failed:", fallbackErr.message);
      }

      return {
        success: false,
        sourceStatus: "ERROR",
        error: err.message,
        liveMap: new Map()
      };
    }
  }

  /**
   * Fallback: Check individual room status for up to 10 members at a time
   * Uses: /api/room/status?room_url_key=JKT48_XXX
   * Response includes: is_live (boolean), live_id, started_at, room_name
   */
  async _fallbackPerRoomCheck(members, liveResults) {
    // Only check a batch of members to avoid rate limiting
    const batch = members.slice(0, 10);
    const checks = batch.map(async (member) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const url = `${this.ROOM_STATUS_URL}?room_url_key=${member.showroomSlug}`;
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "User-Agent": "JKT48LiveRadar/1.0"
          }
        });
        clearTimeout(timeoutId);

        if (!resp.ok) return;

        const roomData = await resp.json();
        if (roomData && roomData.is_live) {
          liveResults.set(member.id, {
            isLive: true,
            liveId: String(roomData.live_id || `sr_${Date.now()}`),
            liveUrl: member.showroomUrl,
            startedAt: roomData.started_at
              ? new Date(roomData.started_at * 1000).toISOString()
              : new Date().toISOString(),
            platform: PLATFORMS.SHOWROOM,
            viewCount: 0,
            roomName: roomData.room_name || member.nickname
          });
        }
      } catch {
        // Skip individual failures silently
      }
    });

    await Promise.allSettled(checks);
  }
}
