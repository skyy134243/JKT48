// Landing Page View — For unauthenticated visitors
import { auth } from "../lib/auth.js";
import { escapeHtml } from "../lib/utils.js";

export function renderLandingView() {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-main);">
      <!-- Clean Landing Header -->
      <header style="padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color);">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.15rem; color: var(--dark-main);">
          <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--primary-red);"></span>
          <span>JKT48 LIVE RADAR</span>
        </div>
        <button id="btn-landing-login-header" style="background-color: var(--dark-main); color: #FFFFFF; padding: 8px 16px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
          Masuk
        </button>
      </header>

      <!-- Hero Section -->
      <main style="flex: 1; padding: 36px 20px; max-width: 640px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <span class="section-badge-live" style="margin-bottom: 16px;">
          <span class="pulse-dot"></span>
          REAL-TIME FAN RADAR
        </span>

        <h1 style="font-size: 2.1rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.03em; color: var(--dark-main); margin-bottom: 12px;">
          Pantau live member JKT48 dalam satu tempat.
        </h1>
        <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 28px;">
          Dapatkan notifikasi instan saat Oshi kamu mulai live di IDN Live atau SHOWROOM tanpa re-streaming dan tanpa spam.
        </p>

        <button id="btn-landing-google-login" style="display: flex; align-items: center; justify-content: center; gap: 12px; background-color: #FFFFFF; color: #3C4043; border: 1px solid var(--border-color); padding: 13px 24px; border-radius: var(--radius-md); font-size: 0.98rem; font-weight: 600; box-shadow: var(--shadow-sm); width: 100%; max-width: 320px; margin-bottom: 16px; transition: background-color 0.15s ease;">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <button id="btn-landing-guest-explore" style="font-size: 0.88rem; color: var(--text-muted); font-weight: 500; text-decoration: underline; margin-bottom: 36px;">
          Atau jelajahi dulu sebagai Tamu →
        </button>

        <!-- Visual Live Card Preview -->
        <div style="width: 100%; max-width: 360px; text-align: left; margin-bottom: 40px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">
            Contoh Tampilan Live Card
          </div>
          <div class="live-card" style="box-shadow: var(--shadow-md);">
            <div class="live-card-header">
              <span class="platform-badge idn">IDN Live</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="oshi-badge">⭐ OSHI</span>
                <span class="section-badge-live"><span class="pulse-dot"></span> LIVE</span>
              </div>
            </div>
            <div class="live-card-body">
              <div class="member-thumb-wrapper">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg" alt="Christy" />
              </div>
              <div class="live-card-info">
                <h3 class="live-member-name">Christy</h3>
                <p class="live-meta">JKT48 · Gen 7</p>
                <p class="live-start-time">Mulai 19:42</p>
              </div>
            </div>
            <button class="btn-buka-live" style="pointer-events: none;">
              <span>Buka Live</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
          </div>
        </div>

        <!-- 3 Feature Highlights (Per Section 6 of prompt) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; width: 100%; text-align: left;">
          <div style="background-color: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.2rem; margin-bottom: 6px;">🔴</div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 4px;">LIVE</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Lihat member yang sedang live secara real-time.</p>
          </div>
          <div style="background-color: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.2rem; margin-bottom: 6px;">⭐</div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 4px;">OSHI</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Pilih member favoritmu dan prioritaskan mereka.</p>
          </div>
          <div style="background-color: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.2rem; margin-bottom: 6px;">🔔</div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 4px;">NOTIFIKASI</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Dapatkan pemberitahuan otomatis saat mereka mulai live.</p>
          </div>
        </div>
      </main>

      <footer style="padding: 20px; text-align: center; border-top: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-light);">
        Fan-made project · JKT48 Live Radar tidak berafiliasi resmi dengan JKT48 Operation Team atau IDN Media.
      </footer>
    </div>
  `;
}
