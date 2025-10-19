// Minimal SW για εγκατάσταση ως app — ΧΩΡΙΣ cache
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
// Δεν κρατάει τίποτα σε cache – όλα περνάνε στο δίκτυο
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
