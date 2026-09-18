// JKT48 Signature Red Login Splash Animation Component
// Features: Official JKT48 Crimson Typography, Radiance Glow, Cinematic Shimmer, and Smooth Transition

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
        <span class="jkt48-tagline">INDONESIA'S FIRST IDOL GROUP</span>
        <div class="jkt48-rule-line"></div>
      </div>

      <div class="jkt48-radar-badge">
        <span class="jkt48-radar-dot"></span>
        <span>LIVE RADAR SYSTEM</span>
      </div>

      <!-- Loading Indicator -->
      <div class="jkt48-splash-loader">
        <div class="jkt48-progress-bar">
          <div class="jkt48-progress-fill"></div>
        </div>
        <span class="jkt48-status-text">Menyinkronkan Siaran Member...</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger smooth exit after animation sequence (2.2 seconds)
  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 600);
  }, 2200);
}
