// NotificationCard & Skeletons
import { escapeHtml, formatTime } from "../lib/utils.js";
import { PLATFORMS } from "../types/schemas.js";

export function renderNotificationCard(notif) {
  const platformName = notif.platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const time = formatTime(notif.startedAt);

  return `
    <div class="notif-card" onclick="window.open('${escapeHtml(notif.liveUrl)}', '_blank')">
      <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background-color: var(--bg-secondary);">
        <img src="${escapeHtml(notif.memberPhoto)}" alt="${escapeHtml(notif.memberName)}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-weight: 700; font-size: 0.92rem; color: var(--dark-main);">${escapeHtml(notif.memberName)}</span>
          <span style="font-size: 0.78rem; color: var(--text-light);">mulai live</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
          ${platformName} · ${time}
        </div>
      </div>
      <button class="btn-icon-pill" style="border: none; color: var(--primary-red);" title="Buka Live">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  `;
}

export function renderLiveSkeleton() {
  return `
    <div class="live-card skeleton" style="height: 180px; opacity: 0.6;"></div>
  `;
}
