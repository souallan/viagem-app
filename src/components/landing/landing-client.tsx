"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, ArrowRight, CheckCircle, Star,
  MapPin, Zap, BookOpen, Route, Globe,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";

const LANGS: { id: LandingLang; flag: string; label: string }[] = [
  { id: "pt", flag: "🇧🇷", label: "PT" },
  { id: "en", flag: "🇬🇧", label: "EN" },
  { id: "es", flag: "🇪🇸", label: "ES" },
];

const PILLAR_ICONS = [Zap, Route, BookOpen];
const PILLAR_COLORS = {
  blue:   { badge: "bg-blue-500/10 border-blue-500/20 text-blue-300",   icon: "text-blue-400"   },
  violet: { badge: "bg-violet-500/10 border-violet-500/20 text-violet-300", icon: "text-violet-400" },
  pink:   { badge: "bg-pink-500/10 border-pink-500/20 text-pink-300",   icon: "text-pink-400"   },
} as const;

// Pilar 1 usa elemento especial (tiras empilhadas), 2 e 3 usam AppScreen
const PILLAR2_IMG = "/screenshots/roteiros.png";
const PILLAR3_IMG = "/screenshots/experience-detail.png";

function AppScreen({
  src, alt, height = 360, pos = "top center", className = "",
}: {
  src: string; alt: string; height?: number; pos?: string; className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${className}`}
      style={{ height }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition: pos }}
        loading="lazy"
      />
    </div>
  );
}

function LangSelector({ lang, setLang, compact }: { lang: LandingLang; setLang: (l: LandingLang) => void; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg border border-white/8 bg-white/[0.04]`}>
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
          {!compact && <span>{opt.label}</span>}
        </button>
      ))}
    </div>
  );
}

interface Props {
  stats: { users: number; trips: number; destinations: number };
}

