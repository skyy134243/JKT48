// Radar Check Engine for GitHub Actions & Serverless
// Checks IDN Live and SHOWROOM for all 57 active JKT48 members
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Read members_data.js
const membersDataRaw = fs.readFileSync(path.join(rootDir, 'assets', 'members_data.js'), 'utf8');

// Parse member objects using regex
const memberRegex = /id:\s*"([^"]+)",[\s\S]*?name:\s*"([^"]+)",[\s\S]*?nickname:\s*"([^"]+)",[\s\S]*?generation:\s*(\d+),[\s\S]*?teamStatus:\s*"([^"]+)",[\s\S]*?showroomSlug:\s*"([^"]+)",[\s\S]*?showroomUrl:\s*"([^"]+)",[\s\S]*?idnSlug:\s*"([^"]+)",[\s\S]*?idnUrl:\s*"([^"]+)",[\s\S]*?photoUrl:\s*"([^"]+)"/g;

const members = [];
let match;
while ((match = memberRegex.exec(membersDataRaw)) !== null) {
  members.push({
    id: match[1],
    name: match[2],
    nickname: match[3],
    generation: parseInt(match[4]),
    teamStatus: match[5],
    showroomSlug: match[6],
    showroomUrl: match[7],
    idnSlug: match[8],
    idnUrl: match[9],
    photoUrl: match[10]
  });
}

console.log(`[RadarCheck] Scanning live status for ${members.length} members...`);

async function checkShowroom() {
  const lives = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch('https://www.showroom-live.com/api/live/onlives', {
      signal: controller.signal,
      headers: { 'User-Agent': 'JKT48LiveRadar/2.0' }
    });
    clearTimeout(timeout);
    if (!resp.ok) return lives;

    const data = await resp.json();
    if (data && data.onlives && Array.isArray(data.onlives)) {
      for (const genre of data.onlives) {
        if (!genre.lives) continue;
        for (const room of genre.lives) {
          const roomKey = room.room_url_key;
          const member = members.find(m => m.showroomSlug.toLowerCase() === roomKey?.toLowerCase());
          if (member) {
            lives.push({
              memberId: member.id,
              name: member.name,
              nickname: member.nickname,
              generation: member.generation,
              platform: 'SHOWROOM',
              platformKey: 'showroom',
              title: room.main_name || `SHOWROOM - ${member.name}`,
              liveUrl: member.showroomUrl,
              startedAt: room.started_at ? new Date(room.started_at * 1000).toISOString() : new Date().toISOString(),
              photoUrl: member.photoUrl
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[RadarCheck] SHOWROOM check warning:', err.message);
  }
  return lives;
}

async function checkIdnMember(member) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://www.idn.app/${member.idnSlug}`;
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    clearTimeout(timeout);
    if (!resp.ok) return null;

    const html = await resp.text();
    const isLive = html.includes('"is_live":true') ||
                   html.includes('"isLive":true') ||
                   html.includes('live-badge') ||
                   html.includes('"status":"live"') ||
                   html.includes('"live_status":"live"') ||
                   html.includes('SEDANG LIVE') ||
                   html.includes('livestream-card');

    if (isLive) {
      return {
        memberId: member.id,
        name: member.name,
        nickname: member.nickname,
        generation: member.generation,
        platform: 'IDN Live',
        platformKey: 'idn',
        title: `IDN Live - ${member.name} (${member.nickname})`,
        liveUrl: member.idnUrl,
        startedAt: new Date().toISOString(),
        photoUrl: member.photoUrl
      };
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function main() {
  const showroomLives = await checkShowroom();
  console.log(`[RadarCheck] SHOWROOM live found: ${showroomLives.length}`);

  // Check IDN in parallel batches
  const idnLives = [];
  const batchSize = 10;
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(m => checkIdnMember(m)));
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        idnLives.push(r.value);
      }
    }
  }
  console.log(`[RadarCheck] IDN Live found: ${idnLives.length}`);

  const allLives = [...showroomLives, ...idnLives];

  const output = {
    last_updated: new Date().toISOString(),
    total_live: allLives.length,
    live_sessions: allLives
  };

  const outPath = path.join(rootDir, 'live_data.json');
  const distOutPath = path.join(rootDir, 'dist', 'live_data.json');

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.writeFileSync(distOutPath, JSON.stringify(output, null, 2), 'utf8');
  }

  console.log(`[RadarCheck] Successfully updated live_data.json with ${allLives.length} active stream(s).`);
}

main();