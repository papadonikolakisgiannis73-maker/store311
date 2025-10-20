// Store311 basic service worker – offline cache
const CACHE_NAME = "store311-cache-v1";
const urlsToCache = ["./", "./index.html", "./logo.jpg"];

self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
);
});

self.addEventListener("fetch", (event) => {
event.respondWith(
caches.match(event.request).then((response) => response || fetch(event.request))
);
});
