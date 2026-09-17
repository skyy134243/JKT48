// Oshi Management & Priority View
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { OSHI_PRIORITY, LIVE_STATUS } from "../types/schemas.js";
import { escapeHtml } from "../lib/utils.js";

export function renderOshiView() {
  const prefs = auth.getPreferences();
  const allMembers = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];
  const priorityMap = prefs.priorityMembers || {};

  // Sort favorite members by priority ascending (1 = High, 2 = Normal, 3 = Low)
  const oshiList = favoriteMembers.map(id => {
    const member = allMembers.find(m => m.id === id);
    const priority = priorityMap[id] || OSHI_PRIORITY.NORMAL;
    const liveState = liveStates[id];
    return { member, priority, isLive: liveState?.status === LIVE_STATUS.LIVE };
  }).filter(item => Boolean(item.member));

  oshiList.sort((a, b) => a.priority - b.priority);

  return `
    <div class="page-view">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Oshi Kamu</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Atur urutan dan prioritas notifikasi Oshi favoritmu.
        </p>
      </div>

      <!-- Priority Legend -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; font-size: 0.78rem;">
        <span class="priority-badge high">🔴 Prioritas 1 (Tinggi)</span>
        <span class="priority-badge normal">🟡 Prioritas 2 (Normal)</span>
        <span class="priority-badge low">⚪ Prioritas 3 (Rendah)</span>
      </div>

      <!-- Oshi List -->
      ${oshiList.length > 0 ? `
        <div class="oshi-list-container">
          ${oshiList.map(({ member, priority, isLive }, index) => {
            const badgeClass = priority === 1 ? "high" : (priority === 2 ? "normal" : "low");
            const badgeLabel = priority === 1 ? "Tinggi" : (priority === 2 ? "Normal" : "Rendah");

            return `
              <div class="oshi-item-card">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-md); overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0;">
                  <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>

                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">${escapeHtml(member.nickname)}</span>
                    ${isLive ? `<span style="font-size: 0.72rem; color: var(--primary-red); font-weight: 700;">🔴 LIVE</span>` : ""}
                  </div>
                  <div style="margin-top: 4px;">
                    <span class="priority-badge ${badgeClass}">${badgeLabel}</span>
                  </div>
                </div>

                <div class="priority-actions">
                  <button class="btn-icon-pill" data-action="move-up" data-member-id="${escapeHtml(member.id)}" ${index === 0 ? "disabled" : ""} title="Naikkan Prioritas">
                    ▲
                  </button>
                  <button class="btn-icon-pill" data-action="move-down" data-member-id="${escapeHtml(member.id)}" ${index === oshiList.length - 1 ? "disabled" : ""} title="Turunkan Prioritas">
                    ▼
                  </button>
                  <button class="btn-icon-pill" data-action="remove-oshi" data-member-id="${escapeHtml(member.id)}" style="color: #E53935;" title="Hapus Oshi">
                    ✕
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      ` : `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <h4 class="empty-state-title">Belum ada Oshi yang dipilih</h4>
          <p class="empty-state-text">Pilih member favoritmu dari daftar member untuk mendapatkan update prioritas.</p>
          <a href="#members" style="margin-top: 16px; background-color: var(--dark-main); color: #FFF; padding: 10px 18px; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
            Cari Member
          </a>
        </div>
      `}
    </div>
  `;
}
