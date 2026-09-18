// JKT48 Signature Red Login Splash Animation Component
// Features: Official JKT48 SVG Logo, Official Crimson Typography, Radiance Glow, Cinematic Shimmer, and Smooth Transition
import { OFFICIAL_JKT48_LOGO_SVG, OFFICIAL_JKT48_LOGO } from "../data/members.js";

export function playLoginAnimation(onComplete) {
  // Remove existing overlay if any
  const existing = document.getElementById("jkt48-login-splash");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "jkt48-login-splash";
  overlay.className = "jkt48-splash-screen";
  overlay.innerHTML = `
    <div class="jkt48-splash-backdrop"></div>
    <div class="jkt48-splash-container">
      <!-- Glow ambient background -->
      <div class="jkt48-ambient-glow"></div>
      
      <!-- Official JKT48 SVG Logo -->
      <div class="jkt48-splash-emblem-wrap">
        <img 
          src="${OFFICIAL_JKT48_LOGO_SVG}" 
          alt="JKT48 Official Emblem" 
          class="jkt48-splash-official-logo"
          onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
        />
      </div>

      <!-- Official JKT48 Brand Typography -->
      <div class="jkt48-logo-wrapper">
        <div class="jkt48-wordmark">
          <span class="jkt48-letter letter-j">J</span>
          <span class="jkt48-letter letter-k">K</span>
          <span class="jkt48-letter letter-t">T</span>
          <span class="jkt48-number number-4">4</span>
          <span class="jkt48-number number-8">8</span>
        </div>
        <div class="jkt48-logo-shimmer"></div>
      </div>

      <!-- Tagline & Badge -->
      <div class="jkt48-tagline-wrapper">
        <div class="jkt48-rule-line"></div>
        <span class="jkt48-tagline">REAL-TIME LIVE STREAM RADAR</span>
        <div class="jkt48-rule-line"></div>
      </div>

      <div class="jkt48-radar-badge">
        <span class="jkt48-radar-dot"></span>
        <span>MASUK DENGAN AKUN GOOGLE</span>
      </div>

      <!-- Loading Indicator -->
      <div class="jkt48-splash-loader">
        <div class="jkt48-progress-bar">
          <div class="jkt48-progress-fill"></div>
        </div>
        <span class="jkt48-status-text">Menyinkronkan Akun & Radar Live...</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger smooth exit after animation sequence (2 seconds)
  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 500);
  }, 2000);
}
