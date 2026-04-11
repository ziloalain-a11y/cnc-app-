importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Remplacer ces valeurs par votre configuration Firebase réelle
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: self.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: self.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: self.FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: self.FIREBASE_APP_ID || "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Message reçu en arrière-plan:", payload);

  const notificationTitle =
    payload.notification?.title || "CNC - Corbeau News Centrafrique";
  const notificationOptions = {
    body: payload.notification?.body || "Nouvelle actualité disponible",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: payload.data?.articleId || "cnc-news",
    data: {
      url: payload.data?.url || "/",
      articleId: payload.data?.articleId,
    },
    actions: [
      { action: "open", title: "Lire l'article" },
      { action: "close", title: "Fermer" },
    ],
    requireInteraction: false,
    silent: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
