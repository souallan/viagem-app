// Service worker do RoteiroApp.
// Estratégias:
//  - Navegação/assets same-origin: network-first com fallback a cache e /offline.
//  - GET /api/* (dados): stale-while-revalidate → offline mostra o último dado
//    conhecido (reservas, itinerário, documentos). /api/auth/* nunca é cacheado.
// Funciona na web (PWA) e dentro do app nativo (WebView carrega o https origin).
const CACHE = "roteiroapp-v3";
const API_CACHE = "roteiroapp-api-v1";
const OFFLINE = "/offline";
const STATIC = ["/", "/dashboard", "/manifest.json", OFFLINE];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE && k !== API_CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // API de dados → stale-while-revalidate (offline usa o cache). Auth sempre pela rede.
  if (url.pathname.startsWith("/api/")) {
    if (url.pathname.startsWith("/api/auth/")) return;
    e.respondWith(staleWhileRevalidate(e));
    return;
  }

  // Internos do Next (têm hash próprio) — deixa o navegador cuidar.
  if (url.pathname.startsWith("/_next/")) return;

  // Navegação e assets same-origin → network-first, fallback cache/offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) => cached ?? caches.match(OFFLINE))
      )
  );
});

async function staleWhileRevalidate(event) {
  const request = event.request;
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);

  if (cached) {
    // Serve o cache na hora e atualiza em segundo plano.
    event.waitUntil(networkPromise);
    return cached;
  }
  const fresh = await networkPromise;
  return (
    fresh ??
    new Response(JSON.stringify({ offline: true, error: "Sem conexão e sem dados em cache." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  );
}
