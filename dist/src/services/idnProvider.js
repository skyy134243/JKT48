// IDN Live Provider — Real Detection via Web Scraping & Proxy
// IDN Live has no public API, so we use multiple strategies:
// 1. Try community APIs (crstlnz, JKT48Connect-style)
// 2. Try checking IDN web profile pages for live indicators
// 3. Use a Vercel serverless proxy for CORS-free detection

import { PLATFORMS } from "../types/schemas.js";
import { IDN_SLUG_MAP } from "../data/members.js";

export class IdnProvider {
  constructor() {
    this.name = PLATFORMS.IDN;
    this.status = "HEALTHY";
    this.lastChecked = null;
    // Community APIs to try (in priority order)
    this.API_SOURCES = [
      "https://api.crstlnz.my.id/api/now_live",
    ];
  }

  /**
   * Fetch live status from IDN using available methods
   */
  async fetchLiveStatus(members) {
    this.lastChecked = new Date().toISOString();
    const liveResults = new Map();

    // Strategy 1: Try community API endpoints
    for (const apiUrl of this.API_SOURCES) {
      try {
        const result = await this._fetchFromCommunityApi(apiUrl, members);
        if (result.found > 0) {
          for (const [memberId, liveInfo] of result.liveMap) {
            liveResults.set(memberId, liveInfo);
          }
          this.status = "HEALTHY";
          console.log(`[IdnProvider] ✅ Community API found ${result.found} live member(s)`);
          return {
            success: true,
            sourceStatus: "HEALTHY",
            liveMap: liveResults
          };
        }
      } catch (err) {
        console.warn(`[IdnProvider] Community API ${apiUrl} failed:`, err.message);
      }
    }

    // Strategy 2: Try our own Vercel serverless proxy
    try {
      const proxyResult = await this._fetchFromProxy(members);
      if (proxyResult.success) {
        for (const [memberId, liveInfo] of proxyResult.liveMap) {
          liveResults.set(memberId, liveInfo);
        }
        this.status = "HEALTHY";
        console.log(`[IdnProvider] ✅ Proxy found ${liveResults.size} live member(s)`);
        return {
          success: true,
          sourceStatus: "HEALTHY",
          liveMap: liveResults
        };
      }
    } catch (err) {
      console.warn("[IdnProvider] Proxy check failed:", err.message);
    }

    // Strategy 3: Direct IDN page check (may hit CORS in browser, works in serverless)
    try {
      const directResult = await this._directIdnCheck(members);
      for (const [memberId, liveInfo] of directResult) {
        liveResults.set(memberId, liveInfo);
      }
    } catch (err) {
      console.warn("[IdnProvider] Direct check failed:", err.message);
    }

    if (liveResults.size > 0) {
      this.status = "HEALTHY";
    } else {
      // No live members found — this is normal (not an error)
      this.status = "HEALTHY";
    }

    console.log(`[IdnProvider] 🔍 Total IDN live: ${liveResults.size}`);

    return {
      success: true,
      sourceStatus: this.status === "HEALTHY" ? "HEALTHY" : "DEGRADED",
      liveMap: liveResults
    };
  }

  /**
   * Strategy 1: Fetch from community APIs like crstlnz
   * Expected format: [{ name, img, url, room_id, is_live, platform, ... }]
   */
  async _fetchFromCommunityApi(apiUrl, members) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "JKT48LiveRadar/1.0"
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const liveMap = new Map();
    let found = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        // Match by name or slug
        const matchedMember = this._findMemberMatch(item, members);
        if (matchedMember && (item.is_live || item.platform === "idn")) {
          liveMap.set(matchedMember.id, {
            isLive: true,
            liveId: String(item.room_id || item.live_id || `idn_${Date.now()}`),
            liveUrl: item.url || matchedMember.idnUrl,
            startedAt: item.started_at || new Date().toISOString(),
            platform: PLATFORMS.IDN,
            viewCount: item.view_count || item.viewers || 0,
            thumbnailUrl: item.img || item.image || null
          });
          found++;
        }
      }
    }

    return { liveMap, found };
  }

  /**
   * Strategy 2: Use our Vercel serverless proxy at /api/live/idn-check
   */
  async _fetchFromProxy(members) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/live/idn-check", {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return { success: false, liveMap: new Map() };
      }

      const data = await response.json();
      const liveMap = new Map();

      if (data && Array.isArray(data.lives)) {
        for (const live of data.lives) {
          if (live.memberId && live.isLive) {
            liveMap.set(live.memberId, {
              isLive: true,
              liveId: String(live.liveId || `idn_${Date.now()}`),
              liveUrl: live.liveUrl || "",
              startedAt: live.startedAt || new Date().toISOString(),
              platform: PLATFORMS.IDN,
              viewCount: live.viewCount || 0
            });
          }
        }
      }

      return { success: true, liveMap };
    } catch {
      return { success: false, liveMap: new Map() };
    }
  }

  /**
   * Strategy 3: Direct IDN web check (works in Node.js/serverless, may fail in browser due to CORS)
   * Checks if the member's IDN page has live indicators
   */
  async _directIdnCheck(members) {
    const liveMap = new Map();

    // Only check a small batch to avoid rate limiting
    const batch = members.filter(m => m.idnSlug).slice(0, 5);

    const checks = batch.map(async (member) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Check the IDN profile page for live status indicators
        const url = `https://www.idn.app/${member.idnSlug}`;
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept": "text/html",
            "User-Agent": "JKT48LiveRadar/1.0"
          }
        });
        clearTimeout(timeoutId);

        if (!resp.ok) return;

        const html = await resp.text();

        // Look for live indicators in the page HTML
        // Common patterns: "is_live":true, "live-badge", "LIVE NOW" etc.
        const isLive = html.includes('"is_live":true') ||
                       html.includes('"isLive":true') ||
                       html.includes('live-badge') ||
                       html.includes('"status":"live"');

        if (isLive) {
          liveMap.set(member.id, {
            isLive: true,
            liveId: `idn_${member.id}_${Date.now()}`,
            liveUrl: member.idnUrl,
            startedAt: new Date().toISOString(),
            platform: PLATFORMS.IDN,
            viewCount: 0
          });
        }
      } catch {
        // Skip individual failures
      }
    });

    await Promise.allSettled(checks);
    return liveMap;
  }

  /**
   * Match an API response item to a member from our database
   */
  _findMemberMatch(item, members) {
    // Try matching by name (case-insensitive)
    const itemName = (item.name || item.nickname || "").toLowerCase().trim();
    const itemSlug = (item.slug || item.url_key || "").toLowerCase().trim();

    for (const member of members) {
      const memberName = member.name.toLowerCase();
      const memberNick = member.nickname.toLowerCase();
      const memberSlug = (member.idnSlug || "").toLowerCase();

      if (itemName && (itemName.includes(memberNick) || memberName.includes(itemName))) {
        return member;
      }
      if (itemSlug && memberSlug && itemSlug.includes(memberSlug)) {
        return member;
      }
    }

    return null;
  }
}
