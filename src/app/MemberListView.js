// Member Catalog View
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
      <div style="margin-bottom: 18px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Member JKT48</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">Daftar lengkap member aktif JKT48.</p>
      </div>

      <!-- Search & Filters Container -->
      <div class="member-search-container">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="member-search-input" class="search-input" placeholder="Cari nama member..." value="${filters.search || ""}" />
        </div>

        <!-- Status Filter Pills -->
        <div class="filter-pills-row">
          <button class="filter-pill ${filters.status === "all" ? "active" : ""}" data-filter-type="status" data-filter-value="all">Semua</button>
          <button class="filter-pill ${filters.status === "live" ? "active" : ""}" data-filter-type="status" data-filter-value="live">🔴 Live</button>
          <button class="filter-pill ${filters.status === "offline" ? "active" : ""}" data-filter-type="status" data-filter-value="offline">⚪ Offline</button>
        </div>

        <!-- Generation Filter Pills -->
        <div class="filter-pills-row">
          <button class="filter-pill ${filters.gen === "all" ? "active" : ""}" data-filter-type="gen" data-filter-value="all">Semua Gen</button>
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
        <div class="empty-state" style="margin-top: 20px;">
          <p class="empty-state-text">Tidak ada member yang cocok dengan filter pencarian.</p>
        </div>
      ` : ""}
    </div>
  `;
}
