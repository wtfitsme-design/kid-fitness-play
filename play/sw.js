'use strict';
const prefix = 'kid-playfield-assets-';
const current = prefix + 'guide-2';
const base = self.registration.scope;
const local = name => new URL(name, base).href;
const shell = ['index.html', 'play.css?guide=2', 'app.js?guide=2', 'games.js?guide=2', 'compass.svg'].map(local);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(current).then(cache => cache.addAll(shell)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(prefix) && k !== current).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET' || !req.url.startsWith(base)) return;
  const url = new URL(req.url);
  const asset = (url.href.startsWith(local('assets/')) || url.href.startsWith(local('steps/'))) && url.pathname.endsWith('.webp');
  const navigation = req.mode === 'navigate' && [local(''),local('index.html')].includes(url.origin+url.pathname);
  if(!asset && !navigation && !shell.includes(url.href)) return;
  const key = navigation ? local('index.html') : req;
  event.respondWith((async () => {
    let cache;
    try { cache = await caches.open(current); } catch { return fetch(req); }
    if(asset) {
      const saved = await cache.match(key);
      if(saved) return saved;
    }
    try {
      const response = await fetch(req);
      if(response.ok && response.type === 'basic') {
        try { await cache.put(key,response.clone()); } catch { /* Storage may be full. */ }
      }
      return response;
    } catch (err) {
      const saved = await cache.match(key);
      if(saved) return saved;
      throw err;
    }
  })());
});
