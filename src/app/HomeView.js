// Home Dashboard View - JKT48 Hero Banner at top + White/Red below
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { LIVE_STATUS } from "../types/schemas.js";
import { renderLiveCard } from "../components/LiveCard.js";
import { escapeHtml, formatTime } from "../lib/utils.js";
import { OFFICIAL_JKT48_LOGO, OFFICIAL_JKT48_LOGO_SVG } from "../data/members.js";

export function renderHomeView() {
  const user = auth.getUser();
  const prefs = auth.getPreferences();
  const members = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];

  const hour = new Date().getHours();
  let greeting = "Selamat malam";
  if (hour >= 5 && hour < 11) greeting = "Selamat pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat sore";

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Wota";

  const liveItems = [];
  members.forEach(member => {
    const state = liveStates[member.id];
    if (state && state.status === LIVE_STATUS.LIVE) {
      const isOshi = favoriteMembers.includes(member.id);
      liveItems.push({ member, platform: state.platform, liveUrl: state.liveUrl || (state.platform === "idn" ? member.idnUrl : member.showroomUrl), startedAt: state.startedAt, isOshi });
    }
  });

  liveItems.sort((a, b) => {
    if (a.isOshi && !b.isOshi) return -1;
    if (!a.isOshi && b.isOshi) return 1;
    return new Date(b.startedAt || 0) - new Date(a.startedAt || 0);
  });

  const userOshis = favoriteMembers.map(id => members.find(m => m.id === id)).filter(Boolean);
  const recentEvents = db.getLiveEvents(5);

  return `
    <div class="page-view home-page">
      <!-- HERO: JKT48 Logo Background Banner -->
      <div style="position:relative;margin:-24px -24px 0 -24px;min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,#1a0000 0%,#2d0505 40%,#B71C1C 100%);padding:40px 24px 56px;text-align:center;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(229,57,53,0.5) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="position:absolute;inset:0;opacity:0.03;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:20px 20px;"></div>
        <div style="position:relative;z-index:2;margin-bottom:16px;">
          <img src="${OFFICIAL_JKT48_LOGO_SVG}" alt="JKT48" style="height:72px;width:auto;filter:brightness(0) invert(1) drop-shadow(0 4px 20px rgba(255,255,255,0.25));" onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.style.filter='brightness(0) invert(1)';" />
        </div>
        <div style="position:relative;z-index:2;">
          <h1 style="font-family:var(--font-serif);font-size:clamp(1.5rem,4vw,2.2rem);font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.1;margin-bottom:8px;text-shadow:0 2px 16px rgba(0,0,0,0.5);">
            ${greeting}, <em style="font-style:italic;font-weight:400;">${escapeHtml(firstName)}</em>
          </h1>
          <p style="font-size:0.9rem;color:rgba(255,255,255,0.8);max-width:440px;line-height:1.5;">
            Radar live aktif memantau siaran member JKT48 di IDN Live &amp; SHOWROOM secara real-time.
          </p>
        </div>
        ${liveItems.length > 0 ? `
          <div style="position:relative;z-index:2;margin-top:18px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:100px;padding:8px 18px;backdrop-filter:blur(8px);">
            <span style="width:8px;height:8px;border-radius:50%;background:#FF5252;box-shadow:0 0 8px #FF5252;animation:radarPulse 1.5s infinite;display:inline-block;"></span>
            <span style="font-size:0.82rem;font-weight:700;color:#FFFFFF;letter-spacing:0.06em;">${liveItems.length} MEMBER SEDANG LIVE</span>
          </div>
        ` : `
          <div style="position:relative;z-index:2;margin-top:18px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);border-radius:100px;padding:8px 18px;">
            <span style="font-size:0.82rem;color:rgba(255,255,255,0.65);">Radar aktif &middot; Tidak ada yang live saat ini</span>
          </div>
        `}
        <div style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:2;opacity:0.5;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <!-- WHITE SECTION -->
      <div style="background:var(--bg-main);padding-top:32px;">

        <!-- SIARAN LANGSUNG -->
        <section style="margin-bottom:44px;">
          <div class="section-title">
            <span class="pulse-dot"></span>
            <span>SIARAN LANGSUNG</span>
            ${liveItems.length > 0 ? `<span style="font-size:0.76rem;font-weight:700;color:var(--primary-red);background:var(--primary-red-subtle);padding:3px 8px;border-radius:var(--radius-xs);margin-left:auto;">${liveItems.length} Online</span>` : ""}
          </div>
          ${liveItems.length > 0 ? `
            <div class="live-grid">${liveItems.map(item => renderLiveCard(item, item.isOshi)).join("")}</div>
          ` : `
            <div class="empty-state">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <h4 class="empty-state-title" style="font-family:var(--font-serif);">Belum ada member yang siaran saat ini</h4>
              <p class="empty-state-text">Radar terus memindai setiap 60 detik. Notifikasi akan muncul saat member memulai siaran.</p>
            </div>
          `}
        </section>

        <!-- DAFTAR OSHI -->
        <section style="margin-bottom:44px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 class="section-title" style="margin-bottom:0;"><span>&#11088; DAFTAR OSHI</span></h3>
            <a href="#oshi" style="font-size:0.78rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--primary-red);">Kelola &rarr;</a>
          </div>
          ${userOshis.length > 0 ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;">
              ${userOshis.map(member => {
                const liveState = liveStates[member.id];
                const isLive = liveState?.status === LIVE_STATUS.LIVE;
                const memberColor = member.color || "#E53935";
                return `
                  <div class="notif-card" style="margin-bottom:0;padding:10px 12px;border-left:3px solid ${memberColor};cursor:pointer;" onclick="window.location.hash='#members'">
                    <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background-color:var(--bg-secondary);flex-shrink:0;border:2px solid ${memberColor}40;">
                      <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width:100%;height:100%;object-fit:cover;object-position:top;"
                        onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.style.objectFit='contain';this.style.padding='6px';" />
                    </div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-family:var(--font-serif);font-weight:700;font-size:0.9rem;color:var(--dark-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(member.nickname)}</div>
                      <div style="font-size:0.7rem;font-weight:600;margin-top:1px;">${isLive ? `<span style="color:var(--primary-red);">&#128308; LIVE</span>` : `<span style="color:var(--text-light);">&#9898; Offline</span>`}</div>
                    </div>
                  </div>`;
              }).join("")}
            </div>
          ` : `
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
              <div>
                <div style="font-family:var(--font-serif);font-size:1.05rem;font-weight:700;color:var(--dark-main);">Kamu belum memilih Oshi</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:3px;">Tentukan Oshi agar radar mengutamakan notifikasi siaran mereka.</div>
              </div>
              <a href="#oshi" style="background-color:var(--dark-main);color:#FAF8F5;font-size:0.78rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:9px 18px;border-radius:var(--radius-sm);white-space:nowrap;text-decoration:none;">Pilih Oshi</a>
            </div>
          `}
        </section>

        <!-- RIWAYAT SIARAN -->
        ${recentEvents.length > 0 ? `
          <section style="margin-bottom:44px;">
            <div class="section-title"><span>RIWAYAT SIARAN TERAKHIR</span></div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${recentEvents.map(evt => {
                const member = members.find(m => m.id === evt.memberId);
                if (!member) return "";
                const platformName = evt.platform === "idn" ? "IDN Live" : "SHOWROOM";
                const platformColor = evt.platform === "idn" ? "#1565C0" : "#E53935";
                return `
                  <div class="notif-card" style="margin-bottom:0;">
                    <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background-color:var(--bg-secondary);flex-shrink:0;">
                      <img src="${escapeHtml(member.photoUrl || OFFICIAL_JKT48_LOGO)}" alt="${escapeHtml(member.nickname)}" style="width:100%;height:100%;object-fit:cover;object-position:top;"
                        onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.classList.add('is-fallback-logo');" />
                    </div>
                    <div style="flex:1;">
                      <div style="font-family:var(--font-serif);font-size:0.95rem;font-weight:700;color:var(--dark-main);">${escapeHtml(member.nickname)}</div>
                      <div style="font-size:0.76rem;color:var(--text-muted);"><span style="color:${platformColor};font-weight:600;">${platformName}</span> &middot; Selesai ${formatTime(evt.endedAt || evt.startedAt)}</div>
                    </div>
                  </div>`;
              }).join("")}
            </div>
          </section>
        ` : ""}

        <!-- FOOTER -->
        <footer class="app-footer">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:20px;">
            <a href="mailto:admin@jkt48radar.fan" class="footer-link-item">&#128231; Hubungi Admin</a>
            <a href="#" class="footer-link-item" onclick="alert('FAQ JKT48 Live Radar:\\n\\n1. Bagaimana cara kerja radar?\\nMemindai IDN Live & SHOWROOM setiap 60 detik.\\n\\n2. Data aman?\\nSemua tersimpan lokal di browser.\\n\\n3. Member tidak muncul live?\\nPastikan koneksi internet stabil.');return false;">&#10067; FAQ</a>
            <a href="#" class="footer-link-item" onclick="alert('Kirim saran ke admin@jkt48radar.fan - Terima kasih!');return false;">&#128161; Saran Fitur</a>
            <a href="#settings" class="footer-link-item">&#9881;&#65039; Pengaturan</a>
            <a href="https://github.com/skyy134243/JKT48" target="_blank" rel="noopener" class="footer-link-item">&#128279; GitHub</a>
          </div>
          <div class="footer-bottom">
            <p>Fan-made Project &copy; 2024 &middot; Hak Cipta Konten Resmi Milik JKT48 Operation Team</p>
            <p style="margin-top:4px;">Radar real-time &middot; Data diperbarui setiap 60 detik</p>
          </div>
        </footer>
      </div>
    </div>
  `;
}