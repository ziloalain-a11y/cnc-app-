"use client";

import { useState, useEffect } from "react";

export default function NotificationButton() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    // Check if previously dismissed
    const wasDismissed = localStorage.getItem("cnc-notif-dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  // Don't show if already granted, denied, or dismissed
  if (
    permission === "granted" ||
    permission === "denied" ||
    dismissed ||
    typeof window === "undefined" ||
    !("Notification" in window)
  ) {
    return null;
  }

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { requestNotificationPermission } = await import("@/lib/firebase");
      const token = await requestNotificationPermission();
      if (token) {
        setPermission("granted");
        // TODO: envoyer le token à votre backend pour cibler cet utilisateur
        console.log("FCM Token:", token);
      } else {
        setPermission(Notification.permission);
      }
    } catch (error) {
      console.error("Erreur notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("cnc-notif-dismissed", "1");
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-[#8B0000] text-white rounded-xl shadow-2xl p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Restez informé</p>
          <p className="text-red-200 text-xs mt-0.5">
            Activez les notifications pour recevoir les dernières actualités de
            la RCA.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-white text-[#8B0000] text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {loading ? "Activation…" : "Activer"}
            </button>
            <button
              onClick={handleDismiss}
              className="text-red-200 text-xs px-3 py-2 hover:text-white transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
