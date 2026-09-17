// Home Dashboard View — Priority #1 View
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { LIVE_STATUS } from "../types/schemas.js";
import { renderLiveCard } from "../components/LiveCard.js";
import { escapeHtml, formatTime } from "../lib/utils.js";

export function renderHomeView() {
  const user = auth.getUser();
  const prefs = auth.getPreferences();
  const members = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];

  // Determine greeting based on current hour
  const hour = new Date().getHours();
  let greeting = "Selamat malam";
  if (hour >= 5 && hour < 11) greeting = "Selamat pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat sore";

  const firstName = user ? user.displayName.split(" ")[0] : "Wota";

  // Find all live members
  const liveItems = [];
  members.forEach(member => {
    const state = liveStates[member.id];
    if (state && state.status === LIVE_STATUS.LIVE) {
      const isOshi = favoriteMembers.includes(member.id);
      liveItems.push({
        member,
        platform: state.platform,
        liveUrl: state.liveUrl || (state.platform === "idn" ? member.idnUrl : member.showroomUrl),
        startedAt: state.startedAt,
        isOshi
      });
    }
  });

  // Sort live items: Oshis first, then by startedAt descending
  liveItems.sort((a, b) => {
    if (a.isOshi && !b.isOshi) return -1;
    if (!a.isOshi && b.isOshi) return 1;
    return new Date(b.startedAt || 0) - new Date(a.startedAt || 0);
  });

  // User's Oshi List
  const userOshis = favoriteMembers
    .map(id => members.find(m => m.id === id))
    .filter(Boolean);

  // Recent Live Sessions (from db events)
  const recentEvents = db.getLiveEvents(5);

  return `
    <div class="page-view">
      <!-- Greeting Banner -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main); letter-spacing: -0.02em;">
          ${greeting}, ${escapeHtml(firstName)}!
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Radar aktif memantau IDN Live & SHOWROOM.
        </p>
      </div>

      <!-- Section 1 — LIVE SEKARANG -->
      <section style="margin-bottom: 32px;">
        <div class="section-title">
          <span class="pulse-dot"></span>
          <span>LIVE SEKARANG</span>
          ${liveItems.length > 0 ? `
            <span style="font-size: 0.82rem; font-weight: 600; color: var(--primary-red); margin-left: auto;">
              ${liveItems.length} Member Online
            </span>
          ` : ""}
        </div>

        ${liveItems.length > 0 ? `
          <div class="live-grid">
            ${liveItems.map(item => renderLiveCard(item, item.isOshi)).join("")}
          </div>
        ` : `
          <div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h4 class="empty-state-title">Belum ada member yang live.</h4>
            <p class="empty-state-text">
              Kami akan memberi tahu ketika ada member yang mulai live.
            </p>
          </div>
        `}
      </section>

      <!-- Section 2 — OSHI KAMU -->
      <section style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 class="section-title" style="margin-bottom: 0;">
            <span>⭐ OSHI KAMU</span>
          </h3>
          <a href="#oshi" style="font-size: 0.82rem; font-weight: 600; color: var(--primary-red);">
            Kelola Oshi →
          </a>
        </div>

        ${userOshis.length > 0 ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;">
            ${userOshis.map(member => {
              const liveState = liveStates[member.id];
              const isLive = liveState?.status === LIVE_STATUS.LIVE;
              return `
                <div class="notif-card" style="margin-bottom: 0; padding: 10px 14px;" onclick="window.location.hash='#members'">
                  <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0;">
                    <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--dark-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${escapeHtml(member.nickname)}
                    </div>
                    <div style="font-size: 0.75rem; font-weight: 600; margin-top: 1px;">
                      ${isLive ? `<span style="color: var(--primary-red);">🔴 LIVE</span>` : `<span style="color: var(--text-light);">⚪ Offline</span>`}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div style="background-color: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.9rem; font-weight: 600; color: var(--dark-main);">Kamu belum memilih Oshi</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Pilih Oshi untuk mendapatkan prioritas notifikasi khusus.</div>
            </div>
            <a href="#oshi" style="background-color: var(--dark-main); color: #FFFFFF; font-size: 0.8rem; font-weight: 600; padding: 6px 12px; border-radius: var(--radius-sm); white-space: nowrap;">
              Pilih Oshi
            </a>
          </div>
        `}
      </section>

      <!-- Section 3 — RECENT LIVE SESSIONS -->
      ${recentEvents.length > 0 ? `
        <section>
          <div class="section-title">
            <span>RIWAYAT LIVE TERAKHIR</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${recentEvents.map(evt => {
              const member = members.find(m => m.id === evt.memberId);
              if (!member) return "";
              const platformName = evt.platform === "idn" ? "IDN Live" : "SHOWROOM";
              return `
                <div class="notif-card" style="margin-bottom: 0;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0;">
                    <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.nickname)}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 0.88rem; font-weight: 700; color: var(--dark-main);">
                      ${escapeHtml(member.nickname)}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                      ${platformName} · Selesai ${formatTime(evt.endedAt || evt.startedAt)}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}
