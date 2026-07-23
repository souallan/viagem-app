"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * "Voltar" das páginas legais (Privacidade / Termos).
 *
 * Antes era um link fixo para "/", então o usuário LOGADO que abrisse a política
 * pelo perfil era despejado na landing de marketing — e ainda via um "Entrar na
 * conta", já estando logado. Agora volta para de onde veio; o link para a home
 * fica só como saída de quem chegou direto (sem histórico), por busca ou link.
 */
export function LegalBackLink() {
  const router = useRouter();

  function voltar() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <button
      onClick={voltar}
      className="inline-flex items-center gap-2 min-h-[44px] text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </button>
  );
}
