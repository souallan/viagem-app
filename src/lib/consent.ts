/**
 * Consentimento de cookies/rastreamento (LGPD arts. 7º/8º).
 *
 * Estado guardado no localStorage. `analytics` cobre Google Analytics 4 e a
 * gravação de sessão do Sentry — que só podem carregar APÓS aceite explícito.
 * Os cookies essenciais (autenticação/segurança) não dependem de consentimento.
 *
 * Quem consome:
 *  - `ConsentedAnalytics` (carrega o GA4 só com consentimento)
 *  - `sentry.client.config.ts` (liga o replay só com consentimento)
 *  - `CookieBanner` (grava a escolha e dispara o evento)
 */

export const CONSENT_KEY = "lgpd-consent";
export const CONSENT_EVENT = "lgpd-consent-change";

export type ConsentValue = { essential: true; analytics: boolean; at: string };

/** Lê o consentimento salvo. Retorna null se ainda não houver escolha (ou formato antigo). */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentValue>;
    // Formato antigo ({ accepted: true }) não tinha escolha granular → pede de novo.
    if (typeof parsed.analytics !== "boolean") return null;
    return { essential: true, analytics: parsed.analytics, at: parsed.at ?? "" };
  } catch {
    return null;
  }
}

/** true somente quando o usuário aceitou explicitamente análise/diagnóstico. */
export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

/** Grava a escolha e avisa os ouvintes (para o GA carregar na hora, sem reload). */
export function setConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;
  const value: ConsentValue = { essential: true, analytics, at: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    // storage indisponível (modo privado): segue só em memória via evento.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
