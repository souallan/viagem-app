"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Compass, UserCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

type Viagem = { id: string; status: string; startDate: string | null };

/**
 * Barra de navegação inferior — só no mobile (md:hidden).
 * Respeita a safe-area inferior (home indicator) via .pb-safe.
 *
 * Estrutura: Viagens · Hoje · [+] · Explorar · Perfil.
 * Antes eram 5 destinos com TRÊS de conteúdo (Rotas, Dicas, Relatos) e nenhum
 * lugar para a viagem em andamento, que é a razão de existir do app. Os três
 * viraram "Explorar" (as páginas continuam nos mesmos endereços), abrindo espaço
 * para "Hoje" e para a ação de criar viagem.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [viagens, setViagens] = useState<Viagem[]>([]);

  // Uma única busca por montagem do shell (persiste nas navegações client-side)
  // e o service worker já serve do cache quando não há rede.
  useEffect(() => {
    let vivo = true;
    fetch("/api/trips")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (vivo && Array.isArray(d)) setViagens(d); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  /**
   * Para onde "Hoje" leva, em ordem de utilidade: viagem acontecendo agora →
   * próxima a começar → viagem mais recente → criar a primeira. Assim o botão
   * nunca é um beco sem saída.
   */
  const destinoHoje = (() => {
    if (viagens.length === 0) return "/trips/new";
    const emAndamento = viagens.find((v) => v.status === "IN_PROGRESS");
    if (emAndamento) return `/trips/${emAndamento.id}/itinerary`;

    const futuras = viagens
      .filter((v) => (v.status === "PLANNING" || v.status === "CONFIRMED") && v.startDate)
      .sort((a, b) => a.startDate!.localeCompare(b.startDate!));
    if (futuras.length > 0) return `/trips/${futuras[0].id}/itinerary`;

    return `/trips/${viagens[0].id}/itinerary`;
  })();

  const items = [
    { href: "/dashboard", label: t.nav.myTrips, icon: LayoutDashboard, match: (p: string) => p === "/dashboard" },
    { href: destinoHoje,  label: "Hoje",        icon: CalendarClock,   match: (p: string) => p.startsWith("/trips/") },
    { href: "/explorar",  label: "Explorar",    icon: Compass,         match: (p: string) => p.startsWith("/explorar") || p.startsWith("/routes") || p.startsWith("/tips") || p.startsWith("/experiences") },
    { href: "/profile",   label: t.sidebar.profile, icon: UserCircle2, match: (p: string) => p.startsWith("/profile") },
  ];

  // O botão de ação fica no meio, o ponto mais fácil de alcançar com o polegar.
  const meio = 2;

  return (
    <nav
      className="md:hidden print:hidden fixed bottom-0 inset-x-0 z-40 pb-safe border-t border-white/8"
      style={{ background: "linear-gradient(0deg, #0E1520 0%, #111827 100%)" }}
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch justify-around h-14">
        {items.map((item, i) => {
          const ativo = item.match(pathname);
          return (
            <div key={item.label} className="contents">
              {i === meio && (
                <Link
                  href="/trips/new"
                  className="flex-1 flex items-center justify-center min-w-0"
                  aria-label="Criar viagem"
                >
                  <span className="w-12 h-12 -mt-5 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/40 border-4 border-[#111827]"
                    style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)" }}>
                    <Plus className="h-5 w-5 text-white" />
                  </span>
                </Link>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 transition-colors",
                  ativo ? "text-primary-400" : "text-slate-400 active:text-slate-200"
                )}
                aria-current={ativo ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-medium leading-none truncate max-w-[4.5rem] px-0.5">
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
