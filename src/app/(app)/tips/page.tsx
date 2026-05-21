"use client";

import { useState } from "react";
import {
  Shield, Train, Globe, Smartphone, Heart, FileText,
  Clock, ChevronDown, ChevronUp, ExternalLink, Lightbulb,
} from "lucide-react";

interface Tip {
  id: string;
  category: string;
  categoryColor: string;
  icon: React.ElementType;
  title: string;
  excerpt: string;
  readTime: number;
  body: string[];
  link?: { label: string; url: string };
}

const TIPS: Tip[] = [
  {
    id: "trem-europa",
    category: "Transporte",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: Train,
    title: "Como andar de trem na Europa sem pagar caro",
    excerpt: "Entenda a diferença entre Eurail Pass e bilhetes avulsos, e quando cada opção compensa.",
    readTime: 5,
    body: [
      "O Eurail Pass vale a pena para mais de 4 países em menos de 15 dias. Para roteiros fixos, compre bilhetes individuais pelo Omio ou Trainline — geralmente 30-50% mais barato.",
      "Reserve com antecedência: trens de alta velocidade (TGV, Thalys, ICE) vendem bilhetes com até 90 dias de antecedência, e os primeiros preços são os mais baixos.",
      "Dica de ouro: viaje em 2ª classe. A diferença de conforto é mínima e a economia chega a 40%.",
      "Apps essenciais: DB Navigator (Alemanha/Europa), Trenitalia (Itália), SNCF Connect (França).",
    ],
  },
  {
    id: "golpes-paris",
    category: "Segurança",
    categoryColor: "bg-red-100 text-red-700",
    icon: Shield,
    title: "Golpes comuns em Paris (e como evitá-los)",
    excerpt: "A cidade do amor também tem seus larápios. Conheça as ciladas mais comuns perto da Torre Eiffel.",
    readTime: 4,
    body: [
      "O golpe do anel: alguém 'encontra' um anel no chão e tenta te vender. Ignore e siga em frente.",
      "Petição falsa: pessoas pedem para assinar uma petição e enquanto sua atenção está no papel, cúmplices furtam pertences.",
      "Na Torre Eiffel e no Sacré-Cœur, grupos formam cordas de amizade e exigem pagamento. Não estenda o braço.",
      "Use pochete discreta ou mochila anti-furto com compartimento oculto. Deixe documentos originais no hotel.",
    ],
  },
  {
    id: "etias-europa",
    category: "Documentos",
    categoryColor: "bg-purple-100 text-purple-700",
    icon: FileText,
    title: "ETIAS 2025: o que brasileiros precisam saber",
    excerpt: "A nova autorização de viagem para a Europa entra em vigor e exige cadastro prévio online.",
    readTime: 3,
    body: [
      "O ETIAS (European Travel Information and Authorization System) é obrigatório para cidadãos de países isentos de visto, incluindo brasileiros.",
      "Custa €7 e é válido por 3 anos ou até o vencimento do passaporte. A aprovação leva minutos, mas pode levar até 4 dias em casos revisados.",
      "Não confunda com visto! Com ETIAS você pode ficar até 90 dias dentro de 180 dias na área Schengen.",
      "Acesse o site oficial da Comissão Europeia para se registrar. Desconfie de sites de terceiros que cobram taxas extras.",
    ],
    link: { label: "Site oficial ETIAS", url: "https://travel-europe.europa.eu/etias_en" },
  },
  {
    id: "wifi-roaming",
    category: "Tecnologia",
    categoryColor: "bg-sky-100 text-sky-700",
    icon: Smartphone,
    title: "Internet no exterior: SIM local, eSIM ou roaming?",
    excerpt: "Comparamos as opções para você nunca ficar sem sinal — e sem dinheiro — viajando.",
    readTime: 4,
    body: [
      "eSIM é a melhor opção hoje: configure antes de sair do Brasil, ative ao chegar. Apps como Airalo e Holafly oferecem planos de dados a partir de US$5.",
      "SIM local: compre no aeroporto de chegada. Na Europa, a Three UK e a Orange têm planos com roaming grátis em vários países.",
      "Roaming da operadora brasileira: geralmente o mais caro. Vivo, Claro e Tim cobram até R$60/dia pelo pacote diário.",
      "Dica: baixe mapas do Google Maps offline antes de sair do hotel. Salva bateria e dados.",
    ],
  },
  {
    id: "seguro-viagem",
    category: "Saúde",
    categoryColor: "bg-emerald-100 text-emerald-700",
    icon: Heart,
    title: "Seguro viagem: o que cobre e o que não cobre",
    excerpt: "Uma consulta médica na Europa pode custar €300. Entenda o que seu seguro realmente inclui.",
    readTime: 5,
    body: [
      "Coberturas essenciais: despesas médicas (mínimo €30.000 para Schengen), extravio de bagagem, cancelamento de voo e repatriação.",
      "Atenção às exclusões: esportes de risco, doenças preexistentes e situações causadas por uso de álcool geralmente não são cobertos.",
      "Seguro obrigatório para Schengen: cobertura mínima de €30.000 para despesas médicas. Sem isso, seu visto pode ser negado.",
      "Compare no Minhas Viagens, Assist Card e Allianz. Planos básicos custam de R$8 a R$20 por dia.",
    ],
  },
  {
    id: "moeda-local",
    category: "Finanças",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: Globe,
    title: "Dinheiro no exterior: como não perder na conversão",
    excerpt: "Cartão internacional, espécie, ou conta digital? A estratégia certa pode te economizar centenas de reais.",
    readTime: 4,
    body: [
      "Evite câmbio em aeroportos e hotéis — as taxas são as piores. Prefira casas de câmbio como Meu Câmbio ou Cotação antes de viajar.",
      "Cartões sem IOF: Wise, Nomad e C6 Bank não cobram IOF em compras internacionais. Essenciais para quem viaja muito.",
      "Saque no exterior: prefira caixas eletrônicos de bancos locais e saque valores maiores (menos taxas por transação).",
      "Regra 70/30: leve 70% em cartão e 30% em espécie para emergências e locais que não aceitam débito.",
    ],
  },
  {
    id: "bagagem-mao",
    category: "Transporte",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: Lightbulb,
    title: "Como viajar só com bagagem de mão e não sofrer",
    excerpt: "Viajando com mochila de cabine você economiza tempo e dinheiro — e nunca perde mala de novo.",
    readTime: 5,
    body: [
      "Regra base: 7kg e 55x40x20cm cabe em 99% das companhias europeias. Pese a mochila vazia antes de começar a encher.",
      "Técnica roll & stack: enrole roupas ao invés de dobrar — ocupa 30% menos espaço e amassa menos.",
      "Produtos de higiene: tamanho 100ml, tudo em um saquinho transparente. Use sólidos (xampu, condicionador) para economizar volume.",
      "Kit versátil: 2 calças, 5 camisetas, 1 blusa quente, 1 vestido/camisa social e 2 pares de sapatos. Para até 10 dias.",
    ],
  },
  {
    id: "comida-local",
    category: "Cultura",
    categoryColor: "bg-rose-100 text-rose-700",
    icon: Globe,
    title: "Como comer bem e barato em qualquer país",
    excerpt: "Turistas pagam mais. Aprenda a comer como um local e economize até 60% nas refeições.",
    readTime: 3,
    body: [
      "Mercados locais são sempre mais baratos que restaurantes turísticos. Em Paris, o Marché d'Aligre é indispensável.",
      "Menu do almoço (prix-fixe): restaurantes franceses e italianos oferecem menu completo no almoço por metade do preço do jantar.",
      "Apps para encontrar restaurantes locais: TripAdvisor (filtrar por 'Locals' choice'), Yelp e Google Maps (leia avaliações em outros idiomas).",
      "Supermercado é seu amigo: café da manhã e lanches no supermercado local economizam até €15/dia por pessoa.",
    ],
  },
];

