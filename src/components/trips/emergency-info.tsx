import { LifeBuoy, Phone, Building2, ShieldAlert } from "lucide-react";

/**
 * Card de emergência & segurança — informação anti-surpresa, útil em qualquer destino.
 * Server component (usa <details> nativo, sem JS). Aparece no resumo da viagem.
 */
export default function EmergencyInfo() {
  return (
    <details className="rounded-2xl border border-red-100 bg-red-50/50 overflow-hidden group">
      <summary className="flex items-center gap-2 p-4 cursor-pointer list-none select-none">
        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <LifeBuoy className="h-4 w-4 text-red-600" />
        </div>
        <span className="text-sm font-bold text-gray-900 flex-1">Em caso de emergência</span>
        <span className="text-xs text-red-500 group-open:hidden">ver</span>
        <span className="text-xs text-red-500 hidden group-open:inline">ocultar</span>
      </summary>

      <div className="px-4 pb-4 space-y-3 text-sm">
        <div className="flex items-start gap-2.5">
          <Phone className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-gray-700">
            <strong>112</strong> funciona na maior parte do mundo (padrão internacional, chama emergência
            mesmo sem crédito e, muitas vezes, sem chip/sinal da sua operadora).
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-gray-700">
            <strong>No Brasil:</strong> 190 (polícia) · 192 (SAMU) · 193 (bombeiros). Confirme os números
            locais do seu destino ao chegar.
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <Building2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-gray-700">
            Perdeu o passaporte ou passou por um problema sério no exterior? Procure a{" "}
            <a
              href="https://www.gov.br/mre/pt-br/embaixadas-e-consulados"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-semibold underline underline-offset-2"
            >
              embaixada ou consulado do Brasil
            </a>{" "}
            mais próximo.
          </p>
        </div>
        <p className="text-xs text-gray-500 pt-1">
          Dica: guarde uma cópia (física e digital) do passaporte e mantenha o roteiro salvo para acesso offline.
        </p>
      </div>
    </details>
  );
}
