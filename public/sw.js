/**
 * Schnitzel Schmiede Festival Cash Register — Service Worker
 * Versioned app-shell caching for offline availability.
 * SAFE UPDATE RULE: Never forces a page reload during an active checkout or cart session.
 * IndexedDB data is strictly excluded from SW HTTP cache.
 */

const CACHE_NAME = "schnitzel-cash-register-v1";
const STATIC_ASSETS = [
  "/festival/schnitzel-schmiede",
  "/manifest.json",
];

// Install Event — Cache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event — Clean up old caches safely
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event — Network First with Offline Cache Fallback for Static Assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Exclude API, Supabase, and non-GET requests from SW cache
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/api") ||
    url.hostname.includes("supabase")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("/festival/schnitzel-schmiede");
          }
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
      })
  );
});
