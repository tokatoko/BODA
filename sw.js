const CACHE_NAME = 'video-player-pwa-v1';
const VIDEO_CACHE = 'video-cache-v1';

// Files to cache immediately for UI to function offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './subtitles.vtt',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js'
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
  event.waitUntil(self.clients.claim());
});

// Fetch Interceptor
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return from app asset cache or video cache
      }
      
      // If not cached, fetch from network
      return fetch(event.request).catch(() => {
        // Fallback or handle offline failures gracefully
      });
    })
  );
});

