// CNC — Corbeau News Centrafrique — Service Worker
const STATIC_CACHE = "cnc-static-v2";
const API_CACHE = "cnc-api-v2";

// Resources to pre-cache on install
const PRECACHE_URLS = ["/", "/offline", "/manifest.json"];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // WordPress API: Network First, fallback to cache
  if (url.hostname === "corbeaunews-centrafrique.org" && url.pathname.includes("/wp-json/")) {
    event.respondWith(networkFirst(event.request, API_CACHE, 5000));
    return;
  }

  // WordPress images: Cache First
  if (
    url.hostname === "corbeaunews-centrafrique.org" &&
    /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(event.request, API_CACHE));
    return;
  }

  // Next.js image optimizer (/_next/image?url=...): never intercept.
  // Thumbnails are re-optimized on every deploy (new source domains, new
  // fallback logic in getFeaturedImageUrl); caching this path risks serving
  // a stale/broken response from before an image fix indefinitely.
  if (url.pathname.startsWith("/_next/image")) {
    return;
  }

  // Next.js pages & assets: Network First with cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("/offline") || new Response("Hors ligne", { status: 503 }))
      )
    );
    return;
  }

  // Static assets (_next/static): Cache First (immutable)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }
});

// ── Strategies ─────────────────────────────────────────────────────────────
async function networkFirst(request, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({ error: "Hors ligne" }), {
      headers: { "Content-Type": "application/json" },
      status: 503,
    });
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("", { status: 404 });
  }
}

// ── Push Notifications ─────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { notification: { title: "CNC", body: event.data.text() } };
  }

  const title = data.notification?.title || "CNC — Corbeau News Centrafrique";
  const options = {
    body: data.notification?.body || "Nouvelle actualité disponible",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.data?.articleId || "cnc-news",
    data: { url: data.data?.url || "/" },
    actions: [
      { action: "open", title: "Lire" },
      { action: "close", title: "Fermer" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
