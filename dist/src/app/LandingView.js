// Landing Page View — Provider Store Slow-Made Editorial Aesthetic
import { escapeHtml } from "../lib/utils.js";

export function renderLandingView() {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-main);">
      <!-- Top Announcement Bar -->
      <div class="top-announcement-bar">
        <span class="pulse-mini"></span>
        <span>JKT48 LIVE RADAR — SLOW MONITORED STREAMING & OSHI NOTIFIER</span>
      </div>

      <!-- Clean Editorial Header -->
      <header style="padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); background-color: var(--bg-main);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="brand-dot"></span>
          <div class="brand-logo-text">
            <span>JKT<span class="brand-red">48</span></span>
            <span class="brand-sub">RADAR</span>
          </div>
        </div>
        <button id="btn-landing-login-header" style="background-color: var(--dark-main); color: #FAF8F5; padding: 9px 20px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s ease;">
          Masuk
        </button>
      </header>

      <!-- Editorial Hero Section -->
      <main style="flex: 1; padding: 48px 24px 60px; max-width: 720px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <span class="section-badge-live" style="margin-bottom: 20px;">
          <span class="pulse-dot"></span>
          REAL-TIME FAN RADAR
        </span>

        <h1 style="font-family: var(--font-serif); font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.18; letter-spacing: -0.03em; color: var(--dark-main); margin-bottom: 18px;">
          Pantau siaran live member JKT48 dalam satu galeri.
        </h1>
        <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; max-width: 540px; margin-bottom: 32px;">
          Dapatkan notifikasi instan saat Oshi kamu mulai siaran di IDN Live atau SHOWROOM tanpa re-streaming dan tanpa gangguan spam.
        </p>

        <!-- CTA Buttons -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 320px; margin-bottom: 48px;">
          <button id="btn-landing-google-login" style="display: flex; align-items: center; justify-content: center; gap: 12px; background-color: #FFFFFF; color: var(--dark-main); border: 1px solid var(--border-color); padding: 13px 24px; border-radius: var(--radius-sm); font-size: 0.92rem; font-weight: 600; box-shadow: var(--shadow-sm); width: 100%; transition: all 0.2s ease;">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          <button id="btn-landing-guest-explore" style="font-size: 0.86rem; color: var(--text-muted); font-weight: 500; letter-spacing: 0.02em; text-decoration: underline; background: none; border: none; cursor: pointer; transition: color 0.15s ease;">
            Atau jelajahi dulu sebagai Tamu →
          </button>
        </div>

        <!-- Visual Lookbook Preview Card -->
        <div style="width: 100%; max-width: 380px; text-align: left; margin-bottom: 48px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: space-between;">
            <span>Preview Kartu Siaran</span>
            <span style="font-style: italic; font-family: var(--font-serif);">Curated Gallery Card</span>
          </div>
          <div class="live-card" style="box-shadow: var(--shadow-md);">
            <div class="live-card-header">
              <span class="platform-badge idn">IDN Live</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="section-badge-live"><span class="pulse-dot"></span> LIVE</span>
              </div>
            </div>
            <div class="live-card-body">
              <div class="member-thumb-wrapper">
                <img src="https://jkt48.com/images/member/member_christy.jpg" alt="Christy" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg'" />
              </div>
              <div class="live-card-info">
                <h3 class="live-member-name">Christy</h3>
                <p class="live-meta">JKT48 · Gen 7</p>
                <p class="live-start-time">Mulai 19:42 WIB</p>
              </div>
            </div>
            <button class="btn-buka-live" style="pointer-events: none;">
              <span>Buka Live</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
          </div>
        </div>

        <!-- 3 Feature Pillars (Editorial Homeware Aesthetic) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; width: 100%; text-align: left;">
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🔴</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Deteksi Siaran</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Pantau status siaran aktif di SHOWROOM & IDN Live tanpa jeda.</p>
          </div>
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">⭐</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Prioritas Oshi</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Kelola daftar member kesayanganmu dengan tingkatan prioritas khusus.</p>
          </div>
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🔔</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Notifikasi Bersih</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Pemberitahuan instan tanpa bot spam, lengkap dengan jam tenang (quiet hours).</p>
          </div>
        </div>
      </main>

      <footer style="padding: 24px; text-align: center; border-top: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-light); background-color: var(--bg-main);">
        Fan-made Project · Estetika Slow-Made Homewares & JKT48 Live Radar · Hak Cipta Konten Resmi Milik JKT48 Operation Team.
      </footer>
    </div>
  `;
}
