// Desktop Sidebar Component — Provider Store Editorial Aesthetic
export function renderSidebar(activeRoute = "home") {
  const links = [
    { id: "home", label: "Beranda", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>` },
    { id: "members", label: "Katalog Member", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>` },
    { id: "oshi", label: "Oshi Pilihan", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` },
    { id: "notifications", label: "Notifikasi", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>` },
    { id: "settings", label: "Pengaturan", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
    { id: "admin", label: "Admin Radar", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` }
  ];

  return `
    <aside class="desktop-sidebar">
      <div class="sidebar-logo">
        <span class="brand-dot"></span>
        <div class="brand-logo-text">
          <span>JKT<span class="brand-red">48</span></span>
          <span class="brand-sub">RADAR</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${links.map(l => `
          <a href="#${l.id}" class="sidebar-link ${activeRoute === l.id ? "active" : ""}">
            ${l.icon}
            <span>${l.label}</span>
          </a>
        `).join("")}
      </nav>

      <div style="margin-top: auto; padding: 16px; background-color: var(--bg-card-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.76rem; color: var(--text-muted);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background-color: var(--success-green); box-shadow: 0 0 6px var(--success-green);"></span>
          <span style="font-weight: 700; color: var(--dark-main); letter-spacing: 0.05em; text-transform: uppercase;">Radar Aktif</span>
        </div>
        <span>Memindai SHOWROOM & IDN Live setiap 60 detik.</span>
      </div>
    </aside>
  `;
}
