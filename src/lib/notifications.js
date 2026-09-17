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
    if (this.permission === "granted") {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          options
        });
      } else {
        new Notification(title, {
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg",
          badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg",
          ...options
        });
      }
    }
  }
}

export const notificationManager = new NotificationManager();
