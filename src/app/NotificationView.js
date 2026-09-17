// Notification Center View
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { formatDateLabel } from "../lib/utils.js";
import { renderNotificationCard } from "../components/NotificationCard.js";

export function renderNotificationView() {
  const user = auth.getUser();
  const notifications = user ? db.getNotifications(user.uid) : [];

  // Group notifications by date label ("Hari ini", "Kemarin", etc.)
  const groups = {};
  notifications.forEach(notif => {
    const label = formatDateLabel(notif.startedAt || notif.deliveredAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
  });

  return `
    <div class="page-view">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Notifikasi</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Riwayat siaran live dari Oshi dan member JKT48.
        </p>
      </div>

      ${Object.keys(groups).length > 0 ? `
        ${Object.entries(groups).map(([label, items]) => `
          <div class="notif-group">
            <div class="notif-group-header">${label}</div>
            ${items.map(notif => renderNotificationCard(notif)).join("")}
          </div>
        `).join("")}
      ` : `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <h4 class="empty-state-title">Belum ada notifikasi</h4>
          <p class="empty-state-text">
            Notifikasi live baru akan muncul di sini sesuai preferensi Oshi kamu.
          </p>
        </div>
      `}
    </div>
  `;
}