export function LandingClient({ stats }: Props) {
  const [lang, setLang] = useState<LandingLang>("pt");
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

  const tripsValue = stats.trips  > 0 ? `${stats.trips.toLocaleString("pt-BR")}+`        : t.stats.fallbackTrips;
  const usersValue = stats.users  > 0 ? `${stats.users.toLocaleString("pt-BR")}+`        : t.stats.fallbackUsers;
  const destsValue = stats.destinations > 0 ? `${stats.destinations.toLocaleString("pt-BR")}+` : t.stats.fallbackDests;

  const tripsLabel = stats.trips        > 0 ? t.stats.labelTrips : t.stats.trips;
  const usersLabel = stats.users        > 0 ? t.stats.users      : t.stats.labelUsers;
  const destsLabel = stats.destinations > 0 ? t.stats.destinations : t.stats.labelDests;

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-vibe-dark">

      {/* Decoração de fundo */}
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
          <div className="hidden sm:block">
            <LangSelector lang={lang} setLang={setLang} />
          </div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            {t.nav.login}
          </Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-cta-blue shadow-primary-md hover:opacity-90 hover:scale-[1.02] transition-all">
            {t.nav.register}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-6">
            <Star className="h-3 w-3 fill-current" />
            {t.hero.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.07] mb-6">
            {t.hero.title1}<br />
            <span className="bg-hero-text bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

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

        {/* Screenshot hero — empilha header + stats para simular tela completa */}
        <div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <img src="/screenshots/trip-overview.png" alt="Cabeçalho da viagem no RoteiroApp" className="w-full block" loading="eager" />
            <img src="/screenshots/stats.png"         alt="Cards de estatísticas da viagem" className="w-full block" loading="eager" />
          </div>
          <div className="absolute -top-4 -right-4 sm:-right-8 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300 bg-emerald-500/10 backdrop-blur-md shadow-lg">
            <CheckCircle className="h-3.5 w-3.5" /> {t.hero.badgeBudget}
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-left-8 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300 bg-blue-500/10 backdrop-blur-md shadow-lg">
            <MapPin className="h-3.5 w-3.5" /> {t.hero.badgeActivities}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] mt-12">
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

      {/* ── DOR ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-14 py-20 text-center">
        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">{t.pain.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
          {t.pain.title1}<br />
          <span className="text-slate-500 font-medium">{t.pain.title2}</span><br />
          {t.pain.title3}
        </h2>
        <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto mb-12">
          {t.pain.desc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {t.pain.cards.map(({ before, after, emoji }) => (
            <div key={before} className="rounded-2xl border border-white/6 p-5 bg-white/[0.03] hover:border-white/12 transition-all">
              <div className="text-2xl mb-4">{emoji}</div>
              <p className="text-sm text-rose-400/80 line-through mb-1">{before}</p>
              <p className="text-sm font-bold text-emerald-400">{after}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOWCASE: telas reais ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.showcase.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t.showcase.title1}<br />
              <span className="text-slate-500 font-medium">{t.showcase.title2}</span>
            </h2>
          </div>

          {/* Linha 1: sidebar estreita (257px natural) + dicas (16:9) */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 mb-4">
            <AppScreen
              src="/screenshots/sidebar.png"
              alt={t.showcase.alts.sidebar}
              height={420}
              pos="top center"
            />
            <AppScreen
              src="/screenshots/dicas.png"
              alt={t.showcase.alts.dicas}
              height={420}
              pos="top center"
            />
          </div>

          {/* Linha 2: roteiros (16:9) + experiences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AppScreen
              src="/screenshots/roteiros.png"
              alt={t.showcase.alts.stats}
              height={360}
              pos="top center"
            />
            <AppScreen
              src="/screenshots/experiences.png"
              alt={t.showcase.alts.experiences}
              height={360}
              pos="top center"
            />
          </div>
        </div>
      </section>

      {/* ── 3 PILARES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            {lang === "pt" ? "Por que o RoteiroApp" : lang === "en" ? "Why RoteiroApp" : "Por qué RoteiroApp"}
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {lang === "pt" ? <>Três coisas que vão mudar<br /><span className="text-slate-500 font-medium">como você planeja viagens.</span></> :
             lang === "en" ? <>Three things that will change<br /><span className="text-slate-500 font-medium">how you plan trips.</span></> :
             <>Tres cosas que cambiarán<br /><span className="text-slate-500 font-medium">cómo planificas tus viajes.</span></>}
          </h2>
        </div>

        <div className="space-y-20">
          {t.pillars.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i];
            const colors = PILLAR_COLORS[pillar.color as keyof typeof PILLAR_COLORS];
            const isEven = i % 2 === 0;

            const screenshot = i === 0 ? (
              /* Pilar 1: empilha header + stats para tela completa */
              <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]`}>
                <img src="/screenshots/trip-overview.png" alt="Cabeçalho da viagem" className="w-full block" loading="lazy" />
                <img src="/screenshots/stats.png"         alt="Cards de estatísticas" className="w-full block" loading="lazy" />
              </div>
            ) : i === 1 ? (
              <AppScreen src={PILLAR2_IMG} alt={pillar.alt} height={440} pos="top center" />
            ) : (
              <AppScreen src={PILLAR3_IMG} alt={pillar.alt} height={440} pos="top center" />
            );

            return (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={isEven ? "" : "lg:order-last"}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-5 ${colors.badge}`}>
                    <Icon className={`h-3 w-3 ${colors.icon}`} />
                    {pillar.badge}
                  </div>
                  <h3 className="text-2xl font-black mb-4">
                    {pillar.title1}<br />{pillar.title2}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{pillar.desc}</p>
                  <ul className="space-y-2.5">
                    {pillar.bullets.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={!isEven ? "lg:order-first" : ""}>{screenshot}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-20">
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
                type="email"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all w-full sm:w-48"
              />
              <button
                type="submit"
                disabled={nlState === "loading"}
                className="shrink-0 px-4 py-2 rounded-lg font-bold text-xs text-white bg-cta-violet hover:opacity-90 disabled:opacity-60 transition-all"
              >
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
