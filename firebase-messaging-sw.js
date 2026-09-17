// Service Worker — FCM Push & Notification Clicks
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Listen for push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.notification?.title || "JKT48 Live Radar";
    const options = {
      body: payload.notification?.body || "Member JKT48 sedang mulai siaran live!",
      icon: payload.notification?.icon || "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data: payload.data || {},
      requireInteraction: true
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Push notification parse failed:", err);
  }
});

// Click notification: directly open the official live URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const liveUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window or open official live URL
      for (const client of windowClients) {
        if (client.url === liveUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(liveUrl);
      }
    })
  );
});

// Local message bridge
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});
