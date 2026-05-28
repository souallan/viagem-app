import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Dicas e Guias de Viagem",
  description: "Artigos gratuitos com dicas de viagem, roteiros e guias de destinos para viajantes brasileiros.",
  openGraph: {
    title: "Blog RoteiroApp — Dicas e Guias de Viagem",
    description: "Artigos gratuitos com dicas de viagem, roteiros e guias de destinos para viajantes brasileiros.",
  },
};

const ARTICLES = [
  {
    slug: "como-organizar-roteiro-de-viagem",
    title: "Como organizar um roteiro de viagem do zero",
    excerpt: "Passo a passo para planejar sua viagem: escolha do destino, orçamento, hospedagem, transporte e atividades. Tudo o que você precisa saber antes de partir.",
    date: "2025-05-15",
    readTime: "8 min",
    category: "Planejamento",
    emoji: "🗺️",
    content: `
Organizar um roteiro de viagem pode parecer complicado, mas com um método claro fica simples. Veja as etapas essenciais:

**1. Defina o destino e as datas**
Comece escolhendo o destino com base em seu orçamento e período disponível. Considere a temporada — alta temporada tem preços maiores mas clima mais previsível; baixa temporada é mais barata mas exige pesquisa extra.

**2. Monte o orçamento total**
Divida o orçamento em categorias: passagem, hospedagem, alimentação, atrações e compras. Uma regra prática: passagem consome 30–40% do total, hospedagem 25–35%.

**3. Reserve passagem e hospedagem com antecedência**
Para destinos populares, reserve com 3–6 meses de antecedência. Use ferramentas como Skyscanner para passagens e Booking.com para hospedagem.

**4. Liste as atividades dia a dia**
Monte um itinerário com atividades por dia, agrupando atrações próximas geograficamente. Evite encher demais — 3 a 4 atividades por dia é o ideal.

**5. Organize os documentos**
Passaporte, visto, seguro viagem e vacinas. Verifique validade mínima exigida no destino (geralmente 6 meses após o retorno).

**6. Use um app de roteiro**
Ferramentas como o RoteiroApp centralizam tudo: atividades, hospedagem, orçamento e lista de malas em um só lugar — offline.
    `,
  },
  {
    slug: "passaporte-brasileiro-destinos-sem-visto",
    title: "Passaporte brasileiro: todos os destinos sem visto em 2025",
    excerpt: "Com o passaporte brasileiro você visita mais de 170 países sem visto ou com visto na chegada. Veja a lista completa e como aproveitar ao máximo.",
    date: "2025-05-22",
    readTime: "5 min",
    category: "Documentos",
    emoji: "🛂",
    content: `
O passaporte brasileiro tem forte poder de acesso global. Em 2025, permite entrada em **170+ países** sem visto prévio ou com visto na chegada.

**Destinos populares sem visto**
- Europa (Schengen): Alemanha, França, Espanha, Itália, Portugal e mais 22 países
- Américas: EUA (90 dias com ESTA), Canadá, México, Argentina, Chile, Colômbia
- Ásia: Japão (90 dias), Tailândia (30 dias), Bali/Indonésia (30 dias)
- África: África do Sul, Marrocos, Egito (visto na chegada)

**Validade mínima do passaporte**
A maioria dos países exige passaporte válido por pelo menos **6 meses** após a data de retorno. Sempre verifique antes de viajar.

**Como tirar ou renovar o passaporte**
1. Agende pelo site da Polícia Federal
2. Compareça com documentos (RG, CPF, foto 3x4)
3. Prazo: 6 dias úteis (normal) ou 10 dias (emergencial)
4. Custo: R$ 257,25 (adulto)

**Dica**: Mantenha cópias digitais do passaporte no celular e em e-mail para emergências.
    `,
  },
  {
    slug: "seguro-viagem-vale-a-pena",
    title: "Seguro viagem: vale a pena contratar? Guia completo",
    excerpt: "Entenda quando o seguro viagem é obrigatório, o que ele cobre, quanto custa e como escolher o melhor plano para sua viagem internacional.",
    date: "2025-05-29",
    readTime: "6 min",
    category: "Segurança",
    emoji: "🛡️",
    content: `
O seguro viagem é um dos itens mais importantes — e mais ignorados — no planejamento de viagens. Veja tudo que você precisa saber.

**Quando é obrigatório?**
- Europa (Schengen): obrigatório com cobertura mínima de €30.000 para despesas médicas
- Cuba: obrigatório para todos os visitantes
- Alguns países do Caribe e Oriente Médio

**O que cobre um bom seguro viagem?**
- Despesas médicas e hospitalares
- Evacuação de emergência
- Cancelamento e interrupção de viagem
- Extravio de bagagem
- Responsabilidade civil

**Quanto custa?**
Para destinos como Europa, espere pagar R$ 30–80 por semana (adulto saudável). Para os EUA, onde o custo médico é altíssimo, o preço dobra.

**Como escolher?**
Compare coberturas pelo Seguros Promo — você vê preços de múltiplas seguradoras em uma só tela. Prefira coberturas de pelo menos US$ 100.000 para destinos como EUA e Canadá.

**Dica prática**: contrate sempre antes de embarcar. Após a viagem começar, não é possível contratar.
    `,
  },
  {
    slug: "economizar-no-cambio",
    title: "Como economizar no câmbio e gastar menos no exterior",
    excerpt: "Cartão Wise, Nomad, câmbio no Brasil ou no exterior? Guia prático para pagar menos taxas e ter mais dinheiro na viagem.",
    date: "2025-06-05",
    readTime: "7 min",
    category: "Finanças",
    emoji: "💱",
    content: `
O câmbio pode consumir 5–15% do seu dinheiro se você não tomar cuidado. Veja as melhores opções para brasileiros viajando ao exterior.

**Opção 1: Cartão Wise (melhor para maioria dos casos)**
O Wise usa a taxa de câmbio real (interbancária) sem spread — você paga somente uma pequena taxa por transação. Ideal para Europa, EUA e Ásia. Abra sua conta com antecedência pois o cartão físico leva dias para chegar.

**Opção 2: Cartão Nomad**
Voltado especificamente para brasileiros, o Nomad oferece câmbio competitivo e saque em dólares via parceiros. Boa alternativa ao Wise para quem prefere interface em português.

**Opção 3: Cartão de crédito com isenção de IOF**
Alguns cartões de crédito premium (Nubank, C6, Santander Free) isentam o IOF (6,38% sobre compras no exterior). Compense com o câmbio da operadora, geralmente 1–2% acima do real.

**O que EVITAR**
- Casas de câmbio aeroportos: até 15% mais caro
- Câmbio em hotéis: piores taxas do mercado
- Saques em caixas eletrônicos sem cartão específico: tarifas altas

**Regra de ouro**: nunca chegue ao destino sem alguma moeda local para os primeiros momentos.
    `,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Blog de Viagens</h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Dicas práticas, guias de destinos e tudo que você precisa para viajar melhor.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Category bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{article.emoji}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime} de leitura
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {article.excerpt}
                </p>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ler artigo completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-blue-600 text-white p-8 text-center">
          <h2 className="text-2xl font-black mb-2">Organize sua próxima viagem</h2>
          <p className="text-blue-100 text-sm mb-6">
            Crie roteiros completos, controle o orçamento e nunca esqueça nada na mala.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Criar conta grátis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-gray-400 space-x-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">Início</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Termos</Link>
        </div>

      </div>
    </div>
  );
}
