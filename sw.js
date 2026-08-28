// Automatically determines the base path on GitHub Pages (e.g., "/workout-app/")
const GH_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);
const CACHE_NAME = 'workout-cache-v4';

const URLS_TO_CACHE = [
  GH_PATH,
  GH_PATH + 'index.html',
  GH_PATH + 'manifest.json',
  GH_PATH + 'apple-touch-icon.png',
  GH_PATH + 'header.png',
  GH_PATH + 'background_no_title.png'
];

// Install: Cache all core files securely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        URLS_TO_CACHE.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return offline main page fallback
        return caches.match(GH_PATH + 'index.html') || caches.match(GH_PATH);
      });
    })
  );
});
