"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Plane } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { isNativeApp } from "@/lib/native";
import { trackEvent } from "@/lib/analytics";

// Rotas públicas de marketing onde o banner faz sentido (topo de funil).
const PUBLIC_PREFIXES = ["/blog", "/pricing", "/roteiro", "/posts", "/app"];

/**
 * Smart banner "baixe o app" — mobile web, dispensável.
 * Fica oculto enquanto as URLs das lojas não estiverem em SITE_CONFIG.app,
 * dentro do app nativo, ou fora das páginas de marketing.
 */
export function AppBanner() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const { android, ios } = SITE_CONFIG.app;
    if (!android && !ios) return;                 // sem loja configurada
    if (isNativeApp()) return;                     // já está no app
    if (localStorage.getItem("app-banner-dismissed")) return;
    const isPublic = pathname === "/" || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
    if (!isPublic) return;
    if (window.matchMedia("(max-width: 767px)").matches) setShow(true);
  }, [pathname]);

  if (!show) return null;

  const link = SITE_CONFIG.app.android || SITE_CONFIG.app.ios;
  function dismiss() {
    localStorage.setItem("app-banner-dismissed", "1");
    setShow(false);
  }

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shrink-0">
          <Plane className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">Baixe o app RoteiroApp</p>
          <p className="text-xs text-gray-500 truncate">Offline, lembretes e sua viagem na mão.</p>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("app_install_click", { source: "smart_banner" })}
          className="text-xs font-bold px-3.5 py-2 rounded-lg bg-primary-600 text-white shrink-0 hover:bg-primary-700 transition-colors"
        >
          Baixar
        </a>
        <button onClick={dismiss} aria-label="Dispensar" className="p-1.5 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
