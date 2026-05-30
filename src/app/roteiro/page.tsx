import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roteiros de Viagem — Lisboa, Buenos Aires, Tóquio e mais | RoteiroApp",
  description: "Roteiros completos dia a dia para os destinos mais amados pelos brasileiros. Lisboa, Buenos Aires, Tóquio e Barcelona — com custos, dicas e itinerário detalhado.",
  keywords: "roteiro de viagem, roteiro lisboa, roteiro buenos aires, roteiro tokyo, roteiro barcelona, planejar viagem",
};

const DESTINATIONS = [
  { slug: "lisboa",       name: "Lisboa",       country: "Portugal",  flag: "🇵🇹", highlight: "Sem visto · Mesma língua · Melhor custo da Europa Ocidental" },
  { slug: "buenos-aires", name: "Buenos Aires",  country: "Argentina", flag: "🇦🇷", highlight: "Câmbio favorável · Gastronomia incrível · Tango" },
  { slug: "tokyo",        name: "Tóquio",        country: "Japão",     flag: "🇯🇵", highlight: "Sem visto · Destino mais seguro do mundo · Cultura única" },
  { slug: "barcelona",    name: "Barcelona",     country: "Espanha",   flag: "🇪🇸", highlight: "Gaudí · Praias · Vida noturna · Futebol" },
];

export default function RoteirosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="text-white text-xs font-black">R</span>
            </div>
            <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600">RoteiroApp</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Roteiros de Viagem</h1>
        <p className="text-gray-600 text-lg mb-10">Guias completos com itinerário dia a dia, custos reais e dicas de quem já foi.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DESTINATIONS.map(dest => (
            <Link key={dest.slug} href={`/roteiro/${dest.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-4xl mb-3">{dest.flag}</div>
              <h2 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{dest.name}</h2>
              <p className="text-sm text-gray-400 mb-3">{dest.country}</p>
              <p className="text-sm text-gray-600">{dest.highlight}</p>
              <div className="mt-4 text-sm font-bold text-blue-600 group-hover:underline">Ver roteiro completo →</div>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
          <p className="font-black text-2xl mb-2">Planeje qualquer destino</p>
          <p className="text-blue-200 mb-6">Crie roteiros personalizados, controle gastos e organize tudo com o RoteiroApp — grátis.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors">
            Criar conta grátis →
          </Link>
        </div>
      </div>
    </div>
  );
}
