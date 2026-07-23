"use client";
import { toast } from "@/lib/toast";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Plane, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const FREE_FEATURES = [
  "1 viagem ativa",
  "Até 20 atividades por viagem",
  "1 roteiro na comunidade",
  "Orçamento e controle de gastos",
  "Lista de malas inteligente",
  "Documentos e alertas de validade",
  "Diário de viagem",
  "Compartilhamento de viagem",
  "Imprimir / salvar roteiro em PDF",
];

const PREMIUM_FEATURES = [
  "Viagens ilimitadas",
  "Atividades ilimitadas por viagem",
  "Roteiros da comunidade ilimitados",
  "Publicar relatos de viagem (ilimitados)",
  "Acesso offline (viagens, documentos, reservas)",
  "Suporte prioritário por email",
  "Acesso antecipado a novidades",
  "Badge de apoiador no perfil",
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    trackEvent("upgrade_click", { plan: annual ? "annual" : "monthly" });
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: annual ? "annual" : "monthly" }),
      });
      if (res.status === 401) {
        window.location.href = "/login?callbackUrl=/pricing";
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast(data.error || "Pagamentos chegando em breve. Tente novamente mais tarde.");
    } catch {
      toast("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white bg-vibe-dark overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle bg-grid-48" aria-hidden />
      <div className="fixed top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none bg-glow-blue" aria-hidden />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cta-blue shadow-primary-md">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">RoteiroApp</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3">
            Planos simples e transparentes
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Comece grátis. Faça upgrade quando precisar de mais.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 mt-8 bg-white/[0.06] border border-white/10 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                !annual ? "bg-cta-blue text-white shadow-primary-md" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                annual ? "bg-cta-blue text-white shadow-primary-md" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Anual
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">-33%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* Free */}
          <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
            <div className="mb-6">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Gratuito</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-5xl font-black text-white">R$0</span>
                <span className="text-slate-500 mb-2">/sempre</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Para quem está começando a organizar viagens.</p>
            </div>

            <Link
              href="/register"
              className="block w-full text-center py-3 px-6 rounded-xl border-2 border-white/12 font-semibold text-slate-200 hover:border-white/25 hover:bg-white/5 transition-all mb-8"
            >
              Começar grátis
            </Link>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                  <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="relative border-2 border-primary-500/60 rounded-2xl p-8 bg-gradient-to-b from-primary-600/10 to-transparent">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-cta-blue text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-primary-md">
                <Star className="h-3 w-3 fill-current" /> MAIS POPULAR
              </span>
            </div>

            <div className="mb-6">
              <span className="text-sm font-semibold text-primary-300 uppercase tracking-wide">Premium</span>
              <div className="mt-2 flex items-end gap-1">
                {annual ? (
                  <>
                    <span className="text-5xl font-black text-white">R$13</span>
                    <span className="text-2xl font-black text-white">,25</span>
                    <span className="text-slate-500 mb-2">/mês</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-black text-white">R$19</span>
                    <span className="text-2xl font-black text-white">,90</span>
                    <span className="text-slate-500 mb-2">/mês</span>
                  </>
                )}
              </div>
              {annual && (
                <p className="text-sm text-slate-400 mt-1">
                  Cobrado <strong className="text-slate-200">R$159/ano</strong>
                  <span className="ml-2 text-emerald-400 font-semibold">Economize R$80</span>
                </p>
              )}
              {!annual && (
                <p className="text-sm text-slate-400 mt-2">Cobrado mensalmente. Cancele quando quiser.</p>
              )}
            </div>

            {/* Ponto de venda propriamente dito: sai de cena dentro do app nativo.
                A cobrança é feita pela Stripe, fora do faturamento do Play; manter
                o botão aqui violaria a política de Pagamentos do Google e é motivo
                de remoção da loja. A comparação de planos abaixo continua visível
                (é informação, não oferta). */}
            <button
              disabled={loading}
              className="hide-in-app w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-cta-blue shadow-primary-md transition-all hover:opacity-90 hover:scale-[1.02] mb-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              onClick={handleUpgrade}
            >
              <Zap className="h-4 w-4" />
              {loading ? "Redirecionando…" : "Assinar Premium"}
            </button>

            <p className="hide-in-app text-[11px] text-slate-500 leading-relaxed -mt-5 mb-8">
              Assinatura recorrente com renovação automática ({annual ? "anual" : "mensal"}). Cobrança via Stripe.
              Cancele quando quiser pelo app. Direito de arrependimento de 7 dias (CDC art. 49). Ao assinar, você aceita os{" "}
              <Link href="/terms" className="underline hover:text-slate-300">Termos de Uso</Link>.
            </p>

            {/* Substituto neutro no app: explica o que o plano inclui sem oferecer
                a compra nem dizer onde comprar (a regra de anti-direcionamento
                proíbe apontar para o canal externo). */}
            <p className="only-in-app text-xs text-slate-500 leading-relaxed mb-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Recursos disponíveis para assinantes Premium. Se você já é assinante,
              entre com sua conta para liberá-los automaticamente.
            </p>

            <ul className="space-y-3">
              <li className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Tudo do gratuito, mais:
              </li>
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                  <Check className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-white text-center mb-8">Perguntas frequentes</h2>

          {[
            {
              q: "Posso cancelar quando quiser?",
              a: "Sim. Cancele a qualquer momento pelo app. Você mantém acesso Premium até o fim do período pago.",
            },
            {
              q: "E se eu me arrepender? Como funciona o reembolso?",
              a: "Se cancelar em até 7 dias da contratação, devolvemos 100% do valor (direito de arrependimento, CDC art. 49). Depois disso: no plano mensal você mantém o acesso até o fim do mês pago, sem novas cobranças; no plano anual devolvemos proporcionalmente os meses não usados.",
            },
            {
              q: "Meus dados ficam salvos se eu cancelar?",
              a: "Sim. Suas viagens e dados são preservados. Você passa a operar sob os limites do plano gratuito.",
            },
            {
              q: "Quais formas de pagamento são aceitas?",
              a: "Cartão de crédito e débito, com processamento seguro via Stripe.",
            },
            {
              q: "Existe plano para equipes?",
              a: "Ainda não, mas está no nosso roadmap. Entre em contato se tiver interesse.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-white/8 pb-6">
              <p className="font-semibold text-white mb-2">{q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-slate-500 space-x-4">
          <Link href="/" className="hover:text-slate-300 transition-colors">Início</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Termos</Link>
          <a href="mailto:contato@roteiroapp.com" className="hover:text-slate-300 transition-colors">Contato</a>
        </div>

      </div>
    </div>
  );
}
