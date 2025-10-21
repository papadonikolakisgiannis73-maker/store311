// sw.js
const CACHE = 'store311-v4';

// Προ-αποθήκευση μόνο του app shell (όχι logo.png για να μην μένει παλιό)
const PRECACHE = [
'./',
'./index.html',
'./manifest.json'
];

self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
);
});

self.addEventListener('activate', (e) => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
).then(() => self.clients.claim())
);
});

self.addEventListener('fetch', (e) => {
const url = new URL(e.request.url);

// Δώσε ΠΡΟΤΕΡΑΙΟΤΗΤΑ στο δίκτυο για το logo & εικόνες
if (/logo\.(png|jpg|jpeg|svg)$/i.test(url.pathname)) {
e.respondWith(
fetch(e.request).then(r => r).catch(() => caches.match(e.request))
);
return;
}

// App shell: cache-first (offline)
if (url.origin === location.origin) {
e.respondWith(
caches.match(e.request).then(cached =>
cached || fetch(e.request).then((resp) => {
// προαιρετικό cache dynamic πόρων
const respClone = resp.clone();
caches.open(CACHE).then(c => c.put(e.request, respClone));
return resp;
}).catch(() => caches.match('./index.html'))
)
);
}
});
