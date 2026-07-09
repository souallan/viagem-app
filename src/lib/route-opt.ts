// Otimização de trajeto por distância (economizar deslocamento no dia).
// Nearest-neighbor + 2-opt sobre coordenadas (haversine). Puro e testável.

export type LatLng = { lat: number; lng: number };

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Distância total percorrendo os pontos na ordem dada (km). */
export function pathDistanceKm(points: LatLng[]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversineKm(points[i - 1], points[i]);
  return d;
}

/**
 * Ordem otimizada dos índices (nearest-neighbor + 2-opt), começando de `start`.
 * Bom para N pequeno (poucas atividades por dia). Retorna a permutação dos índices.
 */
export function optimizeOrder(points: LatLng[], start = 0): number[] {
  const n = points.length;
  if (n <= 2) return points.map((_, i) => i);

  const dist = (a: number, b: number) => haversineKm(points[a], points[b]);

  // 1) Nearest-neighbor
  const visited = new Array(n).fill(false);
  const order: number[] = [start];
  visited[start] = true;
  for (let k = 1; k < n; k++) {
    const last = order[order.length - 1];
    let best = -1, bestD = Infinity;
    for (let j = 0; j < n; j++) {
      if (visited[j]) continue;
      const d = dist(last, j);
      if (d < bestD) { bestD = d; best = j; }
    }
    order.push(best);
    visited[best] = true;
  }

  // 2) 2-opt (melhora local)
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = order[i - 1], b = order[i], c = order[j], d = j + 1 < n ? order[j + 1] : -1;
        const before = dist(a, b) + (d >= 0 ? dist(c, d) : 0);
        const after = dist(a, c) + (d >= 0 ? dist(b, d) : 0);
        if (after + 1e-9 < before) {
          let lo = i, hi = j;
          while (lo < hi) { const t = order[lo]; order[lo] = order[hi]; order[hi] = t; lo++; hi--; }
          improved = true;
        }
      }
    }
  }

  return order;
}
