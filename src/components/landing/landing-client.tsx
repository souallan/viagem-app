"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, ArrowRight, CheckCircle, Star,
  Globe, BookOpen, Route, BedDouble, Lightbulb, Camera,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";
import { trackEvent } from "@/lib/analytics";

// ── Imagens (public/screenshots/) ────────────────────────────────
// roteiros.png       1690×878  hero principal
// stats.png          1641×376  strip "o que você vê num olhar"
// hospedagem.png     1630×915  feature: hospedagem + calendário
// cotação.png        1644×837  feature: câmbio
// dicas.png          1630×869  feature: dicas & guias
// experiences.png    1698×637  banner: experiências (wide)
// experience-detail  1707×889  feature: relato detalhado

const S = {
  roteiros:   "/screenshots/roteiros.png",
  stats:      "/screenshots/stats.png",
  hospedagem: "/screenshots/hospedagem.png",
  cotacao:    "/screenshots/cotação.png",
  dicas:      "/screenshots/dicas.png",
  exps:       "/screenshots/experiences.png",
  detail:     "/screenshots/experience-detail.png",
};

// Imagem padrão — sem corte, proporção original
function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" decoding="async" />
    </figure>
  );
}

// Imagem premium — moldura de browser + glow colorido + hover scale
// Usada em: roteiros (hero), cotação, dicas, experience-detail
function PremiumImg({ src, alt, glow = "rgba(59,130,246,0.25)", eager = false }: {
  src: string; alt: string; glow?: string; eager?: boolean;
}) {
  return (
    <figure
      className="overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px ${glow}`,
      }}
    >
      {/* Barra de browser simulada */}
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#1a1f2e", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <div className="ml-2 flex-1 h-5 rounded-md px-2 flex items-center" style={{ background: "rgba(255,255,255,0.06)" }}>
          <span className="text-[9px] text-slate-500 font-medium">roteiroapp.com</span>
        </div>
      </div>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto block"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </figure>
  );
}

const LANGS: { id: LandingLang; flag: string; label: string }[] = [
  { id: "pt", flag: "🇧🇷", label: "PT" },
  { id: "en", flag: "🇬🇧", label: "EN" },
  { id: "es", flag: "🇪🇸", label: "ES" },
];

