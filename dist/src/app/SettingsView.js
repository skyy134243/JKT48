// Settings View — Preferences & Quiet Hours
import { auth } from "../lib/auth.js";
import { notificationManager } from "../lib/notifications.js";

export function renderSettingsView() {
  const prefs = auth.getPreferences();
  const pushPermission = notificationManager.getPermission();

  return `
    <div class="page-view">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Pengaturan</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Sesuaikan notifikasi dan tampilan aplikasi.
        </p>
      </div>

      <!-- Web Push Permission Status -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main);">Web Push Notification</h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Status izin browser: <strong>${pushPermission.toUpperCase()}</strong>
            </p>
          </div>
          ${pushPermission !== "granted" ? `
            <button id="btn-request-permission" style="background-color: var(--primary-red); color: #FFF; font-size: 0.82rem; font-weight: 600; padding: 8px 14px; border-radius: var(--radius-md);">
              Aktifkan
            </button>
          ` : `
            <span style="color: var(--success-green); font-size: 0.82rem; font-weight: 700;">✓ Aktif</span>
          `}
        </div>
      </section>

      <!-- Target Member Notifications -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Pemberitahuan Member
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">Notifikasi Semua Member</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Terima notifikasi untuk semua member yang live (bukan hanya Oshi)</div>
            </div>
            <input type="checkbox" id="pref-notify-all" ${prefs.notifyAllMembers ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
        </div>
      </section>

      <!-- Platform Settings -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Filter Platform
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">IDN Live</div>
            <input type="checkbox" id="pref-notify-idn" ${prefs.notifyIDN ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">SHOWROOM</div>
            <input type="checkbox" id="pref-notify-showroom" ${prefs.notifySHOWROOM ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
        </div>
      </section>

      <!-- Quiet Hours -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Jam Hening (Quiet Hours)
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">Aktifkan Jam Hening</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Senyapkan notifikasi suara pada jam tertentu (misal malam hari)</div>
            </div>
            <input type="checkbox" id="pref-quiet-enabled" ${prefs.quietHours?.enabled ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>

          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="flex: 1;">
              <label style="font-size: 0.78rem; color: var(--text-muted);">Mulai</label>
              <input type="time" id="pref-quiet-start" value="${prefs.quietHours?.start || "23:00"}" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--bg-main); color: var(--dark-main);" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.78rem; color: var(--text-muted);">Selesai</label>
              <input type="time" id="pref-quiet-end" value="${prefs.quietHours?.end || "06:00"}" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--bg-main); color: var(--dark-main);" />
            </div>
          </div>
        </div>
      </section>

      <!-- About & Privacy -->
      <section style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; padding: 12px;">
        <p><strong>JKT48 Live Radar v1.0.0</strong></p>
        <p>Aplikasi fan-made tanpa iklan, tanpa re-streaming, dibuat dengan cinta untuk komunitas Wota JKT48.</p>
        <p style="margin-top: 8px;"><a href="#" style="text-decoration: underline;">Kebijakan Privasi</a> · <a href="#" style="text-decoration: underline;">Syarat Ketentuan</a></p>
      </section>
    </div>
  `;
}
