// Notification Router & Anti-Spam Dispatcher
import { auth } from "../lib/auth.js";
import { db } from "../lib/database.js";
import { notificationManager } from "../lib/notifications.js";
import { OSHI_PRIORITY, PLATFORMS } from "../types/schemas.js";

export function routeLiveNotification(member, liveEvent) {
  const user = auth.getUser();
  const uid = user ? user.uid : "guest_user";
  const userNotificationEnabled = user ? user.notificationEnabled : true;
  const prefs = auth.getPreferences();

  // Rule 1: User auth & notification switch check
  if (!userNotificationEnabled) {
    return { dispatched: false, reason: "User notifications disabled" };
  }

  // Rule 2: Platform check
  if (liveEvent.platform === PLATFORMS.IDN && !prefs.notifyIDN) {
    return { dispatched: false, reason: "IDN Live notifications disabled by user" };
  }
  if (liveEvent.platform === PLATFORMS.SHOWROOM && !prefs.notifySHOWROOM) {
    return { dispatched: false, reason: "SHOWROOM notifications disabled by user" };
  }

  // Rule 3: Member & Oshi Priority Evaluation
  const isOshi = (prefs.favoriteMembers || []).includes(member.id);
  const oshiPriority = prefs.priorityMembers?.[member.id] || OSHI_PRIORITY.NORMAL;

  let priority = OSHI_PRIORITY.NORMAL;

  if (isOshi) {
    if (oshiPriority === OSHI_PRIORITY.OFF) {
      return { dispatched: false, reason: "Oshi notification muted" };
    }
    priority = oshiPriority;
  } else if (!prefs.notifyAllMembers) {
    return { dispatched: false, reason: "Not an Oshi and notifyAllMembers is false" };
  }

  // Rule 4: Quiet Hours Check
  if (prefs.quietHours?.enabled) {
    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const { start, end, allowHighPriority } = prefs.quietHours;

    const inQuietHours = start <= end
      ? (currentHourMin >= start && currentHourMin <= end)
      : (currentHourMin >= start || currentHourMin <= end);

    if (inQuietHours) {
      // If quiet hours active, check if high priority bypass is permitted
      if (!(allowHighPriority && priority === OSHI_PRIORITY.HIGH)) {
        // Record in notification center but suppress push
        db.addNotification({
          notificationId: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          uid,
          eventId: liveEvent.eventId,
          memberId: member.id,
          memberName: member.nickname,
          memberPhoto: member.photoUrl,
          platform: liveEvent.platform,
          liveUrl: liveEvent.liveUrl,
          startedAt: liveEvent.startedAt,
          priority,
          suppressedByQuietHours: true
        });
        return { dispatched: false, reason: "Suppressed by Quiet Hours" };
      }
    }
  }

  // Rule 5: Anti-Spam / Deduplication (uid + eventId)
  const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const notifRecord = {
    notificationId,
    uid,
    eventId: liveEvent.eventId,
    memberId: member.id,
    memberName: member.nickname,
    memberPhoto: member.photoUrl,
    platform: liveEvent.platform,
    liveUrl: liveEvent.liveUrl,
    startedAt: liveEvent.startedAt,
    priority,
    suppressedByQuietHours: false
  };

  const added = db.addNotification(notifRecord);
  if (!added) {
    return { dispatched: false, reason: "Duplicate notification prevented" };
  }

  // Trigger Web Push
  const platformName = liveEvent.platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const title = isOshi ? `⭐ ${member.nickname.toUpperCase()} LIVE` : `🔴 ${member.nickname.toUpperCase()} LIVE`;
  const body = `${member.nickname} baru saja mulai live di ${platformName}. Ketuk untuk menonton!`;

  notificationManager.showLocalNotification(title, {
    body,
    icon: member.photoUrl,
    data: {
      url: liveEvent.liveUrl,
      eventId: liveEvent.eventId,
      platform: liveEvent.platform
    }
  });

  return { dispatched: true, notificationId };
}
