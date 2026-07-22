"use client";

import Link from "next/link";
import { Crown } from "lucide-react";

/**
 * Aviso mostrado quando o usuário bate um limite do plano gratuito.
 * A API responde 403 com `{ error, code: "PLAN_LIMIT" }` — este é o momento
 * de maior intenção de compra, então oferece o upgrade em vez de só dar erro.
 *
 * No app nativo o link some (`hide-in-app`): oferecer a compra dentro do app,
 * com a cobrança acontecendo fora do faturamento do Play, é motivo de remoção
 * da loja. A mensagem do limite continua aparecendo — o usuário precisa saber
 * por que a ação não funcionou.
 */
export function UpgradeNotice({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
        <Crown className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-900">{message}</p>
        <Link
          href="/pricing"
          className="hide-in-app inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-amber-900 underline underline-offset-2 hover:text-amber-700 transition-colors"
        >
          Ver planos Premium →
        </Link>
      </div>
    </div>
  );
}
