"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, ArrowRight, CheckCircle, Star, MapPin,
  Zap, BookOpen, Route, Globe, BedDouble,
  TrendingUp, Lightbulb, Camera,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";

// ── Imagens (todas em public/screenshots/) ──────────────────────
const IMG = {
  roteiros:   "/screenshots/roteiros.png",          // 1690×878  (16:9) — hero
  hospedagem: "/screenshots/hospedagem.png",         // 1630×915  (16:9) — feature
  cotacao:    "/screenshots/cotação.png",            // 1644×837  (16:9) — feature
  dicas:      "/screenshots/dicas.png",              // 1630×869  (16:9) — feature
  detail:     "/screenshots/experience-detail.png",  // 1707×889  (16:9) — feature
  exps:       "/screenshots/experiences.png",        // 1698×637  (wide) — banner
  stats:      "/screenshots/stats.png",              // 1641×376  (strip) — strip
  sidebar:    "/screenshots/sidebar.png",            // 257×913   (narrow) — preview
} as const;

// Exibe imagem sem corte — proporcional ao arquivo original
function Screenshot({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
    </div>
  );
}

// Seletor de idioma
const LANGS: { id: LandingLang; flag: string; label: string }[] = [
  { id: "pt", flag: "🇧🇷", label: "PT" },
  { id: "en", flag: "🇬🇧", label: "EN" },
  { id: "es", flag: "🇪🇸", label: "ES" },
];

