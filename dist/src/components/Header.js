// Header Component — Provider Store Editorial Aesthetic
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";

export function renderHeader(activeRoute = "home") {
  const user = auth.getUser();
  const photoUrl = user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg";
  const name = user ? user.displayName.split(" ")[0] : "Wota";

  return `
    <!-- Top Announcement Bar (Artisanal Boutique Style) -->
    <div class="top-announcement-bar">
      <span class="pulse-mini"></span>
      <span>JKT48 LIVE RADAR — REAL-TIME IDN LIVE & SHOWROOM MONITOR</span>
    </div>

    <header class="app-header">
      <div class="brand-badge" onclick="window.location.hash='#home'" style="cursor: pointer;">
        <span class="brand-dot"></span>
        <div class="brand-logo-text">
          <span>JKT<span class="brand-red">48</span></span>
          <span class="brand-sub">RADAR</span>
        </div>
      </div>

      <div class="header-actions">
        <button id="theme-toggle-btn" class="btn-icon-editorial" title="Ubah Tema">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        ${user ? `
          <button class="user-avatar-btn" onclick="window.location.hash='#profile'" title="${escapeHtml(user.displayName)}">
            <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(name)}" />
          </button>
        ` : `
          <button onclick="window.location.hash='#login'" style="font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--primary-red); border: 1px solid var(--border-color); padding: 7px 14px; border-radius: var(--radius-sm); background: var(--bg-elevated);">
            Masuk
          </button>
        `}
      </div>
    </header>
  `;
}
