// Web Push & Notification Manager
import { db } from "./database.js";
import { auth } from "./auth.js";

class NotificationManager {
  constructor() {
    this.permission = ("Notification" in window) ? Notification.permission : "unsupported";
  }

  isSupported() {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  getPermission() {
    return ("Notification" in window) ? Notification.permission : "unsupported";
  }

  async requestPermission() {
    if (!this.isSupported()) {
      return { status: "unsupported", message: "Browser tidak mendukung web push notification." };
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;

      if (result === "granted") {
        await this.registerDevice();
        return { status: "granted", message: "Notifikasi berhasil diaktifkan!" };
      } else {
        return { status: "denied", message: "Notifikasi browser ditolak. Kamu dapat mengaktifkannya via pengaturan browser." };
      }
    } catch (e) {
      return { status: "error", message: e.message };
    }
  }

  async registerDevice() {
    const user = auth.getUser();
    if (!user) return;

    let deviceId = localStorage.getItem("jkt48_deviceId");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("jkt48_deviceId", deviceId);
    }

    const browserInfo = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(browserInfo);

    const deviceData = {
      deviceId,
      uid: user.uid,
      pushToken: "fcm_mock_token_" + deviceId,
      platform: isMobile ? "mobile" : "desktop",
      browser: navigator.userAgentData?.brands?.[0]?.brand || "Browser",
      enabled: this.permission === "granted"
    };

    db.registerDevice(deviceData);
  }

  showLocalNotification(title, options = {}) {
    // 1. Always show slick In-App Toast Banner
    this.showInAppToast(title, options.body, options.data?.url);

    // 2. System Web Push / Desktop Notification (if permitted)
    if (this.permission === "granted") {
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            title,
            options
          });
        } else {
          new Notification(title, {
            icon: options.icon || "/icons/icon-192.png",
            ...options
          });
        }
      } catch (err) {
        console.warn("[NotificationManager] Desktop notification error:", err);
      }
    }
  }

  showInAppToast(title, body = "", liveUrl = null) {
    if (typeof document === "undefined") return;

    // Remove existing toast if any
    const existing = document.querySelector(".live-radar-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "live-radar-toast";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFF; animation: pulse 1s infinite; flex-shrink: 0;"></span>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 800; font-size: 0.9rem; color: #FFFFFF; line-height: 1.2;">${title}</div>
          ${body ? `<div style="font-size: 0.78rem; color: rgba(255,255,255,0.9); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${body}</div>` : ""}
        </div>
        ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="background: #FFFFFF; color: #E53935; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; text-decoration: none; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">Buka Live</a>` : ""}
        <button style="background: none; border: none; color: #FFFFFF; font-size: 1.1rem; cursor: pointer; padding: 0 4px; line-height: 1;" onclick="this.closest('.live-radar-toast').remove()">✕</button>
      </div>
    `;

    toast.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
      color: #FFFFFF;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(229, 57, 53, 0.45);
      max-width: 440px;
      width: calc(100% - 32px);
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, 7000);
  }
}

export const notificationManager = new NotificationManager();
