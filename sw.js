self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open("aerotrack-cache-v1").then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
          })
        );
      })
    )
  );
});
