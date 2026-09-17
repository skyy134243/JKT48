// Admin Dashboard View — /admin
import { liveMonitor } from "../services/liveMonitor.js";
import { db } from "../lib/database.js";
import { LIVE_STATUS } from "../types/schemas.js";
import { escapeHtml, formatTime } from "../lib/utils.js";

export function renderAdminView() {
  const health = liveMonitor.getSystemHealth();
  const members = db.getMembers();
  const liveStates = db.getLiveStates();

  const liveMembers = members.filter(m => liveStates[m.id]?.status === LIVE_STATUS.LIVE);

  return `
    <div class="page-view">
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; font-weight: 700; background-color: var(--dark-main); color: #FFF; padding: 2px 8px; border-radius: var(--radius-sm);">
            ADMIN
          </span>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Radar System Monitor</h2>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Status kesehatan service, scheduler, dan live provider.
        </p>
      </div>

      <!-- SYSTEM STATUS CARDS -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px;">
        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">MONITOR HEALTH</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.monitor}</span>
          </div>
        </div>

        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">DATABASE</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.database}</span>
          </div>
        </div>

        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">NOTIFICATION</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.notification}</span>
          </div>
        </div>
      </section>

      <!-- PROVIDER LAST CHECK -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 12px;">Pemeriksaan Provider Terakhir</h3>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 8px;">
          <span style="font-size: 0.88rem; font-weight: 600;">IDN Live</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${formatTime(health.idnLastChecked) || "Aktif"}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 0.88rem; font-weight: 600;">SHOWROOM</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${formatTime(health.showroomLastChecked) || "Aktif"}</span>
        </div>
      </section>

      <!-- LIVE SIMULATOR & TESTING TOOL -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Simulasi Live Event (QA & Debugging)</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">
          Uji transisi OFFLINE → LIVE dan routing notifikasi dengan menyalakan simulasi live untuk member pilihan:
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-simulate-live" data-member="christy" data-platform="idn" style="background-color: #E53935; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔴 Set Christy Live (IDN)
          </button>
          <button class="btn-simulate-live" data-member="freya" data-platform="showroom" style="background-color: #1976D2; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔴 Set Freya Live (SHOWROOM)
          </button>
          <button id="btn-simulate-end-all" style="background-color: var(--bg-secondary); color: var(--dark-main); border: 1px solid var(--border-color); padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            ⚪ Matikan Semua Live
          </button>
          <button id="btn-manual-check" style="background-color: #388E3C; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔄 Manual Check (Real API)
          </button>
        </div>
      </section>

      <!-- CURRENT LIVE SESSIONS -->
      <section>
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 12px;">
          Member Sedang Live (${liveMembers.length})
        </h3>
        ${liveMembers.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${liveMembers.map(m => `
              <div class="notif-card" style="margin-bottom: 0;">
                <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0;">
                  <img src="${escapeHtml(m.photoUrl)}" alt="${escapeHtml(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--dark-main);">${escapeHtml(m.name)}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${liveStates[m.id].platform?.toUpperCase()} · ${formatTime(liveStates[m.id].startedAt)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <p style="font-size: 0.85rem; color: var(--text-muted);">Tidak ada live yang aktif saat ini.</p>
        `}
      </section>
    </div>
  `;
}
