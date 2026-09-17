// LiveCard Component — Clean, Official Link Only
import { escapeHtml, formatTime } from "../lib/utils.js";
import { PLATFORMS } from "../types/schemas.js";

export function renderLiveCard(liveItem, isOshi = false) {
  const { member, platform, liveUrl, startedAt } = liveItem;
  const platformLabel = platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const platformClass = platform === PLATFORMS.IDN ? "idn" : "showroom";
  const timeFormatted = startedAt ? `Mulai ${formatTime(startedAt)}` : "Sedang Live";

  return `
    <article class="live-card">
      <div class="live-card-header">
        <span class="platform-badge ${platformClass}">
          ${platformLabel}
        </span>
        <div style="display: flex; align-items: center; gap: 6px;">
          ${isOshi ? `<span class="oshi-badge">⭐ OSHI</span>` : ""}
          <span class="section-badge-live">
            <span class="pulse-dot"></span>
            LIVE
          </span>
        </div>
      </div>

      <div class="live-card-body">
        <div class="member-thumb-wrapper">
          <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" loading="lazy" />
        </div>
        <div class="live-card-info">
          <h3 class="live-member-name">${escapeHtml(member.nickname)}</h3>
          <p class="live-meta">JKT48 · Gen ${escapeHtml(member.generation)}</p>
          <p class="live-start-time">${escapeHtml(timeFormatted)}</p>
        </div>
      </div>

      <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-buka-live">
        <span>Buka Live</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </article>
  `;
}
