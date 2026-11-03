/* =============================================
   Fashion by Hanin – Service Worker (Client Preview Mode)
   ============================================= */

const CACHE_NAME = 'fashion-hanin-preview-v12';

// ===== INSTALL =====
self.addEventListener('install', event => {
  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH (Network First) =====
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
