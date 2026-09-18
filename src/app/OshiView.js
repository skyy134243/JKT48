// Oshi Management & Priority View - With Dynamic Member Hero Background
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { OSHI_PRIORITY, LIVE_STATUS } from "../types/schemas.js";
import { escapeHtml } from "../lib/utils.js";
import { OFFICIAL_JKT48_LOGO } from "../data/members.js";

export function renderOshiView() {
  const prefs = auth.getPreferences();
  const allMembers = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];
  const priorityMap = prefs.priorityMembers || {};

  const oshiList = favoriteMembers.map(id => {
    const member = allMembers.find(m => m.id === id);
    const priority = priorityMap[id] || OSHI_PRIORITY.NORMAL;
    const liveState = liveStates[id];
    return { member, priority, isLive: liveState?.status === LIVE_STATUS.LIVE };
  }).filter(item => Boolean(item.member));

  oshiList.sort((a, b) => a.priority - b.priority);

  // Top oshi for hero background
  const topOshi = oshiList.length > 0 ? oshiList[0].member : null;
  const heroBg = topOshi?.photoUrl || OFFICIAL_JKT48_LOGO;
  const heroColor = topOshi?.color || '#E53935';
  const heroName = topOshi?.nickname || 'JKT48';

  return `
    <div class="page-view oshi-page">
      <!-- Dynamic Oshi Hero Background -->
      <div class="oshi-hero-banner" style="
        position: relative;
        width: 100%;
        min-height: 220px;
        margin: -24px -24px 28px -24px;
        overflow: hidden;
        border-radius: 0 0 16px 16px;
      ">
        <!-- Background photo -->
        <div style="
          position: absolute;
          inset: 0;
          background-image: url('${escapeHtml(heroBg)}');
          background-size: cover;
          background-position: center top;
          filter: blur(0px);
          transform: scale(1.05);
        "></div>
        <!-- Gradient overlay -->
        <div style="
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, 
            ${heroColor}CC 0%,
            ${heroColor}88 40%,
            rgba(0,0,0,0.75) 100%
          );
        "></div>
        <!-- Content -->
        <div style="
          position: relative;
          z-index: 2;
          padding: 32px 24px 24px;
          display: flex;
          align-items: flex-end;
          min-height: 220px;
        ">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 6px;">
              â­ OSHI PILIHAN UTAMA
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px; text-shadow: 0 2px 12px rgba(0,0,0,0.4);">
              ${escapeHtml(heroName)}
            </h2>
            ${topOshi ? `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.85); background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(4px);">
                  JKT48 Gen ${topOshi.generation} Â· ${topOshi.teamStatus}
                </span>
                ${oshiList[0]?.isLive ? `<span style="font-size: 0.78rem; font-weight: 700; color: #FF5252; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(4px);">ðŸ”´ SEDANG LIVE</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-main);">Manajemen Oshi</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Atur urutan dan prioritas notifikasi Oshi favoritmu.
        </p>
      </div>

      <!-- Priority Legend -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; font-size: 0.78rem;">
        <span class="priority-badge high">ðŸ”´ Prioritas 1 (Tinggi)</span>
        <span class="priority-badge normal">ðŸŸ¡ Prioritas 2 (Normal)</span>
        <span class="priority-badge low">ðŸŸ¢ Prioritas 3 (Rendah)</span>
      </div>

      <!-- Oshi List -->
      ${oshiList.length > 0 ? `
        <div class="oshi-list-container">
          ${oshiList.map(({ member, priority, isLive }, index) => {
            const badgeClass = priority === 1 ? "high" : (priority === 2 ? "normal" : "low");
            const badgeLabel = priority === 1 ? "Tinggi" : (priority === 2 ? "Normal" : "Rendah");
            const memberColor = member.color || '#E53935';

            return `
              <div class="oshi-item-card" style="border-left: 3px solid ${memberColor};">
                <div style="width: 52px; height: 52px; border-radius: var(--radius-md); overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0; border: 2px solid ${memberColor}40;">
                  <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}'; this.style.objectFit='contain'; this.style.padding='8px';" />
                </div>

                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">${escapeHtml(member.nickname)}</span>
                    ${isLive ? `<span style="font-size: 0.72rem; color: var(--primary-red); font-weight: 700;">ðŸ”´ LIVE</span>` : ""}
                    ${index === 0 ? `<span style="font-size: 0.68rem; color: #F9A825; font-weight: 700;">â­ #1</span>` : ""}
                  </div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
                    Gen ${member.generation} Â· ${member.teamStatus}
                  </div>
                  <div style="margin-top: 4px;">
                    <span class="priority-badge ${badgeClass}">${badgeLabel}</span>
                  </div>
                </div>

                <div class="priority-actions">
                  <button class="btn-icon-pill" data-action="move-up" data-member-id="${escapeHtml(member.id)}" ${index === 0 ? "disabled" : ""} title="Naikkan Prioritas">
                    â–²
                  </button>
                  <button class="btn-icon-pill" data-action="move-down" data-member-id="${escapeHtml(member.id)}" ${index === oshiList.length - 1 ? "disabled" : ""} title="Turunkan Prioritas">
                    â–¼
                  </button>
                  <button class="btn-icon-pill" data-action="remove-oshi" data-member-id="${escapeHtml(member.id)}" style="color: #E53935;" title="Hapus Oshi">
                    âœ•
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Add More Button -->
        <div style="margin-top: 16px; text-align: center;">
          <a href="#members" style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--bg-secondary); color: var(--dark-main); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.84rem; font-weight: 600;">
            + Tambah Oshi Lagi
          </a>
        </div>
      ` : `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <h4 class="empty-state-title">Belum ada Oshi yang dipilih</h4>
          <p class="empty-state-text">Pilih member favoritmu dari katalog member untuk mendapatkan update prioritas.</p>
          <a href="#members" style="margin-top: 16px; display: inline-block; background-color: var(--dark-main); color: #FFF; padding: 10px 18px; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
            Cari Member
          </a>
        </div>
      `}

      <!-- Footer Section -->
      <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border-color);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 20px;">
          <a href="mailto:admin@jkt48radar.fan" style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-decoration: none; transition: all 0.2s;">
            <span>ðŸ“§</span><span>Hubungi Admin</span>
          </a>
          <a href="#settings" style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-decoration: none; transition: all 0.2s;">
            <span>âš™ï¸</span><span>Pengaturan</span>
          </a>
        </div>
        <p style="font-size: 0.74rem; color: var(--text-light); text-align: center;">
          Fan-made Project Â· Hak Cipta Konten Resmi Milik JKT48 Operation Team
        </p>
      </footer>
    </div>
  `;
}