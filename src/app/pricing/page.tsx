"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Plane, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const FREE_FEATURES = [
  "Até 3 viagens ativas",
  "Até 20 atividades por viagem",
  "Orçamento e controle de gastos",
  "Lista de malas inteligente",
  "Documentos e alertas de validade",
  "Diário de viagem",
  "1 rota na comunidade",
  "Compartilhamento de viagem",
];

const PREMIUM_FEATURES = [
  "Viagens ilimitadas",
  "Atividades ilimitadas por viagem",
  "Roteiros da comunidade ilimitados",
  "Experiências ilimitadas",
  "Exportar roteiro em PDF",
  "Suporte prioritário por email",
  "Acesso antecipado a novidades",
  "Badge de apoiador no perfil",
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}>
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">RoteiroApp</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            Planos simples e transparentes
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Comece grátis. Faça upgrade quando precisar de mais.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                !annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Anual
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">-33%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Gratuito</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-5xl font-black text-gray-900">R$0</span>
                <span className="text-gray-400 mb-2">/sempre</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Para quem está começando a organizar viagens.</p>
            </div>

            <Link
              href="/register"
              className="block w-full text-center py-3 px-6 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all mb-8"
            >
              Começar grátis
            </Link>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="relative border-2 border-blue-500 rounded-2xl p-8 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                <Star className="h-3 w-3 fill-current" /> MAIS POPULAR
              </span>
            </div>

            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Premium</span>
              <div className="mt-2 flex items-end gap-1">
                {annual ? (
                  <>
                    <span className="text-5xl font-black text-gray-900">R$13</span>
                    <span className="text-2xl font-black text-gray-900">,25</span>
                    <span className="text-gray-400 mb-2">/mês</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-black text-gray-900">R$19</span>
                    <span className="text-2xl font-black text-gray-900">,90</span>
                    <span className="text-gray-400 mb-2">/mês</span>
                  </>
                )}
              </div>
              {annual && (
                <p className="text-sm text-gray-500 mt-1">
                  Cobrado <strong className="text-gray-700">R$159/ano</strong>
                  <span className="ml-2 text-green-600 font-semibold">Economize R$80</span>
                </p>
              )}
              {!annual && (
                <p className="text-sm text-gray-500 mt-2">Cobrado mensalmente. Cancele quando quiser.</p>
              )}
            </div>

            <button
              className="w-full text-center py-3 px-6 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg mb-8"
              style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}
              onClick={() => { trackEvent("upgrade_click", { plan: annual ? "annual" : "monthly" }); alert("Em breve! Pagamentos via Stripe chegando."); }}
            >
              <Zap className="inline h-4 w-4 mr-2" />
              Assinar Premium
            </button>

            <ul className="space-y-3">
              <li className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Tudo do gratuito, mais:
              </li>
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Perguntas frequentes</h2>

          {[
            {
              q: "Posso cancelar quando quiser?",
              a: "Sim. Cancele a qualquer momento pelo app. Você mantém acesso Premium até o fim do período pago.",
            },
            {
              q: "Meus dados ficam salvos se eu cancelar?",
              a: "Sim. Suas viagens e dados são preservados. Você passa a operar sob os limites do plano gratuito.",
            },
            {
              q: "Quais formas de pagamento são aceitas?",
              a: "Cartão de crédito e débito, PIX e boleto (em breve). Processamento seguro via Stripe.",
            },
            {
              q: "Existe plano para equipes?",
              a: "Ainda não, mas está no nosso roadmap. Entre em contato se tiver interesse.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-6">
              <p className="font-semibold text-gray-900 mb-2">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-gray-400 space-x-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">Início</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Termos</Link>
          <a href="mailto:contato@roteiroapp.com" className="hover:text-gray-600 transition-colors">Contato</a>
        </div>

      </div>
    </div>
  );
}
