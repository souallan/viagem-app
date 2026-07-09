import type { Metadata } from "next";
import Link from "next/link";
import {
  Plane, WifiOff, Bell, Camera, Route, Users, MapPin, ArrowRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Baixe o app — RoteiroApp",
  description:
    "O RoteiroApp no seu bolso: acesse reservas offline, receba lembretes da viagem, tire foto dos documentos e otimize seus trajetos. iOS e Android.",
  alternates: { canonical: "/app" },
  openGraph: {
    title: "Baixe o app RoteiroApp",
    description: "Sua viagem organizada na palma da mão — offline, lembretes e mais.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const FEATURES = [
  { Icon: WifiOff, title: "Offline de verdade", desc: "Nº de reserva, voo e ingresso acessíveis mesmo sem internet, durante a viagem." },
  { Icon: Bell, title: "Lembretes na hora certa", desc: "Notificações de check-in, embarque e do que vem a seguir no roteiro." },
  { Icon: Camera, title: "Foto dos documentos", desc: "Tire foto da reserva e do passaporte e guarde tudo no lugar certo." },
  { Icon: Route, title: "Trajeto otimizado", desc: "O app calcula a melhor ordem de visita do dia e economiza deslocamento." },
  { Icon: Users, title: "Viagem em grupo", desc: "Compartilhe a viagem e divida as contas com quem viaja junto." },
  { Icon: MapPin, title: "Mapa e rotas", desc: "Todos os seus locais no mapa, com rota direta pelo Google Maps ou Waze." },
];

export default function AppLandingPage() {
  const { android, ios } = SITE_CONFIG.app;
  const hasStores = Boolean(android || ios);

  return (
    <div className="min-h-screen bg-vibe-dark text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 8px 30px rgba(26,95,204,.5)" }}>
            <Plane className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            O RoteiroApp no seu <span className="gradient-text">bolso</span>
          </h1>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed">
            Planeje no computador, viaje com o app. Reservas offline, lembretes, foto de documentos,
            mapa com rota otimizada e divisão de contas em grupo.
          </p>

          {/* Install */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            {hasStores ? (
              <>
                {android && (
                  <a href={android} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-slate-100 transition-colors">
                    ▶ Google Play
                  </a>
                )}
                {ios && (
                  <a href={ios} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-slate-100 transition-colors">
                     App Store
                  </a>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm font-semibold text-slate-200">
                📱 Em breve na Google Play e App Store
              </span>
            )}
          </div>

          {/* Usar no navegador */}
          <div className="mt-6">
            <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-300 hover:text-primary-200 transition-colors">
              Começar agora no navegador <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-primary-600/20 flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-primary-300" />
              </div>
              <h3 className="text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 text-center text-sm text-slate-500 space-x-4">
          <Link href="/" className="hover:text-slate-300 transition-colors">Início</Link>
          <Link href="/pricing" className="hover:text-slate-300 transition-colors">Planos</Link>
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
        </div>
      </div>
    </div>
  );
}
