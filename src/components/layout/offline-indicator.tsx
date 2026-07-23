"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Faixa fixa avisando que o app está sem conexão.
 *
 * O service worker serve os últimos dados conhecidos quando falta rede, o que é
 * ótimo — mas sem aviso a pessoa não distingue "informação atual" de "informação
 * da última vez que abri", e pode confiar num preço ou horário desatualizado.
 *
 * Fica acima da barra de navegação inferior e respeita a área de gestos.
 * Complementa a classe `is-offline` que o NativeBootstrap põe no <html> (aquela
 * só existe dentro do app; os eventos abaixo funcionam também na web).
 */
export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const atualizar = () => setOffline(!navigator.onLine);
    atualizar();
    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);
    return () => {
      window.removeEventListener("online", atualizar);
      window.removeEventListener("offline", atualizar);
    };
  }, []);

  if (!offline) return null;

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
