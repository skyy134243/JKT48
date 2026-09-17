// MemberCard Component
import { escapeHtml } from "../lib/utils.js";
import { LIVE_STATUS } from "../types/schemas.js";

export function renderMemberCard(member, liveState, isOshi = false) {
  const isLive = liveState?.status === LIVE_STATUS.LIVE;

  return `
    <div class="member-catalog-card" data-member-id="${escapeHtml(member.id)}">
      <div class="member-img-frame">
        <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" loading="lazy" />
        <button class="oshi-star-btn ${isOshi ? "is-oshi" : ""}" data-action="toggle-oshi" data-member-id="${escapeHtml(member.id)}" title="${isOshi ? "Hapus dari Oshi" : "Jadikan Oshi"}">
          ★
        </button>
      </div>
      <div class="member-catalog-info">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="member-catalog-name">${escapeHtml(member.nickname)}</span>
          ${isLive ? `<span style="color: var(--primary-red); font-size: 0.7rem; font-weight: 700;">🔴 LIVE</span>` : ""}
        </div>
        <span class="member-catalog-gen">Gen ${escapeHtml(member.generation)}</span>
      </div>
    </div>
  `;
}
