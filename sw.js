const CACHE_NAME = 'kdrama-shell-cache-v1';
const VIDEO_CACHE_NAME = 'kdrama-video-cache-v1';

const ASSETS_TO_CACHE = [
  'index.html',
  'register.js',
  'manifest.json',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdn.plyr.io/3.7.8/plyr.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Poppins:wght@300;400;600&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== VIDEO_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept Request to Serve Cached Copies Instantly Offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Special Handling for Big MP4 Stream Files
  if (requestUrl.pathname.endsWith('.mp4') || event.request.url.includes('archive.org')) {
    event.respondWith(
      caches.open(VIDEO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Return downloaded video copy
          }
          // If not downloaded yet, fallback fetch directly across remote network
          return fetch(event.request);
        });
      })
    );
  } else {
    // Normal asset handling logic
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