function LangPicker({ lang, set }: { lang: LandingLang; set: (l: LandingLang) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-lg border border-white/8 bg-white/[0.04]">
      {LANGS.map((o) => (
        <button key={o.id} onClick={() => set(o.id)} aria-label={o.label}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all
            ${lang === o.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>
          <span>{o.flag}</span><span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// Bloco de texto para seções de feature
function FeatureText({
  badge, badgeIcon: Icon, badgeColor,
  title, highlight, desc, bullets, bulletColor,
  cta, ctaHref, ctaColor,
}: {
  badge: string; badgeIcon: React.ElementType; badgeColor: string;
  title: string; highlight: string; desc: string;
  bullets: string[]; bulletColor: string;
  cta?: string; ctaHref?: string; ctaColor?: string;
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-5 w-fit ${badgeColor}`}>
        <Icon className="h-3 w-3" /> {badge}
      </div>
      <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-white">
        {title}<br />
        <span className={highlightClass(bulletColor)}>{highlight}</span>
      </h2>
      <p className="text-slate-400 leading-relaxed mb-6 text-[15px]">{desc}</p>
      <ul className="space-y-3 mb-7">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
            <CheckCircle className={`h-4 w-4 shrink-0 mt-0.5 ${bulletColor}`} /> {b}
          </li>
        ))}
      </ul>
      {cta && ctaHref && ctaColor && (
        <Link href={ctaHref}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white w-fit transition-all hover:scale-[1.02] shadow-lg ${ctaColor}`}>
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function highlightClass(bulletColor: string) {
  if (bulletColor.includes("sky"))    return "text-sky-400";
  if (bulletColor.includes("amber"))  return "text-amber-400";
  if (bulletColor.includes("teal"))   return "text-teal-400";
  if (bulletColor.includes("violet")) return "text-violet-400";
  if (bulletColor.includes("pink"))   return "text-pink-400";
  return "text-blue-400";
}

interface Props { stats: { users: number; trips: number; destinations: number } }

export function LandingClient({ stats }: Props) {
  const [lang, setLang] = useState<LandingLang>("pt");
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const t = landingI18n[lang];
  const pt = lang === "pt", en = lang === "en";

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault(); setNlState("loading");
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: nlEmail }) });
    if (res.ok) trackEvent("newsletter_signup");
    setNlState(res.ok ? "success" : "error");
  }

  const statsCfg = [
    { value: stats.trips  > 0 ? `${stats.trips.toLocaleString("pt-BR")}+`        : t.stats.fallbackTrips, label: stats.trips  > 0 ? t.stats.labelTrips   : t.stats.trips   },
    { value: stats.users  > 0 ? `${stats.users.toLocaleString("pt-BR")}+`        : t.stats.fallbackUsers, label: stats.users  > 0 ? t.stats.users        : t.stats.labelUsers },
    { value: stats.destinations > 0 ? `${stats.destinations.toLocaleString("pt-BR")}+` : t.stats.fallbackDests, label: stats.destinations > 0 ? t.stats.destinations : t.stats.labelDests },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-vibe-dark">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle bg-grid-48 opacity-100" aria-hidden />
      <div className="fixed top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none bg-glow-blue" aria-hidden />
      <div className="fixed bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none bg-glow-teal" aria-hidden />

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/5 backdrop-blur-sm bg-slate-950/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cta-blue shadow-primary-md transition-transform group-hover:scale-105">
            <Plane className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[17px] font-bold tracking-tight bg-logo-text bg-clip-text text-transparent">RoteiroApp</span>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold leading-none">Travel Planner</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><LangPicker lang={lang} set={setLang} /></div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">{t.nav.login}</Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-cta-blue shadow-primary-md hover:opacity-90 hover:scale-[1.02] transition-all">{t.nav.register}</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO — roteiros.png (1690×878)
          Roteiros prontos: Paris, Tóquio, Nova York
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-6">
            <Star className="h-3 w-3 fill-current" /> {t.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.07] mb-6">
            {t.hero.title1}<br />
            <span className="bg-hero-text bg-clip-text text-transparent">{t.hero.title2}</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 hover:scale-[1.02] transition-all">
              {t.hero.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
              {t.hero.ctaLogin}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {t.hero.trust.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {item}
              </span>
            ))}
          </div>
        </div>
        {/* roteiros.png — 1690×878 — sem corte — premium */}
        <div className="max-w-5xl mx-auto">
          <PremiumImg
            src={S.roteiros}
            alt={pt ? "Biblioteca de roteiros prontos: Paris 5 dias, Tóquio 7 dias e Nova York 5 dias com atividades e custo estimado"
               : en ? "Ready-made itinerary library: Paris 5 days, Tokyo 7 days, New York 5 days with activities and estimated cost"
               : "Biblioteca de rutas: París 5 días, Tokio 7 días, Nueva York 5 días con actividades y costo estimado"}
            glow="rgba(99,102,241,0.3)"
            eager
          />
          <p className="text-center text-xs text-slate-600 mt-3">
            {pt ? "Roteiros curados — aplique à sua viagem com um clique e personalize"
             : en ? "Curated itineraries — apply to your trip with one click and customize"
             : "Rutas curadas — aplica a tu viaje con un clic y personaliza"}
          </p>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 divide-x divide-white/5 text-center">
          {statsCfg.map((s, i) => (
            <div key={i} className="px-4 sm:px-8">
              <div className="text-3xl md:text-4xl font-black mb-1 bg-stats-text bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP — stats.png (1641×376)
          Cards de resumo: atividades, hospedagens, transportes...
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-14">
        <div className="text-center mb-7">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            {pt ? "Tudo numa tela só" : en ? "Everything in one screen" : "Todo en una pantalla"}
          </p>
          <h2 className="text-2xl md:text-3xl font-black">
            {pt ? <>Atividades, hospedagens, transportes, gastos.<br /><span className="text-slate-400 font-medium">Você vê tudo de relance, sem precisar procurar.</span></>
             : en ? <>Activities, stays, transport, expenses.<br /><span className="text-slate-400 font-medium">You see everything at a glance, without searching.</span></>
             : <>Actividades, alojamientos, transportes, gastos.<br /><span className="text-slate-400 font-medium">Lo ves todo de un vistazo, sin buscar.</span></>}
          </h2>
        </div>
        {/* stats.png — 1641×376 — tira horizontal — sem corte */}
        <Img src={S.stats}
          alt={pt ? "Cards de resumo da viagem: 5 atividades, 0 hospedagens, 0 transportes, 0 documentos, 0/0 malas, R$ 0,00 gastos"
             : en ? "Trip summary cards: activities, accommodations, transport, documents, packing, and expenses"
             : "Tarjetas de resumen del viaje: actividades, alojamientos, transporte, documentos, equipaje y gastos"} />
      </section>

      {/* ── DOR ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto px-6 md:px-14 py-16 text-center">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">{t.pain.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
            {t.pain.title1}<br />
            <span className="text-slate-500 font-medium">{t.pain.title2}</span><br />
            {t.pain.title3}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto mb-10">{t.pain.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {t.pain.cards.map(({ before, after, emoji }) => (
              <div key={before} className="rounded-2xl border border-white/6 p-5 bg-white/[0.03] hover:border-white/12 transition-all">
                <div className="text-2xl mb-3">{emoji}</div>
                <p className="text-sm text-rose-400/80 line-through mb-1">{before}</p>
                <p className="text-sm font-bold text-emerald-400">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE 1 — hospedagem.png (1630×915)
          Hospedagem + calendário visual
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <FeatureText
            badge={pt ? "Hospedagem organizada" : en ? "Organized stays" : "Alojamiento organizado"}
            badgeIcon={BedDouble}
            badgeColor="bg-sky-500/10 border-sky-500/20 text-sky-300"
            title={pt ? "Hotéis, Airbnb, pousada." : en ? "Hotels, Airbnbs, guesthouses." : "Hoteles, Airbnbs, posadas."}
            highlight={pt ? "Num calendário que você consegue enxergar." : en ? "In a calendar you can actually read." : "En un calendario que realmente ves."}
            desc={pt ? "Cadastre cada hospedagem com check-in, check-out, código de confirmação e site. O app monta automaticamente um calendário visual com barras coloridas — você sabe exatamente em qual hotel está em cada dia, sem abrir email nenhum."
                : en ? "Add each stay with check-in, check-out, confirmation code, and website. The app automatically builds a visual calendar with color bars — you know exactly which hotel you're in each day, without opening a single email."
                : "Agrega cada alojamiento con check-in, check-out, código de confirmación y sitio web. La app construye automáticamente un calendario visual con barras de colores — sabes exactamente en qué hotel estás cada día."}
            bullets={pt ? ["Barras coloridas no calendário por tipo de hospedagem", "Noites calculadas automaticamente entre check-in e check-out", "Código de confirmação, telefone e site sempre visíveis"]
                       : en ? ["Color-coded calendar bars by accommodation type", "Nights automatically calculated between check-in and check-out", "Confirmation code, phone, and website always visible"]
                       : ["Barras de colores en el calendario por tipo de alojamiento", "Noches calculadas automáticamente entre check-in y check-out", "Código de confirmación, teléfono y sitio siempre visibles"]}
            bulletColor="text-sky-400"
            cta={pt ? "Organizar minha hospedagem" : en ? "Organize my stays" : "Organizar mi alojamiento"}
            ctaHref="/register"
            ctaColor="bg-sky-600 hover:bg-sky-500"
          />
          {/* hospedagem.png — 1630×915 — sem corte */}
          <Img src={S.hospedagem}
            alt={pt ? "Calendário visual de hospedagem com check-in e check-out por cores, e cards de resumo da viagem"
               : en ? "Visual accommodation calendar with color-coded check-in/check-out and trip summary cards"
               : "Calendario visual de alojamiento con check-in/check-out por colores"} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE 2 — cotação.png (1644×837)
          Câmbio e conversão automática
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* cotação.png — 1644×837 — sem corte — premium */}
            <PremiumImg
              src={S.cotacao}
              alt={pt ? "Cotação ao vivo de moedas: euro, dólar, iene, libra e mais de 150 moedas com conversão automática"
                 : en ? "Live currency rates: euro, dollar, yen, pound and 150+ currencies with automatic conversion"
                 : "Cotizaciones en vivo: euro, dólar, yen, libra y más de 150 monedas"}
              glow="rgba(245,158,11,0.2)"
            />
            <FeatureText
              badge={pt ? "Câmbio em tempo real" : en ? "Real-time exchange" : "Cambio en tiempo real"}
              badgeIcon={Globe}
              badgeColor="bg-amber-500/10 border-amber-500/20 text-amber-300"
              title={pt ? "Euro, dólar, iene, libra." : en ? "Euro, dollar, yen, pound." : "Euro, dólar, yen, libra."}
              highlight={pt ? "Quanto custa em reais? Na hora." : en ? "How much in BRL? Instantly." : "¿Cuánto en reales? Al instante."}
              desc={pt ? "Cotação ao vivo de mais de 150 moedas direto no app — sem abrir outra aba, sem fazer conta de cabeça no aeroporto. Converta qualquer valor e acompanhe o histórico para saber o melhor momento de trocar."
                  : en ? "Live rates for 150+ currencies right in the app — no opening another tab, no mental math at the airport. Convert any amount and track history to know the best moment to exchange."
                  : "Cotizaciones en vivo de +150 monedas directamente en la app — sin abrir otra pestaña, sin calcular mentalmente en el aeropuerto. Convierte cualquier valor y sigue el historial."}
              bullets={pt ? ["Cotação atualizada em tempo real para +150 moedas", "Conversão automática nos gastos da viagem", "Histórico de câmbio para planejar a troca"]
                         : en ? ["Real-time rates for 150+ currencies", "Automatic conversion on trip expenses", "Exchange history to plan your conversion"]
                         : ["Cotizaciones en tiempo real para +150 monedas", "Conversión automática en los gastos del viaje", "Historial de cambio para planificar la conversión"]}
              bulletColor="text-amber-400"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE 3 — dicas.png (1630×869)
          Dicas e guias de viagem
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <FeatureText
            badge={pt ? "Dicas e guias" : en ? "Tips & guides" : "Consejos y guías"}
            badgeIcon={Lightbulb}
            badgeColor="bg-teal-500/10 border-teal-500/20 text-teal-300"
            title={pt ? "Voos baratos, segurança, documentos." : en ? "Cheap flights, safety, documents." : "Vuelos baratos, seguridad, documentos."}
            highlight={pt ? "28 guias de quem já foi e voltou." : en ? "28 guides from travelers who've been there." : "28 guías de quienes ya estuvieron."}
            desc={pt ? "Toda semana novos artigos escritos por viajantes experientes — não por agências de turismo. Filtre por categoria (finanças, segurança, tecnologia, saúde) ou por idioma, e encontre o que precisa antes de embarcar."
                : en ? "New articles every week written by experienced travelers — not by travel agencies. Filter by category (finance, safety, technology, health) or language, and find what you need before boarding."
                : "Nuevos artículos cada semana escritos por viajeros experimentados — no por agencias de turismo. Filtra por categoría o idioma, y encuentra lo que necesitas antes de embarcar."}
            bullets={pt ? ["28 artigos em PT, EN e ES — crescendo toda semana", "Categorias: finanças, segurança, documentos, tecnologia, saúde", "Sem papo de agência — dicas reais de quem viajou"]
                       : en ? ["28 articles in PT, EN and ES — growing every week", "Categories: finance, safety, documents, technology, health", "No agency talk — real tips from real travelers"]
                       : ["28 artículos en PT, EN y ES — creciendo cada semana", "Categorías: finanzas, seguridad, documentos, tecnología, salud", "Sin discurso de agencia — consejos reales de viajeros"]}
            bulletColor="text-teal-400"
          />
          {/* dicas.png — 1630×869 — sem corte — premium */}
          <PremiumImg
            src={S.dicas}
            alt={pt ? "Página de dicas com artigos sobre voos baratos, viagem solo feminina, Google Maps offline e passaporte sem visto"
               : en ? "Tips page with articles on cheap flights, solo female travel, offline Google Maps and visa-free passport"
               : "Página de consejos con artículos sobre vuelos baratos, viaje solo femenino, Google Maps sin conexión"}
            glow="rgba(20,184,166,0.2)"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPERIENCES BANNER — experiences.png (1698×637)
          Lista de experiências — imagem wide, full-width
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-4">
              <Camera className="h-3 w-3" />
              {pt ? "Minhas experiências" : en ? "My experiences" : "Mis experiencias"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              {pt ? <>A viagem acaba. O relato<br /><span className="text-pink-400">fica para sempre.</span></>
               : en ? <>The trip ends. The story<br /><span className="text-pink-400">lasts forever.</span></>
               : <>El viaje termina. El relato<br /><span className="text-pink-400">queda para siempre.</span></>}
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
              {pt ? "Guarde suas aventuras com foto, avaliação e humor. Compartilhe com a comunidade e inspire quem ainda está planejando."
               : en ? "Keep your adventures with photos, ratings, and mood. Share with the community and inspire those still planning."
               : "Guarda tus aventuras con foto, valoración y humor. Comparte con la comunidad e inspira a quienes aún planifican."}
            </p>
          </div>
          {/* experiences.png — 1698×637 — imagem wide, proporcional — sem corte */}
          <Img src={S.exps}
            alt={pt ? "Lista de experiências de viagem com destaque para Visita ao Coliseu em Roma, avaliação 4 estrelas e mood Incrível"
               : en ? "Travel experiences list featuring a visit to the Colosseum in Rome, 4-star rating and Incredible mood"
               : "Lista de experiencias con visita al Coliseo en Roma, 4 estrellas y humor Increíble"} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE 4 — experience-detail.png (1707×889)
          Detalhe de relato de viagem
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* experience-detail.png — 1707×889 — sem corte — premium */}
          <PremiumImg
            src={S.detail}
            alt={pt ? "Detalhe do relato Visita Coliseu: foto de capa, avaliação 4/5, texto completo do relato e hashtags #Coliseu #Roma"
               : en ? "Experience detail: Colosseum Visit with cover photo, 4/5 rating, full story text and hashtags #Colosseum #Rome"
               : "Detalle de experiencia: Visita al Coliseo con foto, valoración 4/5, texto del relato y hashtags"}
            glow="rgba(236,72,153,0.2)"
          />
          <FeatureText
            badge={pt ? "Diário de bordo" : en ? "Travel diary" : "Diario de a bordo"}
            badgeIcon={BookOpen}
            badgeColor="bg-pink-500/10 border-pink-500/20 text-pink-300"
            title={pt ? "Do Coliseu à Muralha da China." : en ? "From the Colosseum to the Great Wall." : "Del Coliseo a la Gran Muralla."}
            highlight={pt ? "Cada detalhe documentado." : en ? "Every detail documented." : "Cada detalle documentado."}
            desc={pt ? "Escreva relatos completos com foto de capa, avaliação em estrelas, humor da viagem e hashtags. Seu diário digital fica guardado para sempre — e pode inspirar outros viajantes a descobrirem os mesmos lugares."
                : en ? "Write full stories with cover photo, star rating, trip mood, and hashtags. Your digital diary is saved forever — and can inspire other travelers to discover the same places."
                : "Escribe relatos completos con foto de portada, valoración en estrellas, humor del viaje y hashtags. Tu diario digital se guarda para siempre — e inspira a otros viajeros."}
            bullets={pt ? ["Foto de capa, avaliação e humor da viagem por relato", "Hashtags para descobrir relatos do mesmo destino", "Públique para a comunidade ou mantenha privado"]
                       : en ? ["Cover photo, rating, and trip mood per story", "Hashtags to discover stories from the same destination", "Publish to the community or keep it private"]
                       : ["Foto de portada, valoración y humor del viaje", "Hashtags para descubrir relatos del mismo destino", "Publica para la comunidad o mantenlo privado"]}
            bulletColor="text-pink-400"
          />
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="relative z-10 border-t border-white/5 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">{t.testimonials.eyebrow}</p>
            <h2 className="text-3xl font-black tracking-tight">{t.testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.testimonials.items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/6 p-6 bg-white/[0.03] hover:border-white/12 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[11px] font-black text-white shrink-0`}>
                    {item.av}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-600">{item.dest}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
        <div className="rounded-3xl p-10 md:p-16 text-center border border-blue-500/20 relative overflow-hidden bg-cta-section">
          <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-blue-600/10 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-cta-blue shadow-primary-lg ring-4 ring-blue-500/10">
              <Plane className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">{t.cta.title}</h2>
            <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto leading-relaxed">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 hover:scale-[1.03] transition-all">
                {t.cta.button} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                {t.cta.login}
              </Link>
            </div>
            <p className="text-slate-700 text-xs mt-6">{t.cta.fine}</p>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Star className="h-4 w-4 text-violet-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-300 leading-none">{t.newsletter.title}</p>
              <p className="text-xs text-slate-600 mt-0.5">{t.newsletter.subtitle}</p>
            </div>
          </div>
          {nlState === "success" ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold shrink-0">
              <CheckCircle className="h-4 w-4" /> {t.newsletter.success}
            </span>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <input type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all w-full sm:w-48" />
              <button type="submit" disabled={nlState === "loading"}
                className="shrink-0 px-4 py-2 rounded-lg font-bold text-xs text-white bg-cta-violet hover:opacity-90 disabled:opacity-60 transition-all">
                {nlState === "loading" ? "..." : t.newsletter.button}
              </button>
            </form>
          )}
          {nlState === "error" && <p className="text-red-400 text-[10px] sm:ml-2">{t.newsletter.error}</p>}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-14 bg-black/25">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cta-blue">
              <Plane className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">RoteiroApp</span>
              <p className="text-[10px] text-slate-700">{t.footer.copy}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            {t.footer.links.map(({ label, href }) => (
              <a key={href} href={href} className="hover:text-slate-300 transition-colors">{label}</a>
            ))}
          </div>
          <LangPicker lang={lang} set={setLang} />
        </div>
      </footer>
    </div>
  );
}
