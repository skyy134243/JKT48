// Header Component — Provider Store Editorial Aesthetic
// Features: Centered official JKT48 Logo, Top Horizontal Category Nav, Google Login
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";
import { OFFICIAL_JKT48_LOGO_SVG, OFFICIAL_JKT48_LOGO } from "../data/members.js";

export function renderHeader(activeRoute = "home") {
  const user = auth.getUser();
  const photoUrl = user?.photoURL || OFFICIAL_JKT48_LOGO;
  const name = user ? (user.displayName || "Wota").split(" ")[0] : "Wota";

  return `
    <!-- Top Announcement Bar (Artisanal Boutique Style) -->
    <div class="top-announcement-bar">
      <span class="pulse-mini"></span>
      <span>JKT48 LIVE RADAR — OFFICIAL SHOWROOM & IDN LIVE MONITOR</span>
    </div>

    <!-- Main Header Row -->
    <header class="app-header provider-header-main">
      <div class="header-left">
        <a href="#home" class="brand-badge">
          <span class="brand-dot"></span>
          <div class="brand-logo-text">
            <span>JKT<span class="brand-red">48</span></span>
            <span class="brand-sub">LIVE RADAR</span>
          </div>
        </a>
      </div>

      <!-- Centered Official JKT48 Logo Emblem -->
      <div class="header-center">
        <a href="#home" class="official-jkt48-emblem" title="JKT48 Official Live Radar">
          <img 
            src="${OFFICIAL_JKT48_LOGO_SVG}" 
            alt="JKT48 Official Logo" 
            class="header-jkt48-logo" 
            onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
          />
        </a>
      </div>

      <!-- Right Utility Actions & Google Login -->
      <div class="header-actions">
        <button id="theme-toggle-btn" class="btn-icon-editorial" title="Ubah Mode Tampilan">
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
          <div class="user-profile-widget">
            <a href="#profile" class="user-avatar-link" title="Profil ${escapeHtml(user.displayName || '')}">
              <img 
                src="${escapeHtml(photoUrl)}" 
                alt="${escapeHtml(name)}" 
                class="user-avatar-img"
                onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
              />
              <span class="user-greeting-name">${escapeHtml(name)}</span>
            </a>
            <button id="btn-header-logout" class="btn-header-logout" title="Keluar Akun">
              Keluar
            </button>
          </div>
        ` : `
          <button id="btn-header-google-login" class="btn-google-login-header" title="Masuk dengan Akun Google">
            <svg class="google-icon" width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        `}
      </div>
    </header>

    <!-- Top Horizontal Category Navigation Bar (Provider Store Boutique Columns) -->
    <nav class="provider-store-nav">
      <div class="provider-nav-track">
        <a href="#home" class="provider-nav-link ${activeRoute === 'home' ? 'active' : ''}">
          BERANDA
        </a>
        <a href="#members" class="provider-nav-link ${activeRoute === 'members' ? 'active' : ''}">
          KATALOG MEMBER
        </a>
        <a href="#oshi" class="provider-nav-link ${activeRoute === 'oshi' ? 'active' : ''}">
          OSHI SAYA
        </a>
        <a href="#notifications" class="provider-nav-link ${activeRoute === 'notifications' ? 'active' : ''}">
          NOTIFIKASI
        </a>
        <a href="#admin" class="provider-nav-link ${activeRoute === 'admin' ? 'active' : ''}">
          ADMIN & RADAR
        </a>
      </div>
    </nav>
  `;
}
