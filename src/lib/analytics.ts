// Helper de eventos GA4. Antes só havia pageview; isto permite medir o funil
// (cadastro, viagem criada, newsletter, cliques de afiliado, CTA premium).
// Uso: trackEvent("trip_created", { destination }).

type GtagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
