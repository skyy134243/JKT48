// Header Component
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";

export function renderHeader(activeRoute = "home") {
  const user = auth.getUser();
  const photoUrl = user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg";
  const name = user ? user.displayName.split(" ")[0] : "Wota";

  return `
    <header class="app-header">
      <div class="brand-badge" onclick="window.location.hash='#home'" style="cursor: pointer;">
        <span class="brand-dot"></span>
        <span>JKT48 LIVE RADAR</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button id="theme-toggle-btn" class="btn-icon-pill" title="Ubah Tema" style="border: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <button onclick="window.location.hash='#login'" style="font-size: 0.85rem; font-weight: 600; color: var(--primary-red);">
            Masuk
          </button>
        `}
      </div>
    </header>
  `;
}
