// Member Catalog View — Provider Store Editorial Lookbook
import { db } from "../lib/database.js";
import { auth } from "../lib/auth.js";
import { GENERATIONS } from "../data/members.js";
import { renderMemberCard } from "../components/MemberCard.js";
import { LIVE_STATUS } from "../types/schemas.js";

export function renderMemberListView(filters = { search: "", status: "all", gen: "all" }) {
  const allMembers = db.getMembers();
  const liveStates = db.getLiveStates();
  const prefs = auth.getPreferences();
  const favoriteMembers = prefs.favoriteMembers || [];

  // Filter logic
  let filtered = allMembers.filter(m => {
    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchNick = m.nickname.toLowerCase().includes(q);
      if (!matchName && !matchNick) return false;
    }

    // Status filter
    const isLive = liveStates[m.id]?.status === LIVE_STATUS.LIVE;
    if (filters.status === "live" && !isLive) return false;
    if (filters.status === "offline" && isLive) return false;

    // Generation filter
    if (filters.gen !== "all" && String(m.generation) !== String(filters.gen)) {
      return false;
    }

    return true;
  });

  // Alphabetical sort by nickname
  filtered.sort((a, b) => a.nickname.localeCompare(b.nickname));

  return `
    <div class="page-view">
      <!-- Editorial Page Header -->
      <div style="margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 18px;">
        <div style="font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px;">
          CURATED DIRECTORY
        </div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <h2 style="font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--dark-main); letter-spacing: -0.02em;">
            Katalog Member <span style="font-style: italic; font-weight: 400;">JKT48</span>
          </h2>
          <span style="font-size: 0.78rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: var(--radius-xs);">
            ${filtered.length} Member Ditampilkan
          </span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">
          Daftar lengkap 69 member resmi dari Member Inti hingga Siswi Pelatihan (Gen 12, 13 & 14).
        </p>
      </div>

      <!-- Search & Filters Container -->
      <div class="member-search-container">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="member-search-input" class="search-input" placeholder="Cari nama atau panggilan member..." value="${filters.search || ""}" />
        </div>

        <!-- Status Filter Pills -->
        <div class="filter-pills-row">
          <button class="filter-pill ${filters.status === "all" ? "active" : ""}" data-filter-type="status" data-filter-value="all">Semua Status</button>
          <button class="filter-pill ${filters.status === "live" ? "active" : ""}" data-filter-type="status" data-filter-value="live">🔴 Sedang Live</button>
          <button class="filter-pill ${filters.status === "offline" ? "active" : ""}" data-filter-type="status" data-filter-value="offline">⚪ Offline</button>
        </div>

        <!-- Generation Filter Pills -->
        <div class="filter-pills-row">
          <button class="filter-pill ${filters.gen === "all" ? "active" : ""}" data-filter-type="gen" data-filter-value="all">Semua Generasi</button>
          ${GENERATIONS.map(g => `
            <button class="filter-pill ${String(filters.gen) === String(g) ? "active" : ""}" data-filter-type="gen" data-filter-value="${g}">Gen ${g}</button>
          `).join("")}
        </div>
      </div>

      <!-- Member Grid -->
      <div class="member-catalog-grid">
        ${filtered.map(member => {
          const liveState = liveStates[member.id];
          const isOshi = favoriteMembers.includes(member.id);
          return renderMemberCard(member, liveState, isOshi);
        }).join("")}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state" style="margin-top: 24px;">
          <h4 class="empty-state-title" style="font-family: var(--font-serif);">Tidak ada member yang cocok</h4>
          <p class="empty-state-text">Coba ubah kata kunci pencarian atau reset filter generasi.</p>
        </div>
      ` : ""}
    </div>
  `;
}
