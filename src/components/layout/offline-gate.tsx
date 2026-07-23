"use client";

import { useEffect, useState } from "react";
import { WifiOff, Crown } from "lucide-react";
import { getPremiumCache, setPremiumCache } from "@/lib/premium-cache";

/**
 * Modo offline é recurso PREMIUM.
 *
 * - Com conexão: descobre o plano (/api/user/plan) e guarda no aparelho, para
 *   saber o status mesmo depois, sem rede.
 * - Sem conexão + Premium: mostra só a faixa "sem conexão" (o conteúdo em cache
 *   continua acessível).
 * - Sem conexão + Grátis: bloqueia com um aviso de que offline é Premium.
 *
 * Fica no layout da área logada, então cobre todas as telas do app.
 */
export function OfflineGate() {
  const [offline, setOffline] = useState(false);
  // Começa com o último status conhecido; null = nunca soubemos (não bloqueia à toa).
  const [premium, setPremium] = useState<boolean | null>(() => getPremiumCache());

  useEffect(() => {
    const atualizarRede = () => setOffline(!navigator.onLine);
    atualizarRede();
    window.addEventListener("online", atualizarRede);
    window.addEventListener("offline", atualizarRede);
    return () => {
      window.removeEventListener("online", atualizarRede);
      window.removeEventListener("offline", atualizarRede);
    };
  }, []);

  // Enquanto houver conexão, mantém o status do plano atualizado no aparelho.
  useEffect(() => {
    if (offline) return;
    fetch("/api/user/plan")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        const ativo = !d.planExpiresAt || new Date(d.planExpiresAt) > new Date();
        const isPrem = d.plan === "PREMIUM" && ativo;
        setPremium(isPrem);
        setPremiumCache(isPrem);
      })
      .catch(() => {});
  }, [offline]);

  if (!offline) return null;

  // Grátis (ou status desconhecido tratado como não-Premium) → bloqueia offline.
  if (premium !== true) {
    return (
      <div
        role="alertdialog"
        aria-label="Modo offline indisponível"
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 pt-safe pb-safe"
        style={{ background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)" }}
      >
        <div className="max-w-sm text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5">
            <WifiOff className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Você está sem conexão</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            O acesso offline às suas viagens, documentos e reservas é um recurso do
            <span className="text-amber-300 font-semibold"> Premium</span>. Assine para
            consultar tudo mesmo sem internet — ideal para o aeroporto e viagens ao exterior.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            Conecte-se à internet para continuar no plano gratuito.
          </div>
        </div>
      </div>
    );
  }

  // Premium offline → só a faixa de aviso; o conteúdo em cache segue disponível.
  return (
    <div
      role="status"
      className="fixed inset-x-0 z-50 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:bottom-0 print:hidden"
    >
      <div className="mx-auto max-w-md m-2 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 shadow-lg">
        <WifiOff className="h-4 w-4 text-amber-950 shrink-0" aria-hidden="true" />
        <p className="text-xs font-semibold text-amber-950 leading-snug">
          Sem conexão — mostrando as informações salvas da última vez.
        </p>
      </div>
    </div>
  );
}
