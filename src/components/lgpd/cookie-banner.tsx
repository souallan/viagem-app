"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, X } from "lucide-react";

const CONSENT_KEY = "lgpd-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, at: new Date().toISOString() }));
    setVisible(false);
  }

  function dismiss() {
    // Dismiss without saving — will reappear next session
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
            Usamos apenas cookies essenciais para autenticação. Nenhum rastreamento ou publicidade.{" "}
            <Link href="/privacy" className="text-primary-400 hover:underline" onClick={dismiss}>
              Política de Privacidade (LGPD)
            </Link>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={accept}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}
            >
              Entendido
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>

        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="text-slate-600 hover:text-slate-300 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
