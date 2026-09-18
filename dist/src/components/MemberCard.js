// MemberCard Component — Provider Store Lookbook Aesthetic
import { escapeHtml } from "../lib/utils.js";
import { LIVE_STATUS } from "../types/schemas.js";

export function renderMemberCard(member, liveState, isOshi = false) {
  const isLive = liveState?.status === LIVE_STATUS.LIVE;
  const initial = (member.nickname || member.name || "J").charAt(0).toUpperCase();
  const teamLabel = member.teamStatus ? `${member.teamStatus} · ` : "";

  return `
    <div class="member-catalog-card" data-member-id="${escapeHtml(member.id)}">
      <div class="member-img-frame">
        <img 
          src="${escapeHtml(member.photoUrl)}" 
          alt="${escapeHtml(member.name)}" 
          loading="lazy" 
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="member-monogram-fallback" style="display: none;">
          <span class="member-monogram-initial">${initial}</span>
          <span class="member-monogram-gen">Gen ${escapeHtml(member.generation)}</span>
        </div>

        <button class="oshi-star-btn ${isOshi ? "is-oshi" : ""}" data-action="toggle-oshi" data-member-id="${escapeHtml(member.id)}" title="${isOshi ? "Hapus dari Oshi" : "Jadikan Oshi"}">
          ★
        </button>
      </div>

      <div class="member-catalog-info">
        <div class="member-catalog-name" title="${escapeHtml(member.name)}">
          ${escapeHtml(member.nickname)}
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
