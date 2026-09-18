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

class AppRouter {
  constructor() {
    this.container = document.getElementById("app-root");
    if (!this.container) {
      console.warn("[AppRouter] Element #app-root not yet ready, retrying...");
      return;
    }
    this.memberFilters = { search: "", status: "all", gen: "all" };
    this.onboardingState = { step: 1, selectedOshis: [] };
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
      if (route === "home" || route === "admin" || route === "members") {
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
    const saved = localStorage.getItem("jkt48_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("jkt48_theme", next);
  }

  startLiveMonitoring() {
    // Run first check after 3 seconds (let UI settle)
    setTimeout(async () => {
      console.log("[LiveRadar] 🚀 Running initial live check...");
      try {
        await liveMonitor.executeCycle();
        console.log("[LiveRadar] ✅ Initial live check complete");
      } catch (err) {
        console.warn("[LiveRadar] ❌ Initial check failed:", err.message);
      }
    }, 3000);

    // Then check every 60 seconds
    this._liveCheckInterval = setInterval(async () => {
      console.log("[LiveRadar] 🔄 Periodic live check...");
      try {
        await liveMonitor.executeCycle();
      } catch (err) {
        console.warn("[LiveRadar] Periodic check error:", err.message);
      }
    }, 60000);
  }

  route() {
    const route = this.getRoute();
    const user = auth.getUser();

    // If user explicitly navigates to #login and is not logged in, show landing
    if (route === "login" && !user) {
      this.container.innerHTML = renderLandingView();
      this.bindLandingEvents();
      return;
    }

    // Direct entry to web app (Provider Store architecture)
    this.renderAppShell(route);
  }

  renderAppShell(route) {
    try {
      let viewHtml = "";
      switch (route) {
        case "members":
          viewHtml = renderMemberListView(this.memberFilters);
          break;
        case "oshi":
          viewHtml = renderOshiView();
          break;
        case "notifications":
          viewHtml = renderNotificationView();
          break;
        case "settings":
          viewHtml = renderSettingsView();
          break;
        case "profile":
          viewHtml = renderProfileView();
          break;
        case "admin":
          viewHtml = renderAdminView();
          break;
        case "home":
        default:
          viewHtml = renderHomeView();
          break;
      }

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
    if (!mount) return;

    if (route === "home") mount.innerHTML = renderHomeView();
    else if (route === "members") mount.innerHTML = renderMemberListView(this.memberFilters);
    else if (route === "admin") mount.innerHTML = renderAdminView();

    this.bindEvents(route);
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
          sessionStorage.setItem("jkt48_guest_mode", "true");
          window.location.hash = "#home";
          this.route();
        });
      });
    }
  }

  showOnboarding() {
    const modalMount = document.getElementById("modal-mount");
    if (!modalMount) return;

    modalMount.innerHTML = renderOnboardingModal(this.onboardingState.step, this.onboardingState.selectedOshis);
    this.bindOnboardingEvents();
  }

  bindOnboardingEvents() {
    const nextButtons = document.querySelectorAll("#btn-onboarding-next, #btn-onboarding-skip");
    nextButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const nextStep = parseInt(btn.dataset.step, 10);
        this.onboardingState.step = nextStep;
        this.showOnboarding();
      });
    });

    // Oshi selection in step 2
    const oshiItems = document.querySelectorAll(".onboarding-oshi-item");
    oshiItems.forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.memberId;
        const exists = this.onboardingState.selectedOshis.includes(id);
        if (exists) {
          this.onboardingState.selectedOshis = this.onboardingState.selectedOshis.filter(mId => mId !== id);
        } else {
          this.onboardingState.selectedOshis.push(id);
        }
        this.showOnboarding();
      });
    });

    // Request push permission in step 4
    const btnReqPerm = document.getElementById("btn-onboarding-request-perm");
    if (btnReqPerm) {
      btnReqPerm.addEventListener("click", async () => {
        btnReqPerm.disabled = true;
        btnReqPerm.textContent = "Meminta izin...";
        await notificationManager.requestPermission();
        this.finishOnboarding();
      });
    }

    // Finish onboarding
    const btnFinish = document.getElementById("btn-onboarding-finish");
    if (btnFinish) {
      btnFinish.addEventListener("click", () => this.finishOnboarding());
    }
  }

  finishOnboarding() {
    // Save selected Oshis
    const currentPrefs = auth.getPreferences();
    const priorityMap = { ...currentPrefs.priorityMembers };
    this.onboardingState.selectedOshis.forEach((id, idx) => {
      priorityMap[id] = idx === 0 ? OSHI_PRIORITY.HIGH : OSHI_PRIORITY.NORMAL;
    });

    auth.updatePreferences({
      favoriteMembers: this.onboardingState.selectedOshis,
      priorityMembers: priorityMap
    });

    auth.completeOnboarding();
    document.getElementById("modal-mount").innerHTML = "";
    window.location.hash = "#home";
  }

  bindEvents(route) {
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
          // If clicked the star button directly
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
          sessionStorage.removeItem("jkt48_guest_mode");
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
          btnManualCheck.textContent = "⏳ Memeriksa...";
          try {
            await liveMonitor.executeCycle();
            btnManualCheck.textContent = "✅ Selesai!";
          } catch (err) {
            btnManualCheck.textContent = "❌ Gagal: " + err.message;
          }
          setTimeout(() => {
            btnManualCheck.disabled = false;
            btnManualCheck.textContent = "🔄 Manual Check (Real API)";
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

    this.route();
  }

  reorderOshi(memberId, direction) {
    const prefs = auth.getPreferences();
    const favorites = [...(prefs.favoriteMembers || [])];
    const currentIndex = favorites.indexOf(memberId);
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= favorites.length) return;

    // Swap positions
    const temp = favorites[currentIndex];
    favorites[currentIndex] = favorites[targetIndex];
    favorites[targetIndex] = temp;

    // Reassign priorities
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

// Bulletproof instant initialization
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