function LangSelector({ lang, setLang }: { lang: LandingLang; setLang: (l: LandingLang) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border border-white/8 bg-white/[0.04]">
      {LANGS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setLang(opt.id)}
          aria-label={opt.label}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            lang === opt.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span>{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

interface Props {
  stats: { users: number; trips: number; destinations: number };
}

export function LandingClient({ stats }: Props) {
  const [lang, setLang]       = useState<LandingLang>("pt");
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = landingI18n[lang];

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNlState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nlEmail }),
    });
    setNlState(res.ok ? "success" : "error");
  }

  const tripsValue = stats.trips        > 0 ? `${stats.trips.toLocaleString("pt-BR")}+`        : t.stats.fallbackTrips;
  const usersValue = stats.users        > 0 ? `${stats.users.toLocaleString("pt-BR")}+`        : t.stats.fallbackUsers;
  const destsValue = stats.destinations > 0 ? `${stats.destinations.toLocaleString("pt-BR")}+` : t.stats.fallbackDests;
  const tripsLabel = stats.trips        > 0 ? t.stats.labelTrips   : t.stats.trips;
  const usersLabel = stats.users        > 0 ? t.stats.users        : t.stats.labelUsers;
  const destsLabel = stats.destinations > 0 ? t.stats.destinations : t.stats.labelDests;

  // Helpers de copy multi-língua inline
  const pt = lang === "pt", en = lang === "en";

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
          <div className="hidden sm:block"><LangSelector lang={lang} setLang={setLang} /></div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            {t.nav.login}
          </Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-cta-blue shadow-primary-md hover:opacity-90 hover:scale-[1.02] transition-all">
            {t.nav.register}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
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

        {/* Hero screenshot — roteiros.png (16:9, sem corte) */}
        <div className="relative max-w-5xl mx-auto">
          <Screenshot src={IMG.roteiros} alt={pt ? "Roteiros prontos — Paris, Tóquio, Nova York" : en ? "Ready-made itineraries — Paris, Tokyo, New York" : "Rutas listas — París, Tokio, Nueva York"} />
          <div className="absolute -top-3 -right-3 sm:-right-6 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300 bg-emerald-500/10 backdrop-blur-md shadow-lg">
            <CheckCircle className="h-3.5 w-3.5" />
            {pt ? "Roteiros curados e prontos" : en ? "Curated, ready-made routes" : "Rutas curadas y listas"}
          </div>
          <div className="absolute -bottom-3 -left-3 sm:-left-6 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300 bg-blue-500/10 backdrop-blur-md shadow-lg">
            <Route className="h-3.5 w-3.5" />
            {pt ? "Aplique com 1 clique" : en ? "Apply with 1 click" : "Aplica con 1 clic"}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 divide-x divide-white/5 text-center">
          {[
            { value: tripsValue, label: tripsLabel },
            { value: usersValue, label: usersLabel },
            { value: destsValue, label: destsLabel },
          ].map((s, i) => (
            <div key={i} className="px-4 sm:px-8">
              <div className="text-3xl md:text-4xl font-black mb-1 bg-stats-text bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP (stats.png — tira horizontal proporcional) ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-12">
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {pt ? "Tudo numa tela só" : en ? "Everything in one screen" : "Todo en una sola pantalla"}
          </p>
          <h2 className="text-2xl font-black mt-1">
            {pt ? "Atividades, gastos, malas, documentos —" : en ? "Activities, expenses, packing, documents —" : "Actividades, gastos, equipaje, documentos —"}
            {" "}<span className="text-slate-400 font-medium">{pt ? "de relance." : en ? "at a glance." : "de un vistazo."}</span>
          </h2>
        </div>
        <Screenshot
          src={IMG.stats}
          alt={pt ? "Cards de resumo da viagem: atividades, hospedagens, transportes, documentos, malas e gastos" : en ? "Trip summary cards: activities, stays, transport, documents, packing and expenses" : "Tarjetas de resumen del viaje"}
          className="shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        />
      </section>

      {/* ── DOR ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-14 py-16 text-center">
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
      </section>

      {/* ── FEATURE 1: HOSPEDAGEM ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-bold mb-5">
              <BedDouble className="h-3 w-3" />
              {pt ? "Hospedagem organizada" : en ? "Organized accommodation" : "Alojamiento organizado"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {pt ? <>Hotéis, Airbnb, pousada —<br /><span className="text-sky-400">tudo no mesmo calendário visual.</span></> :
               en ? <>Hotels, Airbnbs, guesthouses —<br /><span className="text-sky-400">all in the same visual calendar.</span></> :
               <>Hoteles, Airbnbs, posadas —<br /><span className="text-sky-400">todo en el mismo calendario visual.</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {pt ? "Cadastre cada hospedagem com check-in, check-out, código de confirmação e site. O app monta o calendário automaticamente — você vê exatamente em qual hotel está em cada dia da viagem, sem abrir email nenhum." :
               en ? "Add each stay with check-in, check-out, confirmation code, and website. The app builds the calendar automatically — you see exactly which hotel you're in on each day, without opening a single email." :
               "Agrega cada alojamiento con check-in, check-out, código de confirmación y sitio web. La app construye el calendario automáticamente — ves exactamente en qué hotel estás cada día, sin abrir ningún correo."}
            </p>
            <ul className="space-y-3 mb-8">
              {(pt ? [
                "Barras coloridas no calendário — uma cor por hospedagem",
                "Número de noites calculado automaticamente",
                "Código de confirmação, telefone e link sempre visíveis",
              ] : en ? [
                "Color-coded calendar bars — one color per stay",
                "Night count calculated automatically",
                "Confirmation code, phone, and link always visible",
              ] : [
                "Barras de colores en el calendario — un color por alojamiento",
                "Cantidad de noches calculada automáticamente",
                "Código de confirmación, teléfono y enlace siempre visibles",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-lg hover:scale-[1.02]">
              {pt ? "Começar a organizar" : en ? "Start organizing" : "Empezar a organizar"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* hospedagem.png — 1630×915, proporcional */}
          <Screenshot src={IMG.hospedagem} alt={pt ? "Página de hospedagem com calendário visual de check-in e check-out" : en ? "Accommodation page with visual check-in/check-out calendar" : "Página de alojamiento con calendario visual"} />
        </div>
      </section>

      {/* ── FEATURE 2: ROTEIROS ── */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* roteiros.png — 1690×878, proporcional */}
          <Screenshot src={IMG.roteiros} alt={pt ? "Roteiros prontos: Paris, Tóquio e Nova York com atividades e custo estimado" : en ? "Ready-made itineraries: Paris, Tokyo, New York with activities and estimated cost" : "Rutas listas: París, Tokio, Nueva York"} />
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-5">
              <Route className="h-3 w-3" />
              {pt ? "Roteiros prontos" : en ? "Ready-made itineraries" : "Rutas listas"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {pt ? <>Paris, Tóquio, Nova York —<br /><span className="text-violet-400">já está tudo feito por você.</span></> :
               en ? <>Paris, Tokyo, New York —<br /><span className="text-violet-400">it's all done for you.</span></> :
               <>París, Tokio, Nueva York —<br /><span className="text-violet-400">ya está todo hecho para ti.</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {pt ? "Escolha um destino, veja as atividades sugeridas com horários e custo estimado, e aplique à sua viagem com um clique. Você pode editar tudo — é um ponto de partida, não uma prisão." :
               en ? "Choose a destination, see suggested activities with times and estimated cost, then apply to your trip with one click. You can edit everything — it's a starting point, not a prison." :
               "Elige un destino, ve las actividades sugeridas con horarios y costo estimado, y aplica a tu viaje con un clic. Puedes editarlo todo — es un punto de partida, no una cárcel."}
            </p>
            <ul className="space-y-3 mb-8">
              {(pt ? [
                "10 roteiros curados — os destinos mais procurados por brasileiros",
                "Atividades, horários e custo estimado incluídos",
                "Comunidade publicando novos roteiros toda semana",
              ] : en ? [
                "10 curated itineraries — top destinations for Brazilian travelers",
                "Activities, times, and estimated costs included",
                "Community publishing new routes every week",
              ] : [
                "10 itinerarios curados — los destinos más buscados",
                "Actividades, horarios y costos estimados incluidos",
                "Comunidad publicando nuevas rutas cada semana",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURE 3: CÂMBIO ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-5">
              <Globe className="h-3 w-3" />
              {pt ? "Câmbio e moedas" : en ? "Currency & exchange" : "Divisas y cambio"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {pt ? <>Quanto custa em reais?<br /><span className="text-amber-400">A resposta aparece na hora.</span></> :
               en ? <>How much is that in BRL?<br /><span className="text-amber-400">The answer appears instantly.</span></> :
               <>¿Cuánto cuesta en reales?<br /><span className="text-amber-400">La respuesta aparece al instante.</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {pt ? "Cotação ao vivo de +150 moedas direto no app. Converta euros, ienes, dólares e libras sem abrir outra aba. O histórico de câmbio te ajuda a planejar a melhor época para trocar." :
               en ? "Live rates for 150+ currencies right in the app. Convert euros, yen, dollars, and pounds without opening another tab. Exchange rate history helps you plan the best time to convert." :
               "Cotizaciones en vivo de +150 monedas directamente en la app. Convierte euros, yenes, dólares y libras sin abrir otra pestaña. El historial te ayuda a planificar el mejor momento para cambiar."}
            </p>
            <ul className="space-y-3 mb-8">
              {(pt ? [
                "Cotação ao vivo — atualizada em tempo real",
                "Conversão automática nos seus gastos cadastrados",
                "Histórico de câmbio para planejar melhor",
              ] : en ? [
                "Live exchange rates — updated in real time",
                "Automatic conversion on your registered expenses",
                "Rate history to plan your conversion timing",
              ] : [
                "Cotizaciones en vivo — actualizadas en tiempo real",
                "Conversión automática en tus gastos registrados",
                "Historial de tasas para planificar mejor",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          {/* cotação.png — 1644×837, proporcional */}
          <Screenshot src={IMG.cotacao} alt={pt ? "Cotação e conversão de moedas em tempo real" : en ? "Real-time currency rates and conversion" : "Cotizaciones en tiempo real"} />
        </div>
      </section>

      {/* ── FEATURE 4: DICAS ── */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* dicas.png — 1630×869, proporcional */}
          <Screenshot src={IMG.dicas} alt={pt ? "Dicas e guias de viagem: voos baratos, segurança, documentos, tecnologia" : en ? "Travel tips and guides: cheap flights, safety, documents, tech" : "Consejos y guías de viaje"} />
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold mb-5">
              <Lightbulb className="h-3 w-3" />
              {pt ? "Dicas e guias de viagem" : en ? "Travel tips & guides" : "Consejos y guías de viaje"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {pt ? <>28 guias escritos por<br /><span className="text-teal-400">quem já foi e voltou.</span></> :
               en ? <>28 guides written by<br /><span className="text-teal-400">people who've been there.</span></> :
               <>28 guías escritas por<br /><span className="text-teal-400">quienes ya estuvieron allí.</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {pt ? "Voos baratos, segurança em viagem solo, como usar Google Maps offline, passaporte sem visto — novos artigos toda semana. Filtre por categoria, idioma ou destino." :
               en ? "Cheap flights, solo travel safety, Google Maps offline, visa-free destinations — new articles every week. Filter by category, language, or destination." :
               "Vuelos baratos, seguridad en viaje solo, Google Maps sin conexión, pasaportes sin visa — nuevos artículos cada semana. Filtra por categoría, idioma o destino."}
            </p>
            <ul className="space-y-3">
              {(pt ? [
                "28 artigos em PT, EN e ES — e crescendo",
                "Categorias: finanças, segurança, documentos, tecnologia",
                "Escritos por viajantes experientes, sem papo de agência",
              ] : en ? [
                "28 articles in PT, EN, and ES — and growing",
                "Categories: finance, safety, documents, technology",
                "Written by experienced travelers, not travel agents",
              ] : [
                "28 artículos en PT, EN y ES — y creciendo",
                "Categorías: finanzas, seguridad, documentos, tecnología",
                "Escritos por viajeros experimentados, sin discurso de agencia",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCES BANNER (wide image — proporcional, full-width) ── */}
      <section className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-4">
              <Camera className="h-3 w-3" />
              {pt ? "Minhas experiências" : en ? "My experiences" : "Mis experiencias"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              {pt ? <>A viagem acaba. A memória<br /><span className="text-pink-400">não precisa acabar junto.</span></> :
               en ? <>The trip ends. The memory<br /><span className="text-pink-400">doesn't have to end with it.</span></> :
               <>El viaje termina. El recuerdo<br /><span className="text-pink-400">no tiene por qué terminar también.</span></>}
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
              {pt ? "Escreva relatos com fotos, dê nota e compartilhe o que viveu. Seus relatos inspiram outros viajantes — e você nunca mais perde aquela dica impagável que descobriu na viagem." :
               en ? "Write stories with photos, rate your experiences, and share what you lived. Your stories inspire other travelers — and you never lose that priceless tip you discovered on your trip." :
               "Escribe relatos con fotos, puntúa y comparte lo que viviste. Tus relatos inspiran a otros viajeros — y nunca pierdes ese consejo invaluable que descubriste en el viaje."}
            </p>
          </div>
          {/* experiences.png — 1698×637, proporcional (wide) */}
          <Screenshot src={IMG.exps} alt={pt ? "Lista de experiências de viagem com destaque para Visita ao Coliseu em Roma" : en ? "Travel experiences list featuring a visit to the Colosseum in Rome" : "Lista de experiencias de viaje"} />
        </div>
      </section>

      {/* ── FEATURE 5: RELATOS ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-5">
              <BookOpen className="h-3 w-3" />
              {pt ? "Diário de bordo" : en ? "Travel diary" : "Diario de a bordo"}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {pt ? <>Do Coliseu à Muralha da China.<br /><span className="text-pink-400">Documente cada momento.</span></> :
               en ? <>From the Colosseum to the Great Wall.<br /><span className="text-pink-400">Document every moment.</span></> :
               <>Del Coliseo a la Gran Muralla.<br /><span className="text-pink-400">Documenta cada momento.</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {pt ? "Escreva relatos completos com foto de capa, nota de avaliação, humor da viagem e hashtags. Seu diário de bordo digital fica guardado para sempre — e pode inspirar outros viajantes." :
               en ? "Write full stories with cover photo, rating, trip mood, and hashtags. Your digital travel diary is saved forever — and can inspire other travelers." :
               "Escribe relatos completos con foto de portada, valoración, humor del viaje y hashtags. Tu diario digital se guarda para siempre — y puede inspirar a otros viajeros."}
            </p>
            <ul className="space-y-3">
              {(pt ? [
                "Capa com foto, avaliação em estrelas e humor da viagem",
                "Hashtags para categorizar e descobrir relatos similares",
                "Publique para a comunidade ou mantenha privado",
              ] : en ? [
                "Cover photo, star rating, and trip mood",
                "Hashtags to categorize and discover similar stories",
                "Publish to the community or keep it private",
              ] : [
                "Foto de portada, valoración en estrellas y humor del viaje",
                "Hashtags para categorizar y descubrir relatos similares",
                "Publica para la comunidad o mantenlo privado",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          {/* experience-detail.png — 1707×889, proporcional */}
          <Screenshot src={IMG.detail} alt={pt ? "Detalhe de experiência: Visita ao Coliseu com relato, avaliação e hashtags" : en ? "Experience detail: Colosseum visit with story, rating and hashtags" : "Detalle de experiencia: visita al Coliseo"} />
        </div>
      </section>

      {/* ── APP PREVIEW: Sidebar + visão geral ── */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {pt ? "Navegação simples" : en ? "Simple navigation" : "Navegación simple"}
            </p>
            <h2 className="text-2xl font-black">
              {pt ? <>Menu limpo, tudo a um toque.<br /><span className="text-slate-400 font-medium">Feito para mobile e desktop.</span></> :
               en ? <>Clean menu, everything one tap away.<br /><span className="text-slate-400 font-medium">Built for mobile and desktop.</span></> :
               <>Menú limpio, todo a un toque.<br /><span className="text-slate-400 font-medium">Hecho para móvil y escritorio.</span></>}
            </h2>
          </div>
          {/* sidebar.png — 257×913 — mostrada na largura natural */}
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]" style={{ maxWidth: "320px" }}>
              <img src={IMG.sidebar} alt={pt ? "Menu lateral do RoteiroApp com navegação entre seções" : en ? "RoteiroApp side menu with navigation between sections" : "Menú lateral de RoteiroApp"} className="w-full h-auto block" loading="lazy" />
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-4">
            {pt ? "Menu lateral com acesso a Roteiros, Dicas, Experiências, Perfil e muito mais" :
             en ? "Side menu with access to Routes, Tips, Experiences, Profile, and more" :
             "Menú lateral con acceso a Rutas, Consejos, Experiencias, Perfil y más"}
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-16">
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
              <input
                type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all w-full sm:w-48"
              />
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
          <LangSelector lang={lang} setLang={setLang} />
        </div>
      </footer>
    </div>
  );
}
