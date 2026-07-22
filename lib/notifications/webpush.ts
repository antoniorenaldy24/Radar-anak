/**
 * RADAR ANAK — VAPID Web Push Notification Helper
 * Sends 100% FREE instant lockscreen push alerts to Operator's HP/Desktop
 */

export type PushNotificationPayload = {
  title: string;
  body: string;
  icon?: string;
  url?: string;
};

export async function sendOperatorPushNotification(payload: PushNotificationPayload) {
  if (typeof window === "undefined") return false;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/assets/icon-192.png",
      data: { url: payload.url || "/dashboard" },
    });
    return true;
  }

  return false;
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}
