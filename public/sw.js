// Service worker do RoteiroApp.
// Estratégias:
//  - /_next/static/* e assets estáticos hasheados: cache-first (imutáveis).
//  - Navegação/assets same-origin: network-first com fallback a cache e /offline.
//  - GET /api/* (dados): stale-while-revalidate → offline mostra o último dado
//    conhecido (reservas, itinerário, documentos). /api/auth/* nunca é cacheado.
// Funciona na web (PWA) e dentro do app nativo (WebView carrega o https origin).
const CACHE = "roteiroapp-v5";
const API_CACHE = "roteiroapp-api-v1";
const ASSET_CACHE = "roteiroapp-assets-v1";
const OFFLINE = "/offline";
const STATIC = ["/", "/dashboard", "/manifest.json", OFFLINE];

// Extensões de asset estático que podem ser servidas cache-first com segurança.
const ASSET_EXT = /\.(?:js|css|woff2?|ttf|otf|png|jpe?g|svg|gif|webp|avif|ico)$/i;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  const keep = [CACHE, API_CACHE, ASSET_CACHE];
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))
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

  // Chunks do Next e assets estáticos hasheados → cache-first (imutáveis).
  // Sem isso, um reload/navegação offline falha ao carregar o JS da página.
  if (url.pathname.startsWith("/_next/static/") || ASSET_EXT.test(url.pathname)) {
    e.respondWith(cacheFirst(e));
    return;
  }

  // RSC/data do Next (payloads de navegação client-side) → stale-while-revalidate.
  // Antes ia direto pra rede e não era cacheado: num cold start OFFLINE, navegar
  // para uma sub-aba da viagem que não estava em memória falhava ao buscar o RSC
  // e mostrava "Algo deu errado" (visto no teste real, na tela de Documentos).
  // Cacheando o RSC, o prefetch feito online (TripOfflineWarm) sobrevive ao
  // reinício e a navegação offline funciona.
  if (url.pathname.startsWith("/_next/")) {
    e.respondWith(staleWhileRevalidate(e));
    return;
  }

  // Navegação e demais same-origin → network-first, fallback cache/offline.
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

// Cache-first: serve do cache se houver; senão busca na rede e guarda.
async function cacheFirst(event) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  try {
    const res = await fetch(event.request);
    if (res.ok) cache.put(event.request, res.clone());
    return res;
  } catch {
    // Asset não cacheado e sem rede: devolve erro silencioso (não quebra a página).
    return cached ?? Response.error();
  }
}

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
