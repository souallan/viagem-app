"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

/**
 * Selo de plano na sidebar. Lê o plano fresco do banco (/api/user/plan),
 * então reflete upgrades na hora, sem depender do JWT da sessão.
 */
export function PremiumBadge() {
  const [premium, setPremium] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/user/plan")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setPremium(Boolean(d.isPremium));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Nada enquanto carrega (evita "piscar" o estado errado)
  if (premium === null) return null;

  if (premium) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-yellow-500/10">
        <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        <span className="text-xs font-bold text-amber-300 tracking-wide">Premium</span>
        <span className="ml-auto text-[9px] font-semibold text-amber-500/70 uppercase tracking-wider">Ativo</span>
      </div>
    );
  }

  return (
    <Link
      href="/pricing"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 hover:border-primary-500/30 hover:bg-white/5 transition-all group"
    >
      <Sparkles className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary-400 shrink-0 transition-colors" />
      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Seja Premium</span>
      <span className="ml-auto text-slate-600 group-hover:text-primary-400 transition-colors">→</span>
    </Link>
  );
}
