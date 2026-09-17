// Profile View
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";

export function renderProfileView() {
  const user = auth.getUser();
  if (!user) {
    return `<div class="page-view"><p>Silakan masuk terlebih dahulu.</p></div>`;
  }

  return `
    <div class="page-view">
      <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; text-align: center; margin-bottom: 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin: 0 auto 14px; border: 3px solid var(--border-color);">
          <img src="${escapeHtml(user.photoURL)}" alt="${escapeHtml(user.displayName)}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main);">${escapeHtml(user.displayName)}</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">${escapeHtml(user.email)}</p>
      </div>

      <!-- Quick Nav Links -->
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
        <a href="#oshi" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">⭐</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Oshi Saya</span>
          <span>→</span>
        </a>
        <a href="#notifications" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">🔔</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Notifikasi</span>
          <span>→</span>
        </a>
        <a href="#settings" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">⚙</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Pengaturan</span>
          <span>→</span>
        </a>
        <a href="#admin" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">📊</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Admin Radar Status</span>
          <span>→</span>
        </a>
      </div>

      <!-- Logout Action -->
      <button id="btn-logout" style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background-color: var(--bg-elevated); color: var(--primary-red); font-size: 0.92rem; font-weight: 700;">
        🚪 Keluar dari Akun
      </button>
    </div>
  `;
}
