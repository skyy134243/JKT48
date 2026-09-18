// Mobile Bottom Navigation Component - Explicit Sizing
import { db } from "../lib/database.js";
import { auth } from "../lib/auth.js";

export function renderBottomNav(activeRoute = "home") {
  const user = auth.getUser();
  const unreadCount = user ? db.getNotifications(user.uid).filter(n => !n.readAt).length : 0;

  const navItems = [
    {
      id: "home",
      label: "BERANDA",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      id: "members",
      label: "MEMBER",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
    },
    {
      id: "oshi",
      label: "OSHI",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    },
    {
      id: "notifications",
      label: "NOTIFIKASI",
      hasBadge: unreadCount > 0,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
    },
    {
      id: "profile",
      label: "PROFIL",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    }
  ];

  return `
    <nav class="mobile-bottom-nav">
      ${navItems.map(item => `
        <a href="#${item.id}" class="nav-item ${activeRoute === item.id ? "active" : ""}">
          ${item.icon}
          <span>${item.label}</span>
          ${item.hasBadge ? `<span class="nav-badge-dot"></span>` : ""}
        </a>
      `).join("")}
    </nav>
  `;
}