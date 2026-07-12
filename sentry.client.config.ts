import * as Sentry from "@sentry/nextjs";

// A gravação de sessão (Session Replay) registra a navegação do usuário e só pode
// rodar com consentimento (LGPD). Lemos a escolha direto do localStorage — este
// arquivo inicializa antes do React, então mantemos a leitura sem dependências.
function analyticsConsent(): boolean {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("lgpd-consent") : null;
    return raw ? JSON.parse(raw).analytics === true : false;
  } catch {
    return false;
  }
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const consented = analyticsConsent();
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    // Sem consentimento: captura de erros continua (interesse legítimo/estabilidade),
    // mas nenhuma gravação de sessão é feita.
    replaysOnErrorSampleRate: consented ? 1.0 : 0,
    replaysSessionSampleRate: consented ? 0.05 : 0,
    integrations: consented ? [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })] : [],
  });
}
