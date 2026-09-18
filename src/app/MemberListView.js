// Member Catalog View — Provider Store Editorial Lookbook
// Column-based top navigation filters, Red & White palette, Curated 67 Members
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

    // Status & Team filter
    const isLive = liveStates[m.id]?.status === LIVE_STATUS.LIVE;
    if (filters.status === "live" && !isLive) return false;
    if (filters.status === "offline" && isLive) return false;
    if (filters.status === "inti" && m.teamStatus !== "Inti") return false;
    if (filters.status === "trainee" && m.teamStatus !== "Trainee") return false;

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
      <!-- Editorial Page Header (Provider Store Australia Style) -->
      <div class="catalog-page-header">
        <div class="catalog-eyebrow">
          DIREKTORI RESMI MEMBER
        </div>
        <div class="catalog-title-row">
          <h2 class="catalog-title">
            Katalog Member <span class="catalog-brand-tag">JKT48</span>
          </h2>
          <span class="catalog-counter-badge">
            ${filtered.length} Member Ditampilkan
          </span>
        </div>
        <p class="catalog-desc">
          Daftar lengkap 67 member aktif JKT48 (Gen 3 hingga Gen 14) dari Member Inti hingga Siswi Pelatihan.
        </p>
      </div>

      <!-- Top Column Filters Container (Provider Store Filter Columns) -->
      <div class="member-catalog-top-filters">
        <!-- Search Input Bar -->
        <div class="catalog-search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            id="member-search-input" 
            class="catalog-search-input" 
            placeholder="Cari nama lengkap atau nama panggilan member..." 
            value="${filters.search || ""}" 
          />
          ${filters.search ? `
            <button id="btn-clear-search" class="btn-clear-search" title="Hapus pencarian">×</button>
          ` : ""}
        </div>

        <!-- Filter Column Section 1: Status & Tim -->
        <div class="filter-category-block">
          <span class="filter-block-label">KATEGORI & STATUS:</span>
          <div class="filter-columns-row">
            <button class="filter-column-btn ${filters.status === "all" ? "active" : ""}" data-filter-type="status" data-filter-value="all">
              Semua Member
            </button>
            <button class="filter-column-btn ${filters.status === "live" ? "active" : ""}" data-filter-type="status" data-filter-value="live">
              🔴 Sedang Live
            </button>
            <button class="filter-column-btn ${filters.status === "offline" ? "active" : ""}" data-filter-type="status" data-filter-value="offline">
              ⚪ Offline
            </button>
            <button class="filter-column-btn ${filters.status === "inti" ? "active" : ""}" data-filter-type="status" data-filter-value="inti">
              Member Inti
            </button>
            <button class="filter-column-btn ${filters.status === "trainee" ? "active" : ""}" data-filter-type="status" data-filter-value="trainee">
              Trainee (Siswi Pelatihan)
            </button>
          </div>
        </div>

        <!-- Filter Column Section 2: Generasi Berderet Berkolom -->
        <div class="filter-category-block">
          <span class="filter-block-label">PILIHAN GENERASI:</span>
          <div class="filter-columns-row filter-gen-columns">
            <button class="filter-column-btn ${filters.gen === "all" ? "active" : ""}" data-filter-type="gen" data-filter-value="all">
              Semua Gen
            </button>
            ${GENERATIONS.map(g => `
              <button class="filter-column-btn ${String(filters.gen) === String(g) ? "active" : ""}" data-filter-type="gen" data-filter-value="${g}">
                Gen ${g}
              </button>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Member Grid (Provider Store Clean Gallery) -->
      <div class="member-catalog-grid">
        ${filtered.map(member => {
          const liveState = liveStates[member.id];
          const isOshi = favoriteMembers.includes(member.id);
          return renderMemberCard(member, liveState, isOshi);
        }).join("")}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state" style="margin-top: 32px;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <h4 class="empty-state-title">Tidak ada member yang cocok</h4>
          <p class="empty-state-text">Coba ubah kata kunci pencarian atau pilih tombol filter lainnya.</p>
        </div>
      ` : ""}
    </div>
  `;
}
