"use client";

import { useEffect } from "react";

// Endpoints que precisam estar disponíveis SEM INTERNET durante a viagem:
// número de reserva do hotel, voo, roteiro do dia, documentos e o que foi pago.
const ROTAS_CRITICAS = [
  "accommodations",
  "transports",
  "activities",
  "documents",
  "expenses",
];

/**
 * Aquece o cache offline da viagem inteira.
 *
 * O service worker já guarda as respostas de `/api/*` (stale-while-revalidate),
 * mas só as que o usuário chegou a pedir — ou seja, só as abas que ele abriu.
 * Quem entrava na viagem e via apenas o roteiro ficava sem o número da reserva
 * justamente no aeroporto, que é quando não há rede.
 *
 * Abrir QUALQUER aba da viagem passa a buscar as demais em segundo plano, então
 * uma visita com internet deixa a viagem inteira disponível offline.
 *
 * Não afeta a renderização: dispara depois da montagem, ignora falhas e usa
 * `keepalive` para não ser cancelado se a pessoa navegar em seguida.
 */
export function TripOfflineWarm({ tripId }: { tripId: string }) {
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;

    const timer = setTimeout(() => {
      for (const rota of ROTAS_CRITICAS) {
        fetch(`/api/trips/${tripId}/${rota}`, { keepalive: true }).catch(() => {});
      }
    }, 1200); // deixa a tela atual carregar primeiro

    return () => clearTimeout(timer);
  }, [tripId]);

  return null;
}
