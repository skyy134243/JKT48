// LiveCard Component — Provider Store Lookbook Aesthetic
// Red & White Palette, Live Radar Pulse, Official JKT48 Logo Fallback
import { escapeHtml, formatTime } from "../lib/utils.js";
import { PLATFORMS } from "../types/schemas.js";
import { OFFICIAL_JKT48_LOGO } from "../data/members.js";

export function renderLiveCard(liveItem, isOshi = false) {
  const { member, platform, liveUrl, startedAt } = liveItem;
  const platformLabel = platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const platformClass = platform === PLATFORMS.IDN ? "idn" : "showroom";
  const timeFormatted = startedAt ? `Mulai ${formatTime(startedAt)} WIB` : "Sedang Live";
  const photo = member.photoUrl || OFFICIAL_JKT48_LOGO;

  return `
    <article class="live-card">
      <div class="live-card-header">
        <span class="platform-badge ${platformClass}">
          ${platformLabel}
        </span>
        <div style="display: flex; align-items: center; gap: 6px;">
          ${isOshi ? `<span class="oshi-badge-pill">⭐ OSHI</span>` : ""}
          <span class="section-badge-live">
            <span class="pulse-dot"></span>
            LIVE
          </span>
        </div>
      </div>

      <div class="live-card-body">
        <div class="member-thumb-wrapper">
          <img 
            src="${escapeHtml(photo)}" 
            alt="${escapeHtml(member.name)}" 
            loading="lazy" 
            referrerpolicy="no-referrer"
            onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}'; this.classList.add('is-fallback-logo');" 
          />
        </div>
        <div class="live-card-info">
          <h3 class="live-member-name">${escapeHtml(member.nickname)}</h3>
          <p class="live-meta">JKT48 · Gen ${escapeHtml(member.generation)}</p>
          <p class="live-start-time">${escapeHtml(timeFormatted)}</p>
        </div>
      </div>

      <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-buka-live">
        <span>Buka Siaran</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </article>
  `;
}
