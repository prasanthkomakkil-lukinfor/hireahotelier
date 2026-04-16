// HireAHotelier Service Worker — PWA offline support
const CACHE    = 'hah-v1';
const OFFLINE  = '/offline.html';
const PRECACHE = ['/', '/jobs', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Network-first for API/Firebase calls
  if (url.hostname.includes('firebase') || url.pathname.startsWith('/api')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(OFFLINE));
    })
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  const opts = {
    body:    data.body   || 'You have a new update on HireAHotelier',
    icon:    '/favicon.svg',
    badge:   '/favicon.svg',
    tag:     data.tag    || 'hah-notification',
    data:    { url: data.url || '/' },
    actions: data.actions || [{ action: 'view', title: 'View Now' }],
  };
  e.waitUntil(self.registration.showNotification(data.title || 'HireAHotelier', opts));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(wins => {
    const existing = wins.find(w => w.url === url);
    return existing ? existing.focus() : clients.openWindow(url);
  }));
});
