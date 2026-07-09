import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { AffiliateBlock } from "@/components/marketing/affiliate-block";
import { DESTINATIONS } from "@/lib/destinations";

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

        {/* Parceiros (afiliados) — contextual do destino */}
        <AffiliateBlock
          groups={["accommodation", "flights", "tours"]}
          destination={dest.name}
          title={`Reserve sua viagem para ${dest.name}`}
        />

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
