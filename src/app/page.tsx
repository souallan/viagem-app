import Link from "next/link";
import { MapPin, Calendar, DollarSign, FileText, Luggage, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">ViagemApp</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Organize suas viagens
          <br />
          <span className="text-blue-600">sem complicação</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Planeje roteiros, controle gastos, gerencie hospedagem e transporte —
          tudo em um só lugar.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Começar gratuitamente
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Tudo que você precisa para viajar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-blue-600 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para organizar sua próxima viagem?
          </h2>
          <p className="text-blue-100 mb-8">
            Crie sua conta grátis e comece a planejar agora.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Criar conta grátis
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} ViagemApp. Feito com carinho para viajantes.
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Calendar,
    title: "Itinerário dia a dia",
    description:
      "Organize suas atividades em uma linha do tempo visual. Nunca perca um compromisso.",
  },
  {
    icon: MapPin,
    title: "Hospedagem e transporte",
    description:
      "Cadastre hoteis, voos e translados com confirmações e horários em um só lugar.",
  },
  {
    icon: DollarSign,
    title: "Controle de gastos",
    description:
      "Defina um orçamento e acompanhe todas as despesas da viagem por categoria.",
  },
  {
    icon: FileText,
    title: "Documentos",
    description:
      "Guarde passaporte, visto, seguro e vouchers com acesso fácil em qualquer dispositivo.",
  },
  {
    icon: Luggage,
    title: "Lista de malas",
    description:
      "Checklist interativo para não esquecer nada em casa. Templates por tipo de viagem.",
  },
  {
    icon: MapPin,
    title: "Compartilhe a viagem",
    description:
      "Convide companheiros de viagem para visualizar ou editar o roteiro juntos.",
  },
];
