// Vercel Serverless: IDN Live Check Proxy
// This runs server-side so there are no CORS issues
// Checks IDN profiles for live status

import { JKT48_MEMBERS } from "../../src/data/members.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const lives = [];
  const errors = [];

  // Check all members in batches of 10
  const batchSize = 10;
  for (let i = 0; i < JKT48_MEMBERS.length; i += batchSize) {
    const batch = JKT48_MEMBERS.slice(i, i + batchSize);
    
    const results = await Promise.allSettled(
      batch.map(async (member) => {
        if (!member.idnSlug) return null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const url = `https://www.idn.app/@${member.idnSlug}`;
          const resp = await fetch(url, {
            signal: controller.signal,
            headers: {
              "Accept": "text/html,application/xhtml+xml",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          });
          clearTimeout(timeoutId);

          if (!resp.ok) return null;

          const html = await resp.text();

          // Check for live indicators in the rendered HTML
          const isLive = html.includes('"is_live":true') ||
                         html.includes('"isLive":true') ||
                         html.includes('live-badge') ||
                         html.includes('"status":"live"') ||
                         html.includes('"live_status":"live"');

          if (isLive) {
            return {
              memberId: member.id,
              nickname: member.nickname,
              isLive: true,
              liveId: `idn_${member.id}_${Date.now()}`,
              liveUrl: member.idnUrl,
              startedAt: new Date().toISOString(),
              viewCount: 0
            };
          }

          return null;
        } catch (err) {
          return null;
        }
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        lives.push(result.value);
      }
    }
  }

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    lives,
    totalChecked: JKT48_MEMBERS.length,
    totalLive: lives.length
  });
}
