"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Só aparece enquanto não houver uma escolha explícita registrada.
    if (!getConsent()) setVisible(true);
  }, []);

  function acceptAll() {
    setConsent(true);
    setVisible(false);
  }

  function essentialsOnly() {
    setConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies e privacidade"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
    >
      <div className="relative rounded-2xl border border-white/10 shadow-2xl px-5 py-4 flex items-start gap-4"
        style={{ background: "rgba(14,21,32,0.97)", backdropFilter: "blur(12px)" }}>

        <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="h-4 w-4 text-violet-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Privacidade e cookies</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Usamos cookies essenciais para autenticação (sempre ativos) e, com o seu consentimento,
            cookies de análise (Google Analytics) e de diagnóstico de erros (Sentry) para melhorar o app.{" "}
            <Link href="/privacy" className="text-primary-400 hover:underline">
              Política de Privacidade (LGPD)
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={acceptAll}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}
            >
              Aceitar todos
            </button>
            <button
              onClick={essentialsOnly}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              Só essenciais
            </button>
          </div>
        </div>

        <button
          onClick={essentialsOnly}
          aria-label="Fechar (mantém apenas cookies essenciais)"
          className="text-slate-600 hover:text-slate-300 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
