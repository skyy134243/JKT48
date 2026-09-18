import fs from "node:fs";

const files = [
  "src/types/schemas.js",
  "src/lib/utils.js",
  "src/data/members.js",
  "src/lib/auth.js",
  "src/lib/database.js",
  "src/services/idnProvider.js",
  "src/services/showroomProvider.js",
  "src/services/notificationRouter.js",
  "src/lib/notifications.js",
  "src/services/liveMonitor.js",
  "src/components/LiveCard.js",
  "src/components/Header.js",
  "src/components/Sidebar.js",
  "src/components/BottomNav.js",
  "src/components/LoginSplashAnimation.js",
  "src/app/HomeView.js",
  "src/app/LandingView.js",
  "src/app/MemberListView.js",
  "src/app/MemberProfileModal.js",
  "src/app/OshiView.js",
  "src/app/NotificationView.js",
  "src/app/SettingsView.js",
  "src/app/ProfileView.js",
  "src/app/AdminView.js",
  "src/app/OnboardingModal.js",
  "src/app/router.js"
];

let bundleCode = `// JKT48 Live Radar — Standalone Universal Bundle
// Built automatically for seamless offline, file://, and http:// execution
(function(window, document) {
  "use strict";

`;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");

  // Remove import statements (single or multi-line)
  content = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");

  // Replace export { ... }
  content = content.replace(/export\s*\{[^}]*\};?/g, "");

  // Replace export default ...
  content = content.replace(/export\s+default\s+/g, "");

  // Replace export const / export function / export class / export let / export var
  content = content.replace(/export\s+(const|let|var|function|class)\s+/g, "$1 ");

  bundleCode += `\n/* --- File: ${file} --- */\n` + content + "\n";
}

bundleCode += `
  // Expose global entry point
  window.JKT48_BUNDLE_LOADED = true;
  if (typeof startApp === "function") {
    startApp();
  }
})(typeof window !== "undefined" ? window : globalThis, typeof document !== "undefined" ? document : {});
`;

fs.writeFileSync("bundle.js", bundleCode, "utf-8");
fs.writeFileSync("dist/bundle.js", bundleCode, "utf-8");
console.log(`bundle.js written successfully! Size: ${bundleCode.length} bytes`);
