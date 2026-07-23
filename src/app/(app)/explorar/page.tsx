"use client";

import Link from "next/link";
import { Route, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

/**
 * Hub de descoberta de conteúdo.
 *
 * A barra inferior tinha 5 destinos e TRÊS deles eram conteúdo (Rotas, Dicas,
 * Relatos), enquanto a viagem em andamento — a razão de existir do app — não
 * tinha lugar nenhum. Agrupando os três aqui, libera-se um espaço para "Hoje"
 * e para a ação de criar viagem.
 *
 * É um hub, e não uma fusão das três telas: cada página continua existindo no
 * mesmo endereço, então links salvos e compartilhados seguem funcionando.
 */
export default function ExplorarPage() {
  const { t } = useLanguage();

  const secoes = [
    {
      href: "/routes",
      titulo: t.nav.routes,
      descricao: "Roteiros prontos criados por outros viajantes — copie e adapte para a sua viagem.",
      Icon: Route,
      cor: "text-primary-700",
      fundo: "bg-primary-50",
      borda: "border-primary-100",
    },
    {
      href: "/tips",
      titulo: t.nav.tips,
      descricao: "Dicas práticas de quem já foi: documentos, bagagem, transporte e economia.",
      Icon: Lightbulb,
      cor: "text-amber-700",
      fundo: "bg-amber-50",
      borda: "border-amber-100",
    },
    {
      href: "/experiences",
      titulo: t.nav.experiences,
      descricao: "Relatos de viagem com fotos e histórias reais para inspirar o próximo destino.",
      Icon: BookOpen,
      cor: "text-violet-700",
      fundo: "bg-violet-50",
      borda: "border-violet-100",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Explorar</h1>
        <p className="text-sm text-gray-500 mt-1">
          Inspiração e conhecimento de outros viajantes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {secoes.map(({ href, titulo, descricao, Icon, cor, fundo, borda }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 hover:shadow-md transition-all"
          >
            <div className={`w-11 h-11 rounded-2xl ${fundo} border ${borda} flex items-center justify-center mb-3`}>
              <Icon className={`h-5 w-5 ${cor}`} aria-hidden="true" />
            </div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-gray-900">{titulo}</h2>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </div>
            <p className="text-sm text-gray-500 mt-1 leading-snug">{descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
