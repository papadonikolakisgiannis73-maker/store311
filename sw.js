const CACHE = 'store311-v4';
const ASSETS = ['./','./index.html','./manifest.json','./logo.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
  );
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(request).then(r => r || fetch(request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(request, copy)).catch(()=>{});
      return resp;
    })).catch(()=>caches.match('./index.html'))
  );
});
