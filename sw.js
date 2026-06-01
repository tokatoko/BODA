const CACHE_NAME = 'video-player-pwa-v2';

// Use strictly relative paths for GitHub Pages
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
        console.log('SW: Caching core app shell assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => console.error('SW: Cache addAll failed! Check file names:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

