// Member Profile Modal Component
import { db } from "../lib/database.js";
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";
import { LIVE_STATUS } from "../types/schemas.js";

export function renderMemberProfileModal(memberId) {
  const member = db.getMemberById(memberId);
  if (!member) return "";

  const liveState = db.getLiveState(memberId);
  const isLive = liveState?.status === LIVE_STATUS.LIVE;
  const prefs = auth.getPreferences();
  const isOshi = (prefs.favoriteMembers || []).includes(memberId);

  return `
    <div class="modal-overlay" id="member-profile-modal-overlay">
      <div class="modal-content">
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 10; background-color: var(--bg-secondary); overflow: hidden;">
          <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button id="modal-close-btn" class="btn-icon-pill" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); color: #FFF; border: none;">
            ✕
          </button>
        </div>

        <div style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-main);">
              ${escapeHtml(member.name)} (${escapeHtml(member.nickname)})
            </h2>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            JKT48 · Generasi ${escapeHtml(member.generation)}
          </div>

          <!-- Status Badge -->
          <div style="margin-bottom: 20px;">
            ${isLive ? `
              <span class="section-badge-live">
                <span class="pulse-dot"></span>
                SEDANG LIVE DI ${liveState.platform?.toUpperCase()}
              </span>
            ` : `
              <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--text-light); background-color: var(--bg-secondary); padding: 4px 10px; border-radius: var(--radius-full);">
                ⚪ SEDANG OFFLINE
              </span>
            `}
          </div>

          <!-- Oshi Button -->
          <button id="modal-toggle-oshi-btn" data-member-id="${escapeHtml(member.id)}" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 700; margin-bottom: 24px; transition: all 0.15s ease; border: 1px solid ${isOshi ? "var(--oshi-gold)" : "var(--border-color)"}; background-color: ${isOshi ? "var(--oshi-gold-subtle)" : "var(--bg-secondary)"}; color: ${isOshi ? "#925300" : "var(--dark-main)"};">
            <span>${isOshi ? "⭐ Oshi Kamu (Aktif)" : "☆ Jadikan Oshi"}</span>
          </button>

          <!-- Official Platform Links -->
          <h4 style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-light); margin-bottom: 10px;">
            PLATFORM RESMI
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="${escapeHtml(member.idnUrl)}" target="_blank" rel="noopener noreferrer" class="notif-card" style="margin-bottom: 0;">
              <span class="platform-badge idn">IDN Live</span>
              <span style="font-size: 0.9rem; font-weight: 600; color: var(--dark-main); flex: 1; margin-left: 8px;">Profil IDN Live</span>
              <span style="color: var(--text-light);">→</span>
            </a>
            <a href="${escapeHtml(member.showroomUrl)}" target="_blank" rel="noopener noreferrer" class="notif-card" style="margin-bottom: 0;">
              <span class="platform-badge showroom">SHOWROOM</span>
              <span style="font-size: 0.9rem; font-weight: 600; color: var(--dark-main); flex: 1; margin-left: 8px;">Room SHOWROOM</span>
              <span style="color: var(--text-light);">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
