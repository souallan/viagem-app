"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";
import { Plane } from "lucide-react";

// Destinos da barra de baixo: são as telas "raiz", onde não existe voltar.
const ROOT_ROUTES = ["/dashboard", "/routes", "/tips", "/experiences", "/profile"];

export function AppShell({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isRoot = ROOT_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Barra lateral — SÓ desktop ──
          O drawer mobile foi removido: ele repetia exatamente as mesmas 5 rotas
          da barra de baixo (mesma ordem, mesmos rótulos), o que é padrão de site
          responsivo, não de app. Idioma e painel admin, que só existiam nele,
          foram para o /profile; logout e privacidade já estavam lá. */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 print:hidden">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 print:ml-0 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden print:hidden sticky top-0 z-30 flex items-center gap-3 px-4 min-h-[3.5rem] pt-safe border-b border-white/5"
          style={{ background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)" }}
        >
          {/* Nas telas de profundidade, o espaço antes ocupado pelo hambúrguer
              vira a seta de voltar — um app mostra o caminho de volta, não a
              marca repetida em toda tela. */}
          {isRoot ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)" }}
              >
                <Plane className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">RoteiroApp</span>
            </Link>
          ) : (
            <button
              onClick={() => router.back()}
              className="h-11 w-11 -ml-2 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>

        {/* Espaço inferior no mobile para o conteúdo não ficar sob a bottom nav */}
        <div className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>

        {/* Bottom navigation — só mobile */}
        <BottomNav />
      </div>
    </div>
  );
}
