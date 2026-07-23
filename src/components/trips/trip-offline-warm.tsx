"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Endpoints que precisam estar disponíveis SEM INTERNET durante a viagem:
// número de reserva do hotel, voo, roteiro do dia, documentos e o que foi pago.
const ROTAS_API = [
  "accommodations",
  "transports",
  "activities",
  "documents",
  "expenses",
];

// Sub-páginas da viagem. Cada uma é um segmento de rota próprio no App Router,
// com seu próprio bundle JS — navegar offline para uma que nunca foi aberta
// falhava ao carregar o chunk e mostrava "Algo deu errado" (visto no teste real
// justamente na tela de Documentos, a mais crítica no aeroporto).
const SUBPAGINAS = [
  "itinerary",
  "accommodation",
  "transport",
  "documents",
  "budget",
  "map",
  "packing",
  "summary",
];

/**
 * Aquece o cache offline da viagem inteira.
 *
 * São DUAS camadas, e faltava a segunda:
 * 1. DADOS — as respostas de `/api/*` (o service worker faz stale-while-revalidate).
 * 2. PÁGINAS — o JS/RSC de cada sub-aba, via `router.prefetch`. Sem isto, abrir
 *    offline uma aba que nunca foi visitada quebrava, porque o bundle dela não
 *    estava em cache.
 *
 * Assim, uma única visita à viagem com internet deixa TODAS as abas disponíveis
 * offline, não só as que a pessoa abriu.
 *
 * Não afeta a renderização: dispara após a montagem, ignora falhas e usa
 * `keepalive` nos fetches para não serem cancelados numa navegação seguinte.
 */
export function TripOfflineWarm({ tripId }: { tripId: string }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;

    const timer = setTimeout(() => {
      // 1) Dados da API
      for (const rota of ROTAS_API) {
        fetch(`/api/trips/${tripId}/${rota}`, { keepalive: true }).catch(() => {});
      }
      // 2) Bundles das páginas (prefetch do Next: baixa RSC + chunks JS, que o
      //    service worker então guarda cache-first).
      for (const pagina of SUBPAGINAS) {
        try {
          router.prefetch(`/trips/${tripId}/${pagina}`);
        } catch {
          /* prefetch é best-effort */
        }
      }
    }, 1200); // deixa a tela atual carregar primeiro

    return () => clearTimeout(timer);
  }, [tripId, router]);

  return null;
}
