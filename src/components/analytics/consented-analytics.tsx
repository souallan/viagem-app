"use client";

import { useEffect, useState } from "react";
import { hasAnalyticsConsent, CONSENT_EVENT } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Carrega o Google Analytics 4 APENAS depois do consentimento (LGPD).
 * Sem aceite, nenhum script de análise é injetado. Ao aceitar no banner,
 * o evento `lgpd-consent-change` dispara o carregamento na hora (sem reload).
 */
export function ConsentedAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const check = () => {
      if (hasAnalyticsConsent()) setEnabled(true);
    };
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  useEffect(() => {
    if (!enabled || !GA_ID || window.gtag) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }, [enabled]);

  return null;
}
