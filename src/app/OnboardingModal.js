// Onboarding Modal Component — 4 Steps Flow
import { db } from "../lib/database.js";
import { escapeHtml } from "../lib/utils.js";

export function renderOnboardingModal(currentStep = 1, selectedOshis = []) {
  const allMembers = db.getMembers();

  return `
    <div class="modal-overlay" id="onboarding-overlay">
      <div class="modal-content" style="max-width: 520px; padding: 24px;">
        <!-- Step Indicators -->
        <div style="display: flex; gap: 6px; margin-bottom: 24px;">
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 1 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 2 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 3 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 4 ? "var(--primary-red)" : "var(--border-color)"};"></div>
        </div>

        ${currentStep === 1 ? `
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--primary-red-subtle); color: var(--primary-red); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
              🔴
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--dark-main); margin-bottom: 8px;">
              Selamat Datang di JKT48 Live Radar
            </h2>
            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 28px;">
              Aplikasi pendamping penggemar untuk memantau siaran langsung member JKT48 di IDN Live dan SHOWROOM secara instan.
            </p>
            <button id="btn-onboarding-next" data-step="2" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700; font-size: 0.95rem;">
              Mulai Pengaturan Oshi →
            </button>
          </div>
        ` : currentStep === 2 ? `
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 4px;">
              Pilih Oshi Kamu
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              Pilih satu atau beberapa member favoritmu. Kamu juga bisa melewatinya.
            </p>

            <div style="max-height: 280px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; padding: 4px;">
              ${allMembers.map(m => {
                const isSelected = selectedOshis.includes(m.id);
                return `
                  <div class="onboarding-oshi-item" data-member-id="${escapeHtml(m.id)}" style="cursor: pointer; border: 2px solid ${isSelected ? "var(--primary-red)" : "var(--border-color)"}; background-color: ${isSelected ? "var(--primary-red-subtle)" : "var(--bg-elevated)"}; border-radius: var(--radius-md); padding: 8px; text-align: center; transition: all 0.15s ease;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 0 auto 6px;">
                      <img src="${escapeHtml(m.photoUrl)}" alt="${escapeHtml(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="font-weight: 700; font-size: 0.82rem; color: var(--dark-main);">${escapeHtml(m.nickname)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-light);">Gen ${escapeHtml(m.generation)}</div>
                  </div>
                `;
              }).join("")}
            </div>

            <div style="display: flex; gap: 10px;">
              <button id="btn-onboarding-skip" data-step="3" style="flex: 1; border: 1px solid var(--border-color); padding: 11px; border-radius: var(--radius-md); font-weight: 600; color: var(--text-muted);">
                Lewati
              </button>
              <button id="btn-onboarding-next" data-step="3" style="flex: 2; background-color: var(--primary-red); color: #FFF; padding: 11px; border-radius: var(--radius-md); font-weight: 700;">
                Lanjut (${selectedOshis.length} Dipilih) →
              </button>
            </div>
          </div>
        ` : currentStep === 3 ? `
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 4px;">
              Atur Notifikasi
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
              Tentukan member mana yang ingin kamu pantau live-nya.
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="radio" name="onboarding-notif-scope" value="oshi" checked style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">⭐ Hanya Oshi</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Dapatkan notifikasi hanya ketika Oshi kamu mulai live.</div>
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="radio" name="onboarding-notif-scope" value="all" style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">🔴 Semua Member</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Dapatkan pemberitahuan setiap ada member JKT48 yang live.</div>
                </div>
              </label>
            </div>

            <button id="btn-onboarding-next" data-step="4" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700;">
              Lanjut ke Izin Notifikasi →
            </button>
          </div>
        ` : `
          <div style="text-align: center; padding: 16px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--oshi-gold-subtle); color: #B45309; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
              🔔
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 8px;">
              Aktifkan Push Notification
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">
              Agar kamu tidak tertinggal saat Oshi mulai live, izinkan browser mengirimkan pemberitahuan.
            </p>

            <button id="btn-onboarding-request-perm" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700; margin-bottom: 12px;">
              Aktifkan & Uji Notifikasi
            </button>
            <button id="btn-onboarding-finish" style="width: 100%; border: 1px solid var(--border-color); background-color: transparent; color: var(--text-muted); padding: 11px; border-radius: var(--radius-md); font-weight: 600;">
              Selesai & Masuk Radar
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}
