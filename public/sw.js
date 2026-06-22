/* Minimal service worker — enables "Add to Home Screen" / installability.
   Intentionally network-first (no aggressive caching) so the app is never
   served stale and always updates on the next load. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
