const CACHE_NAME = 'video-player-pwa-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './subtitles.vtt',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Direct asset fetch fallback to make video chunking works cleanly offline
      return cachedResponse || fetch(event.request);
    })
  );
});

