// Client SPA Router & Event Orchestrator
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { notificationManager } from "../lib/notifications.js";
import { liveMonitor } from "../services/liveMonitor.js";
import { renderHeader } from "../components/Header.js";
import { renderSidebar } from "../components/Sidebar.js";
import { renderBottomNav } from "../components/BottomNav.js";
import { renderHomeView } from "./HomeView.js";
import { renderLandingView } from "./LandingView.js";
import { renderMemberListView } from "./MemberListView.js";
import { renderMemberProfileModal } from "./MemberProfileModal.js";
import { renderOshiView } from "./OshiView.js";
import { renderNotificationView } from "./NotificationView.js";
import { renderSettingsView } from "./SettingsView.js";
import { renderProfileView } from "./ProfileView.js";
import { renderAdminView } from "./AdminView.js";
import { renderOnboardingModal } from "./OnboardingModal.js";
import { playLoginAnimation } from "../components/LoginSplashAnimation.js";
import { OSHI_PRIORITY } from "../types/schemas.js";
import { Storage, Session } from "../lib/utils.js";

class AppRouter {
  constructor() {
    this.container = document.getElementById("app-root");
    if (!this.container) {
      console.warn("[AppRouter] Element #app-root not yet ready, retrying...");
      return;
    }
    this.memberFilters = { search: "", status: "all", gen: "all" };
    this.onboardingState = { step: 1, selectedOshis: [] };
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for URL hash changes
    window.addEventListener("hashchange", () => this.route());
    
    // Listen for Auth changes
    auth.onAuthStateChanged(() => this.route());

    // Listen for live radar engine updates
    liveMonitor.onUpdate(() => {
      const route = this.getRoute();
      if (route === "home" || route === "admin" || route === "members" || route === "oshi") {
        this.renderView(route);
      }
    });

    // Theme initialization
    this.initTheme();

    // Initial routing
    this.route();

    // Start automatic live monitoring (every 60 seconds)
    this.startLiveMonitoring();
  }

