// MemberCard Component — Provider Store Lookbook Aesthetic
// Red & White Palette, Crisp Typography, Official JKT48 Logo Fallback
import { escapeHtml } from "../lib/utils.js";
import { LIVE_STATUS } from "../types/schemas.js";
import { OFFICIAL_JKT48_LOGO } from "../data/members.js";

export function renderMemberCard(member, liveState, isOshi = false) {
  const isLive = liveState?.status === LIVE_STATUS.LIVE;
  const teamLabel = member.teamStatus ? `${member.teamStatus} · ` : "";
  const photo = member.photoUrl || OFFICIAL_JKT48_LOGO;

  return `
    <div class="member-catalog-card" data-member-id="${escapeHtml(member.id)}">
      <div class="member-img-frame">
        <img 
          src="${escapeHtml(photo)}" 
          alt="${escapeHtml(member.name)}" 
          loading="lazy" 
          referrerpolicy="no-referrer"
          onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}'; this.classList.add('is-fallback-logo');"
        />

        <button class="oshi-star-btn ${isOshi ? "is-oshi" : ""}" data-action="toggle-oshi" data-member-id="${escapeHtml(member.id)}" title="${isOshi ? "Hapus dari Oshi" : "Jadikan Oshi"}">
          ★
        </button>
      </div>

      <div class="member-catalog-info">
        <div class="member-catalog-name" title="${escapeHtml(member.name)}">
          ${escapeHtml(member.nickname)}
        </div>
        <div class="member-catalog-fullname">
          ${escapeHtml(member.name)}
        </div>
        <div class="member-catalog-meta-row">
          <span class="member-catalog-gen">${teamLabel}Gen ${escapeHtml(member.generation)}</span>
          ${isLive ? `
            <span class="member-live-badge-mini">
              <span class="pulse-dot-mini"></span>
              LIVE
            </span>
          ` : ""}
        </div>
      </div>
    </div>
  `;
}