const ALL_CATEGORIES = ["Todos", ...Array.from(new Set(TIPS.map((t) => t.category)))];

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === "Todos"
    ? TIPS
    : TIPS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle, #2dd4bf 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10">
          <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-1">Comunidade ViagemApp</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dicas & Guias de <span className="gradient-text">Viagem</span>
          </h1>
          <p className="text-slate-300 max-w-lg">
            Artigos escritos por especialistas e viajantes experientes para você viajar melhor, com mais segurança e gastar menos.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-teal-500 text-white shadow-md shadow-teal-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} artigo{filtered.length !== 1 ? "s" : ""}</p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((tip) => {
          const isExpanded = expandedId === tip.id;
          return (
            <article
              key={tip.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm travel-card-hover overflow-hidden flex flex-col"
            >
              {/* Card header with accent colour */}
              <div className="h-2 bg-gradient-to-r from-teal-400 to-sky-500" />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <tip.icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.categoryColor}`}>
                      {tip.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {tip.readTime} min
                    </span>
                  </div>
                </div>

                <h2 className="font-bold text-gray-900 mb-1.5 leading-snug">{tip.title}</h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tip.excerpt}</p>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="mb-4 space-y-2.5 border-t border-gray-100 pt-4">
                    {tip.body.map((para, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                    {tip.link && (
                      <a
                        href={tip.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 mt-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        {tip.link.label}
                      </a>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                  className="mt-auto flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <><ChevronUp className="h-4 w-4" aria-hidden="true" /> Fechar</>
                  ) : (
                    <><ChevronDown className="h-4 w-4" aria-hidden="true" /> Ler artigo</>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
