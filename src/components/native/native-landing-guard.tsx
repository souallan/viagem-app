"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isNativeApp } from "@/lib/native";

/**
 * Dentro do app nativo, a landing page não deve aparecer: é conteúdo de
 * marketing ("conheça o RoteiroApp", planos, FAQ) para quem ainda não instalou.
 * Ver isso dentro do app é o que faz parecer "um site numa moldura".
 *
 * O `server.url` do Capacitor já abre em /dashboard, então este componente é a
 * rede de segurança para quando o usuário chega na raiz por outro caminho —
 * tocando no logo, num link interno ou pelo botão voltar do Android.
 *
 * Enquanto redireciona, renderiza um fundo sólido no lugar da landing para não
 * piscar conteúdo de marketing.
 */
export function NativeLandingGuard() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isNativeApp()) return;
    setRedirecting(true);
    router.replace("/dashboard");
  }, [router]);

  if (!redirecting) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)" }}
      aria-hidden="true"
    />
  );
}
