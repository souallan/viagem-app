// Detecção de plataforma nativa (Capacitor) sem depender do pacote em build-time.
// Dentro do WebView nativo, o Capacitor injeta `window.Capacitor` mesmo carregando
// conteúdo remoto (server.url). Na web, essas funções retornam web/false.

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
};

function cap(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

/** true quando o código está rodando dentro do app nativo (iOS/Android). */
export function isNativeApp(): boolean {
  const c = cap();
  return !!(c && typeof c.isNativePlatform === "function" && c.isNativePlatform());
}

/** Plataforma atual: "ios" | "android" | "web". */
export function getNativePlatform(): "ios" | "android" | "web" {
  const p = cap()?.getPlatform?.();
  return p === "ios" || p === "android" ? p : "web";
}