  getRoute() {
    const hash = window.location.hash.replace(/^#/, "");
    return hash || "home";
  }

  initTheme() {
    try {
      const saved = Storage.get("theme", "light");
      if (document.documentElement) {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }

  toggleTheme() {
    try {
      if (!document.documentElement) return;
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      Storage.set("theme", next);
    } catch {}
  }

  startLiveMonitoring() {
    setTimeout(async () => {
      try {
        await liveMonitor.executeCycle();
      } catch (err) {
        console.warn("[LiveRadar] Initial check error:", err.message);
      }
    }, 3000);

    this._liveCheckInterval = setInterval(async () => {
      try {
        await liveMonitor.executeCycle();
      } catch (err) {
        console.warn("[LiveRadar] Periodic check error:", err.message);
      }
    }, 60000);
  }

  navigateTo(targetRoute) {
    if (window.location.hash !== "#" + targetRoute) {
      window.location.hash = "#" + targetRoute;
    } else {
      this.route();
    }
  }

  route() {
    const route = this.getRoute();
    const user = auth.getUser();

    if (route === "login" && !user) {
      this.container.innerHTML = renderLandingView();
      this.bindLandingEvents();
      this.currentRoute = "login";
      return;
    }

    this.renderAppShell(route);
  }

  getViewHtml(route) {
    switch (route) {
      case "members":
        return renderMemberListView(this.memberFilters);
      case "oshi":
        return renderOshiView();
      case "notifications":
        return renderNotificationView();
      case "settings":
        return renderSettingsView();
      case "profile":
        return renderProfileView();
      case "admin":
        return renderAdminView();
      case "home":
      default:
        return renderHomeView();
    }
  }

  renderAppShell(route) {
    try {
      this.currentRoute = route;
      const viewHtml = this.getViewHtml(route);

      this.container.innerHTML = `
        <div class="app-container">
          ${renderHeader(route)}
          <div class="main-wrapper">
            <main id="view-mount">${viewHtml}</main>
          </div>
          ${renderSidebar(route)}
          ${renderBottomNav(route)}
        </div>
        <div id="modal-mount"></div>
      `;

      this.bindEvents(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[AppRouter] renderAppShell error:", err);
      this.container.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; font-family: sans-serif; background: #FFF;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/JKT48.svg" alt="JKT48" style="height: 64px; margin-bottom: 20px;" />
          <h2 style="color: #E53935; font-size: 1.3rem; margin-bottom: 8px;">Gagal Memuat Halaman</h2>
          <p style="color: #666666; font-size: 0.9rem; max-width: 440px; margin-bottom: 20px;">${err.message || "Terjadi kendala saat memproses tampilan."}</p>
          <button onclick="window.location.hash='#home'; window.location.reload();" style="background: #E53935; color: #FFFFFF; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 600; cursor: pointer;">
            Muat Ulang Halaman
          </button>
        </div>
      `;
    }
  }

  renderView(route) {
    const mount = document.getElementById("view-mount");
    if (!mount) {
      this.renderAppShell(route);
      return;
    }

    mount.innerHTML = this.getViewHtml(route);
    this.updateActiveNavs(route);
    this.bindEvents(route);
  }

  updateActiveNavs(route) {
    document.querySelectorAll(".provider-nav-link").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });

    document.querySelectorAll(".sidebar-link").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });

    document.querySelectorAll(".mobile-bottom-nav .nav-item").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  bindLandingEvents() {
    const btnGoogle = document.getElementById("btn-landing-google-login");
    const btnHeaderLogin = document.getElementById("btn-landing-login-header");
    const btnGuest = document.getElementById("btn-landing-guest-explore");

    const doLogin = async () => {
      playLoginAnimation(async () => {
        await auth.signInWithGoogle();
        this.onboardingState = { step: 1, selectedOshis: [] };
        window.location.hash = "#home";
      });
    };

    if (btnGoogle) btnGoogle.addEventListener("click", doLogin);
    if (btnHeaderLogin) btnHeaderLogin.addEventListener("click", doLogin);

    if (btnGuest) {
      btnGuest.addEventListener("click", () => {
        playLoginAnimation(() => {
          Session.set("guest_mode", "true");
          window.location.hash = "#home";
          this.route();
        });
      });
    }
  }

  bindEvents(route) {
    // Universal Navigation Links: Immediate responsive click handling
    document.querySelectorAll(".provider-nav-link, .sidebar-link, .mobile-bottom-nav .nav-item").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = href.replace(/^#/, "") || "home";
          this.navigateTo(target);
        }
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Google Login button in Header
    const btnGoogleHeader = document.getElementById("btn-header-google-login");
    if (btnGoogleHeader) {
      btnGoogleHeader.addEventListener("click", () => {
        playLoginAnimation(async () => {
          await auth.signInWithGoogle();
          window.location.hash = "#home";
          this.route();
        });
      });
    }

    // Logout button in Header
    const btnLogoutHeader = document.getElementById("btn-header-logout");
    if (btnLogoutHeader) {
      btnLogoutHeader.addEventListener("click", async () => {
        await auth.signOut();
        window.location.hash = "#home";
        this.route();
      });
    }

    // Member Catalog Events
    if (route === "members") {
      const searchInput = document.getElementById("member-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.memberFilters.search = e.target.value;
          this.renderView("members");
        });
      }

      const btnClearSearch = document.getElementById("btn-clear-search");
      if (btnClearSearch) {
        btnClearSearch.addEventListener("click", () => {
          this.memberFilters.search = "";
          this.renderView("members");
        });
      }

      const filterBtns = document.querySelectorAll(".filter-column-btn, .filter-pill");
      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.filterType;
          const val = btn.dataset.filterValue;
          this.memberFilters[type] = val;
          this.renderView("members");
        });
      });

      // Member Card Click (opens modal)
      const memberCards = document.querySelectorAll(".member-catalog-card");
      memberCards.forEach(card => {
        card.addEventListener("click", (e) => {
          if (e.target.closest(".oshi-star-btn")) {
            e.stopPropagation();
            const memberId = card.dataset.memberId;
            this.toggleOshi(memberId);
            return;
          }
          const memberId = card.dataset.memberId;
          this.openMemberModal(memberId);
        });
      });
    }

    // Oshi Management Events
    if (route === "oshi") {
      document.querySelectorAll("[data-action='move-up']").forEach(btn => {
        btn.addEventListener("click", () => this.reorderOshi(btn.dataset.memberId, -1));
      });
      document.querySelectorAll("[data-action='move-down']").forEach(btn => {
        btn.addEventListener("click", () => this.reorderOshi(btn.dataset.memberId, 1));
      });
      document.querySelectorAll("[data-action='remove-oshi']").forEach(btn => {
        btn.addEventListener("click", () => this.toggleOshi(btn.dataset.memberId));
      });
    }

    // Settings Events
    if (route === "settings") {
      const btnReq = document.getElementById("btn-request-permission");
      if (btnReq) {
        btnReq.addEventListener("click", async () => {
          const res = await notificationManager.requestPermission();
          alert(res.message);
          this.renderView("settings");
        });
      }

      const prefAll = document.getElementById("pref-notify-all");
      if (prefAll) prefAll.addEventListener("change", (e) => auth.updatePreferences({ notifyAllMembers: e.target.checked }));

      const prefIdn = document.getElementById("pref-notify-idn");
      if (prefIdn) prefIdn.addEventListener("change", (e) => auth.updatePreferences({ notifyIDN: e.target.checked }));

      const prefShowroom = document.getElementById("pref-notify-showroom");
      if (prefShowroom) prefShowroom.addEventListener("change", (e) => auth.updatePreferences({ notifySHOWROOM: e.target.checked }));

      const prefQuiet = document.getElementById("pref-quiet-enabled");
      if (prefQuiet) {
        prefQuiet.addEventListener("change", (e) => {
          const prefs = auth.getPreferences();
          auth.updatePreferences({
            quietHours: { ...prefs.quietHours, enabled: e.target.checked }
          });
        });
      }
    }

    // Profile Events
    if (route === "profile") {
      const btnLogout = document.getElementById("btn-logout");
      if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
          await auth.signOut();
          Session.remove("guest_mode");
          window.location.hash = "#home";
        });
      }
    }

    // Admin Events
    if (route === "admin") {
      document.querySelectorAll(".btn-simulate-live").forEach(btn => {
        btn.addEventListener("click", () => {
          const memberId = btn.dataset.member;
          const platform = btn.dataset.platform;
          liveMonitor.simulateLive(memberId, platform);
        });
      });

      const btnEndAll = document.getElementById("btn-simulate-end-all");
      if (btnEndAll) {
        btnEndAll.addEventListener("click", () => {
          liveMonitor.simulateEndLive();
        });
      }

      const btnManualCheck = document.getElementById("btn-manual-check");
      if (btnManualCheck) {
        btnManualCheck.addEventListener("click", async () => {
          btnManualCheck.disabled = true;
          btnManualCheck.textContent = "Memeriksa...";
          try {
            await liveMonitor.executeCycle();
            btnManualCheck.textContent = "Selesai!";
          } catch (err) {
            btnManualCheck.textContent = "Gagal: " + err.message;
          }
          setTimeout(() => {
            btnManualCheck.disabled = false;
            btnManualCheck.textContent = "Manual Check (Real API)";
          }, 2000);
        });
      }
    }
  }

  toggleOshi(memberId) {
    const prefs = auth.getPreferences();
    let favorites = [...(prefs.favoriteMembers || [])];
    const priorityMap = { ...(prefs.priorityMembers || {}) };

    if (favorites.includes(memberId)) {
      favorites = favorites.filter(id => id !== memberId);
      delete priorityMap[memberId];
    } else {
      favorites.push(memberId);
      priorityMap[memberId] = favorites.length === 1 ? OSHI_PRIORITY.HIGH : OSHI_PRIORITY.NORMAL;
    }

    auth.updatePreferences({
      favoriteMembers: favorites,
      priorityMembers: priorityMap
    });

    this.renderView(this.getRoute());
  }

  reorderOshi(memberId, direction) {
    const prefs = auth.getPreferences();
    const favorites = [...(prefs.favoriteMembers || [])];
    const currentIndex = favorites.indexOf(memberId);
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= favorites.length) return;

    const temp = favorites[currentIndex];
    favorites[currentIndex] = favorites[targetIndex];
    favorites[targetIndex] = temp;

    const priorityMap = {};
    favorites.forEach((id, idx) => {
      priorityMap[id] = idx === 0 ? OSHI_PRIORITY.HIGH : (idx === 1 ? OSHI_PRIORITY.NORMAL : OSHI_PRIORITY.LOW);
    });

    auth.updatePreferences({
      favoriteMembers: favorites,
      priorityMembers: priorityMap
    });

    this.renderView("oshi");
  }

  openMemberModal(memberId) {
    const modalMount = document.getElementById("modal-mount");
    if (!modalMount) return;

    modalMount.innerHTML = renderMemberProfileModal(memberId);

    const closeBtn = document.getElementById("modal-close-btn");
    const overlay = document.getElementById("member-profile-modal-overlay");
    const toggleOshiBtn = document.getElementById("modal-toggle-oshi-btn");

    const closeModal = () => { modalMount.innerHTML = ""; };
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    if (toggleOshiBtn) {
      toggleOshiBtn.addEventListener("click", () => {
        this.toggleOshi(memberId);
        this.openMemberModal(memberId);
      });
    }
  }
}

function startApp() {
  if (!window.appRouter) {
    try {
      window.appRouter = new AppRouter();
    } catch (err) {
      console.error("[AppRouter] Fatal initialization error:", err);
      const root = document.getElementById("app-root");
      if (root) {
        root.innerHTML = `
          <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/JKT48.svg" alt="JKT48" style="height: 64px; margin-bottom: 20px;" />
            <h2 style="color: #E53935; font-size: 1.3rem; margin-bottom: 8px;">Gagal Memuat Aplikasi</h2>
            <p style="color: #666666; font-size: 0.9rem; max-width: 400px; margin-bottom: 20px;">${err.message || "Terjadi kendala saat memuat direktori."}</p>
            <button onclick="window.location.reload()" style="background: #E53935; color: #FFFFFF; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 600; cursor: pointer;">
              Muat Ulang Halaman
            </button>
          </div>
        `;
      }
    }
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  startApp();
} else {
  document.addEventListener("DOMContentLoaded", startApp);
  window.addEventListener("load", startApp);
}