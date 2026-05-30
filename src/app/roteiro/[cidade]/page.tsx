import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

interface DestinationData {
  name: string;
  country: string;
  flag: string;
  heroColor: string;
  description: string;
  bestTime: string;
  avgBudget: string;
  language: string;
  visa: string;
  days: { day: string; title: string; activities: string[] }[];
  tips: string[];
  slug: string;
}

const DESTINATIONS: Record<string, DestinationData> = {
  "lisboa": {
    name: "Lisboa", country: "Portugal", flag: "🇵🇹",
    heroColor: "from-blue-700 to-blue-900",
    description: "A capital portuguesa é o destino favorito dos brasileiros na Europa. Mesma língua, gastronomia familiar, custo acessível e uma beleza histórica única.",
    bestTime: "Abril–Junho e Setembro–Outubro",
    avgBudget: "R$ 1.200 – R$ 1.800/dia por pessoa (tudo incluso)",
    language: "Português (sem barreira!)",
    visa: "Não precisa de visto (Schengen, até 90 dias)",
    slug: "lisboa",
    days: [
      { day: "Dia 1", title: "Alfama e Castelo", activities: ["Castelo de São Jorge (chegue antes das 10h)", "Museu do Azulejo", "Miradouro da Graça (pôr do sol)", "Jantar no Bairro Alto"] },
      { day: "Dia 2", title: "Belém", activities: ["Mosteiro dos Jerônimos (reserve online)", "Torre de Belém", "Pastéis de Belém originais", "Museu de Arte Popular"] },
      { day: "Dia 3", title: "Sintra (excursão)", activities: ["Palácio da Pena (reserve online!)", "Castelo dos Mouros", "Palácio Nacional de Sintra", "Volta pelo Chiado"] },
      { day: "Dia 4", title: "Cascais e praias", activities: ["Trem de Cais do Sodré (40 min)", "Praia de Cascais", "Boca do Inferno", "Almoço de peixe fresco"] },
    ],
    tips: [
      "Compre o cartão Viva Viagem (€0,50) no metrô — carregue com créditos",
      "Evite o tram 28 turístico. Use o 15E para Belém (mais espaço, mesmo preço)",
      "Restaurantes com cardápio em 5 idiomas = 30% mais caro",
      "Uber funciona bem em Lisboa e costuma ser mais barato que táxi",
      "Feira da Ladra (Campo de Santa Clara): somente terças e sábados",
    ],
  },
  "buenos-aires": {
    name: "Buenos Aires", country: "Argentina", flag: "🇦🇷",
    heroColor: "from-sky-700 to-blue-900",
    description: "A Paris da América do Sul. Cultura, gastronomia de altíssimo nível, vida noturna incrível e câmbio favorável para brasileiros.",
    bestTime: "Setembro–Novembro (primavera argentina)",
    avgBudget: "R$ 500 – R$ 900/dia por pessoa",
    language: "Espanhol argentino (muito acessível para brasileiros)",
    visa: "Não precisa de visto",
    slug: "buenos-aires",
    days: [
      { day: "Dia 1", title: "San Telmo e La Boca", activities: ["Mercado de San Telmo (domingo: feria de artesanato)", "Caminito (La Boca) — vá à tarde, é seguro em horário comercial", "Bife de chorizo no jantar — Buenos Aires é obrigatório"] },
      { day: "Dia 2", title: "Recoleta e Palermo", activities: ["Cemitério da Recoleta (gratuito, impressionante)", "MALBA — Museu de Arte Latino-Americana", "Palermo Soho: cafés, design e compras", "Show de tango (La Ventana ou Rojo Tango)"] },
      { day: "Dia 3", title: "Puerto Madero e Centro", activities: ["Puerto Madero (orla modernizada)", "Casa Rosada e Plaza de Mayo", "Café Tortoni (o mais antigo de Buenos Aires)", "Teatro Colón — visita guiada"] },
      { day: "Dia 4", title: "Tigre (excursão)", activities: ["Trem Mitre de Retiro (1h)", "Delta do Paraná de barco", "Mercado de Frutos", "Lancha pelos canais"] },
    ],
    tips: [
      "Use Wise ou Nomad para saques — câmbio oficial é muito melhor que trocar reais",
      "Peça 'tabla de quesos y fiambres' como entrada — porção enorme por preço baixo",
      "Museus são gratuitos às quartas",
      "Uber funciona mas não aparece no mapa — insira destino e só mostre a localização",
      "Nunca chame de 'gaucho' um portenho — e 'che' é frequente no dia a dia",
    ],
  },
  "tokyo": {
    name: "Tóquio", country: "Japão", flag: "🇯🇵",
    heroColor: "from-red-700 to-rose-900",
    description: "A maior cidade do mundo é surpreendentemente fácil de explorar. Segura, limpa, gastronômica e culturalmente única — o Japão justifica qualquer investimento.",
    bestTime: "Março–Abril (cerejeiras) ou Outubro–Novembro (outono)",
    avgBudget: "R$ 800 – R$ 1.400/dia por pessoa",
    language: "Japonês — apps de tradução são essenciais",
    visa: "Não precisa de visto (até 90 dias)",
    slug: "tokyo",
    days: [
      { day: "Dia 1", title: "Shibuya e Shinjuku", activities: ["Cruzamento de Shibuya (veja do Starbucks acima)", "Harajuku e Takeshita Street", "Meiji Shrine", "Shinjuku à noite (Golden Gai)"] },
      { day: "Dia 2", title: "Akihabara e Asakusa", activities: ["Akihabara (eletrônicos, cultura pop, arcades)", "Templo Senso-ji em Asakusa", "Mercado Nakamise", "Skytree (o mais alto do Japão)"] },
      { day: "Dia 3", title: "Tsukiji e Ginza", activities: ["Mercado externo de Tsukiji (sushi de manhã cedo)", "Hamarikyu Gardens", "Ginza — vitrine do luxo japonês", "Odaiba à tarde (vista da Baía de Tóquio)"] },
      { day: "Dia 4", title: "Monte Fuji ou Nikko", activities: ["Trem Chuo para Kawaguchiko (2h)", "Vista do Fuji do Lago Kawaguchi", "Oshino Hakkai (olhos d'água vulcânica)", "Retorno à Tóquio à tarde"] },
    ],
    tips: [
      "IC Card (Suica/Pasmo): compre no aeroporto, funciona em todo transporte e lojas",
      "Japan Rail Pass: compre ANTES de vir ao Japão — só vende fora do país",
      "Conbinis (7-Eleven, Lawson): comida excelente, barata, 24h",
      "Vending machines estão em todo lugar — moedas são úteis aqui",
      "Não fale no celular no trem — é considerado rude",
    ],
  },
  "barcelona": {
    name: "Barcelona", country: "Espanha", flag: "🇪🇸",
    heroColor: "from-orange-600 to-red-800",
    description: "Gaudi, praias, futebol e tapas. Barcelona é uma das cidades mais completas da Europa — arte, arquitetura, gastronomia e vida noturna em uma só cidade.",
    bestTime: "Maio–Junho e Setembro",
    avgBudget: "R$ 1.400 – R$ 2.200/dia por pessoa",
    language: "Espanhol e Catalão",
    visa: "Não precisa de visto (Schengen, até 90 dias)",
    slug: "barcelona",
    days: [
      { day: "Dia 1", title: "Gaudí e Eixample", activities: ["Sagrada Família (reserve 1–2 meses antes!)", "Casa Batlló ou Casa Milà", "Passeig de Gràcia", "Tapas no Cervecería Catalana"] },
      { day: "Dia 2", title: "Bairro Gótico e Las Ramblas", activities: ["Catedral de Barcelona (gratuita de manhã)", "Barri Gòtic a pé", "Mercado de La Boqueria (não compre aqui — é caro)", "Museu Picasso"] },
      { day: "Dia 3", title: "Parque Güell e Gràcia", activities: ["Parque Güell (reserve ingresso online)", "Bairro de Gràcia (cafés locais, sem turistas)", "Bunkers del Carmel (melhor vista de Barcelona, de graça)", "Barceloneta à tarde"] },
      { day: "Dia 4", title: "Montjuïc e Poblenou", activities: ["Museu Nacional d'Art de Catalunya", "Fundació Joan Miró", "Vista de Montjuïc", "Poblenou (o bairro criativo)"] },
    ],
    tips: [
      "Reserve Sagrada Família com 1–2 meses de antecedência — esgota muito rápido",
      "La Boqueria é turística e cara — o Mercado de Santa Caterina é onde os locals compram",
      "Cuidado com bolsos em Las Ramblas — é a área com mais furtos da cidade",
      "T-Casual (10 viagens de metrô): R$ 15 — economiza muito vs. bilhete avulso",
      "O melhor sanduíche de jamón da cidade está no Bar Pinotxo (La Boqueria) — chegue cedo",
    ],
  },
};

