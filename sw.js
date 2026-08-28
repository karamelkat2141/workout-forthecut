const CACHE_NAME = 'workout-app-v1';

// List every file your app uses here
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './background_no_title.png',
  './header.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@700;800;900&display=swap'
  // Add paths to your individual GIFs here if you want them pre-cached offline:
  // './gifs/barbell_hip_thrust.gif',
  // './gifs/incline_db_press.gif'
];

// Install Event: Save assets to device storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
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

// Fetch Event: Serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback for uncached requests while offline
        return caches.match('./index.html');
      });
    })
  );
});