type Props = { params: Promise<{ cidade: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cidade } = await params;
  const dest = DESTINATIONS[cidade];
  if (!dest) return { title: "Destino não encontrado" };
  return {
    title: `Roteiro ${dest.name} — Guia Completo para Brasileiros | RoteiroApp`,
    description: `${dest.description} Veja o roteiro dia a dia, custos, melhores épocas e dicas exclusivas.`,
    keywords: [`roteiro ${dest.name.toLowerCase()}`, `viagem ${dest.name.toLowerCase()}`, `o que fazer ${dest.name.toLowerCase()}`, `dicas ${dest.name.toLowerCase()}`].join(", "),
    openGraph: {
      title: `Roteiro ${dest.name} para Brasileiros`,
      description: dest.description,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(DESTINATIONS).map(cidade => ({ cidade }));
}

export default async function DestinoPage({ params }: Props) {
  const { cidade } = await params;
  const dest = DESTINATIONS[cidade];
  if (!dest) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="text-white text-xs font-black">R</span>
            </div>
            <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600">RoteiroApp</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/roteiro" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Roteiros
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${dest.heroColor} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-4">{dest.flag}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Roteiro {dest.name}</h1>
          <p className="text-xl text-white/80 max-w-2xl">{dest.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Melhor época", value: dest.bestTime },
            { icon: DollarSign, label: "Custo médio/dia", value: dest.avgBudget },
            { icon: Clock, label: "Idioma", value: dest.language },
            { icon: CheckCircle, label: "Visto", value: dest.visa },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <Icon className="h-4 w-4 text-blue-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xs font-semibold text-gray-800 leading-snug">{value}</p>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" /> Roteiro dia a dia
          </h2>
          <div className="space-y-4">
            {dest.days.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{d.day}</p>
                    <p className="text-sm font-bold text-gray-900">{d.title}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {d.activities.map((act, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Dicas essenciais</h2>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 space-y-3">
            {dest.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="font-bold shrink-0">💡</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <p className="font-black text-2xl mb-2">Monte seu roteiro para {dest.name}</p>
          <p className="text-blue-200 mb-6 text-sm">
            Use o RoteiroApp para organizar cada dia, controlar gastos em {dest.country} e manter todos os documentos em um lugar.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors">
            Criar roteiro grátis →
          </Link>
        </div>

        {/* Other destinations */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Outros destinos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(DESTINATIONS).filter(d => d.slug !== cidade).map(d => (
              <Link key={d.slug} href={`/roteiro/${d.slug}`}
                className="bg-white rounded-xl border border-gray-100 p-3 text-center hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="text-2xl mb-1">{d.flag}</div>
                <p className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{d.name}</p>
                <p className="text-[10px] text-gray-400">{d.country}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
