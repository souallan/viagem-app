"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, Map, Wallet, Package, BookOpen, Star, ArrowRight,
  CheckCircle, Globe, Lightbulb, Route, Check, X,
  MapPin, Clock, Users, TrendingUp, Shield, Zap, Monitor, AlertTriangle,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";
import { AppShowcase } from "@/components/landing/app-showcase";

const FEATURE_ICONS = [Map, Wallet, Package, Route, BookOpen, Shield];
const FEATURE_COLORS = [
  { color: "from-blue-500/20 to-blue-600/5",       iconColor: "text-blue-400",    hover: "hover:shadow-feature-blue"    },
  { color: "from-emerald-500/20 to-emerald-600/5",  iconColor: "text-emerald-400", hover: "hover:shadow-feature-emerald" },
  { color: "from-violet-500/20 to-violet-600/5",    iconColor: "text-violet-400",  hover: "hover:shadow-feature-violet"  },
  { color: "from-orange-500/20 to-orange-600/5",    iconColor: "text-orange-400",  hover: "hover:shadow-feature-blue"    },
  { color: "from-pink-500/20 to-pink-600/5",        iconColor: "text-pink-400",    hover: "hover:shadow-feature-violet"  },
  { color: "from-yellow-500/20 to-yellow-600/5",    iconColor: "text-yellow-400",  hover: "hover:shadow-feature-emerald" },
];
// Bento layout: render in this order so col-span-2 cards land naturally in 3-col grid
// Row 1: [0 span-2][5 span-1] — Row 2: [3 span-1][1 span-2] — Row 3: [4 span-1][2 span-2]
const BENTO_ORDER = [0, 5, 3, 1, 4, 2];
const BENTO_BIG = new Set([0, 1, 2]); // feature indices that get the large treatment
const STEP_ICONS = [Plane, Map, TrendingUp];
const COMMUNITY_ICONS = [BookOpen, Route, Lightbulb, Users, Globe];
const COMMUNITY_COLORS = ["text-pink-400", "text-orange-400", "text-yellow-400", "text-blue-400", "text-teal-400"];
const COMPETITORS_DATA = [
  [true, false, false], [true, true,  false], [true, false, false],
  [true, false, false], [true, false, false], [true, false, false],
  [true, false, true],  [true, false, false], [true, false, false],
];

const LANG_OPTIONS: { id: LandingLang; flag: string; label: string }[] = [
  { id: "pt", flag: "🇧🇷", label: "PT" },
  { id: "en", flag: "🇬🇧", label: "EN" },
  { id: "es", flag: "🇪🇸", label: "ES" },
];

type PageTab = "features" | "app" | "howItWorks" | "community";
const PAGE_TABS: { id: PageTab; Icon: typeof Zap }[] = [
  { id: "features",    Icon: Zap     },
  { id: "app",         Icon: Monitor },
  { id: "howItWorks",  Icon: Route   },
  { id: "community",   Icon: Users   },
];

interface Props {
  stats: { users: number; trips: number; destinations: number };
}

export function LandingClient({ stats }: Props) {
  const [lang, setLang]          = useState<LandingLang>("pt");
  const [activeTab, setActiveTab] = useState<PageTab>("features");
  const [nlEmail, setNlEmail]    = useState("");
  const [nlState, setNlState]    = useState<"idle" | "loading" | "success" | "error">("idle");
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

  const STATS_ITEMS = [
    { value: stats.trips > 0        ? `${stats.trips.toLocaleString("pt-BR")}+`        : "15.000+", label: stats.trips > 0        ? t.stats.trips        : t.stats.fallbackFeatures },
    { value: stats.users > 0        ? `${stats.users.toLocaleString("pt-BR")}+`        : "R$ 0",    label: stats.users > 0        ? t.stats.users        : t.stats.fallbackFree     },
    { value: stats.destinations > 0 ? `${stats.destinations.toLocaleString("pt-BR")}+` : "Global",  label: stats.destinations > 0 ? t.stats.destinations : t.stats.fallbackLangs    },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-vibe-dark">

      {/* Grid overlay — decorativo */}
      <div
        className="fixed inset-0 pointer-events-none bg-grid-subtle bg-grid-48 opacity-100"
        aria-hidden="true"
      />

      {/* Ambient glows — decorativo */}
      <div className="fixed top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none bg-glow-blue" aria-hidden="true" />
      <div className="fixed bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none bg-glow-teal" aria-hidden="true" />

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/5 backdrop-blur-sm bg-slate-950/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 bg-cta-blue shadow-primary-md">
            <Plane className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[17px] font-bold tracking-tight bg-logo-text bg-clip-text text-transparent">RoteiroApp</span>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold leading-none">Travel Planner</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-white/8 bg-white/[0.04]">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                aria-label={`Mudar idioma para ${opt.label}`}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === opt.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                <span aria-hidden="true">{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            {t.nav.login}
          </Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] bg-cta-blue shadow-primary-md">
            {t.nav.register}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-14 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-6">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            {t.hero.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.07] mb-5">
            {t.hero.title1}<br />
            <span className="bg-hero-text bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </h1>

          <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-lg">{t.hero.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] bg-cta-blue shadow-primary-lg"
            >
              {t.hero.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              {t.hero.ctaLogin}
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {t.hero.trust.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero mockup stack */}
        <div className="relative hidden lg:block">
          <div className="space-y-3">
            <HeroMockDashboard />
            <div className="grid grid-cols-2 gap-3">
              <HeroMockItinerary />
              <HeroMockPacking />
            </div>
          </div>

          {/* Floating badge — orçamento */}
          <div className="absolute -top-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300 bg-emerald-500/10 backdrop-blur-md">
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === "pt" ? "Orçamento no controle" : lang === "en" ? "Budget on track" : "Presupuesto controlado"}
          </div>

          {/* Floating badge — atividades */}
          <div className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300 bg-blue-500/10 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === "pt" ? "4 atividades hoje" : lang === "en" ? "4 activities today" : "4 actividades hoy"}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 divide-x divide-white/5 text-center">
          {STATS_ITEMS.map((s, i) => (
            <div key={i} className="px-4 sm:px-6">
              <div className="text-3xl md:text-4xl font-black mb-1 bg-stats-text bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAGE TABS ── */}
      <div className="sticky top-0 z-40 border-b border-white/6 backdrop-blur-md bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 md:px-14 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 min-w-max">
            {PAGE_TABS.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-pressed={activeTab === id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === id
                    ? "text-white bg-cta-blue shadow-primary-sm"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t.pageTabs[id]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="relative z-10 min-h-[60vh]">

        {/* ── TAB: FEATURES ── */}
        {activeTab === "features" && (
          <section className="max-w-6xl mx-auto px-6 md:px-14 py-16">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.features.sectionLabel}</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                {t.features.title1}<br />
                <span className="text-slate-500 font-medium">{t.features.title2}</span>
              </h2>
            </div>

            {/* Bento grid: big cards for Roteiro (0), Gastos (1) e Malas (2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BENTO_ORDER.map((fi) => {
                const f = t.features.items[fi];
                const Icon = FEATURE_ICONS[fi];
                const { color, iconColor, hover } = FEATURE_COLORS[fi];
                const isBig = BENTO_BIG.has(fi);
                return (
                  <div
                    key={f.title}
                    className={`group rounded-2xl border border-white/6 bg-white/[0.03] transition-all duration-300 hover:border-white/12 ${hover} ${
                      isBig ? "lg:col-span-2 p-7 sm:flex gap-5 items-start" : "p-6"
                    }`}
                  >
                    <div className={`rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ${
                      isBig ? "w-12 h-12 mb-0" : "w-10 h-10 mb-4"
                    } ${isBig ? "mb-4 sm:mb-0" : ""}`}>
                      <Icon className={`${isBig ? "h-6 w-6" : "h-5 w-5"} ${iconColor}`} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-white mb-2 ${isBig ? "text-lg" : ""}`}>{f.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── TAB: APP ── */}
        {activeTab === "app" && (
          <div>
            <div className="border-b border-white/5 bg-white/[0.015]">
              <AppShowcase t={t.showcase} />
            </div>

            <section className="max-w-6xl mx-auto px-6 md:px-14 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.itineraryFeature.sectionLabel}</p>
                  <h2 className="text-3xl font-black tracking-tight mb-5">
                    {t.itineraryFeature.title1}<br />
                    <span className="text-slate-400 font-medium">{t.itineraryFeature.title2}</span>
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-7">{t.itineraryFeature.desc}</p>
                  <div className="space-y-3">
                    {t.itineraryFeature.bullets.map((label, i) => {
                      const BulletIcon = [Clock, MapPin, Zap][i];
                      return (
                        <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                          <BulletIcon className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ItineraryMockup />
              </div>
            </section>
          </div>
        )}

        {/* ── TAB: HOW IT WORKS ── */}
        {activeTab === "howItWorks" && (
          <div>
            <section className="max-w-5xl mx-auto px-6 md:px-14 py-16">
              <div className="text-center mb-14">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.howItWorks.sectionLabel}</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.howItWorks.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" aria-hidden="true" />
                {t.howItWorks.steps.map((step, i) => {
                  const Icon = STEP_ICONS[i];
                  return (
                    <div key={step.title} className="text-center">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-black text-blue-300 bg-step-card border border-blue-500/20">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border-t border-white/5 py-16 bg-white/[0.015]">
              <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-10">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.competitors.sectionLabel}</p>
                  <h2 className="text-3xl font-black tracking-tight">
                    {t.competitors.title1}<br />
                    <span className="text-slate-400 font-medium">{t.competitors.title2}</span>
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <div className="min-w-[340px]">
                      <div className="grid grid-cols-4 border-b border-white/6">
                        <div className="p-4 text-[11px] text-slate-600 font-semibold">
                          {lang === "pt" ? "Funcionalidade" : lang === "en" ? "Feature" : "Funcionalidad"}
                        </div>
                        {[{ name: "RoteiroApp", highlight: true }, { name: "TripIt", highlight: false }, { name: "Notion", highlight: false }].map(({ name, highlight }) => (
                          <div key={name} className={`p-4 text-center text-xs font-bold ${highlight ? "text-blue-300" : "text-slate-600"}`}>
                            {highlight && <div className="text-[9px] text-blue-400 font-semibold mb-0.5">{t.competitors.recommended}</div>}
                            {name}
                          </div>
                        ))}
                      </div>
                      {t.competitors.features.map((feature, i) => (
                        <div key={i} className="grid grid-cols-4 border-b border-white/4 last:border-0">
                          <div className="p-3 text-xs text-slate-400">{feature}</div>
                          {COMPETITORS_DATA[i].map((v, j) => (
                            <div key={j} className={`p-3 flex items-center justify-center ${j === 0 ? "bg-blue-600/5" : ""}`}>
                              {v
                                ? <Check className="h-4 w-4 text-emerald-400" aria-label="Sim" />
                                : <X className="h-4 w-4 text-slate-700" aria-label="Não" />}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB: COMMUNITY ── */}
        {activeTab === "community" && (
          <section className="max-w-6xl mx-auto px-6 md:px-14 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">{t.community.sectionLabel}</p>
              <h2 className="text-3xl font-black tracking-tight mb-5">
                {t.community.title1}<br />
                <span className="text-slate-400 font-medium">{t.community.title2}</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">{t.community.desc}</p>
              <div className="space-y-3">
                {t.community.bullets.map((label, i) => {
                  const Icon = COMMUNITY_ICONS[i];
                  return (
                    <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                      <Icon className={`h-4 w-4 shrink-0 ${COMMUNITY_COLORS[i]}`} aria-hidden="true" />
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {t.community.testimonials.map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all bg-white/[0.03]">
                  <div className="flex gap-0.5 mb-3" aria-label="5 estrelas">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[10px] font-black text-white`} aria-hidden="true">
                      {item.av}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-600">{item.dest}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── CTA — rei absoluto do fechamento ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-20">
        <div className="rounded-3xl p-10 md:p-16 text-center border border-blue-500/20 relative overflow-hidden bg-cta-section">
          <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-blue-600/10 to-transparent" aria-hidden="true" />
          {/* Soft top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" aria-hidden="true" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-cta-blue shadow-primary-lg ring-4 ring-blue-500/10">
              <Plane className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">{t.cta.title}</h2>
            <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto leading-relaxed">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base transition-all hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] bg-cta-blue shadow-primary-lg"
              >
                {t.cta.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                {t.cta.login}
              </Link>
            </div>
            <p className="text-slate-700 text-xs mt-6">
              {lang === "pt" ? "Sem cartão de crédito · Cancele quando quiser · Dados protegidos (LGPD)" :
               lang === "en" ? "No credit card · Cancel anytime · Data protected" :
               "Sin tarjeta de crédito · Cancela cuando quieras · Datos protegidos"}
            </p>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER — strip sutil, não compete com o CTA ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Star className="h-4 w-4 text-violet-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-300 leading-none">Dicas de viagem toda semana</p>
              <p className="text-xs text-slate-600 mt-0.5">Roteiros, promoções e destinos na sua caixa de entrada.</p>
            </div>
          </div>
          {nlState === "success" ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold shrink-0">
              <CheckCircle className="h-4 w-4" aria-hidden="true" /> Inscrito!
            </span>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <input
                type="email"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-label="Seu endereço de email"
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all w-full sm:w-48"
              />
              <button
                type="submit"
                disabled={nlState === "loading"}
                className="shrink-0 px-4 py-2 rounded-lg font-bold text-xs text-white transition-all hover:opacity-90 disabled:opacity-60 bg-cta-violet"
              >
                {nlState === "loading" ? "..." : "Inscrever"}
              </button>
            </form>
          )}
          {nlState === "error" && (
            <p className="text-red-400 text-[10px] sm:ml-2">Erro. Tente novamente.</p>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-14 bg-black/25">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cta-blue">
              <Plane className="h-3.5 w-3.5 text-white" aria-hidden="true" />
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
          <div className="flex items-center gap-1 p-1 rounded-lg border border-white/8 bg-white/[0.04]">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                aria-label={`Idioma: ${opt.label}`}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${lang === opt.id ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-300"}`}
              >
                <span aria-hidden="true">{opt.flag}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Hero mockups ─────────────────────────────────────────────────

function HeroMockDashboard() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden text-left bg-slate-950">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/6 bg-slate-900">
        <div className="w-2 h-2 rounded-full bg-red-500/50" aria-hidden="true" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" aria-hidden="true" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" aria-hidden="true" />
        <div className="ml-2 flex-1 h-4 rounded bg-white/4 text-[8px] text-slate-700 flex items-center px-2">roteiroapp.com/dashboard</div>
      </div>
      <div className="flex h-52">
        <div className="w-14 border-r border-white/5 flex flex-col items-center py-3 gap-3 bg-slate-900">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cta-blue">
            <Plane className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
          {[Map, Wallet, Package, BookOpen].map((Icon, i) => (
            <Icon key={i} className="h-3.5 w-3.5 text-slate-700" aria-hidden="true" />
          ))}
        </div>
        <div className="flex-1 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-5 w-16 rounded-lg bg-blue-600/60 text-[7px] text-blue-200 flex items-center justify-center font-semibold">+ Nova viagem</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Roma · Ago",
                gradientClass: "bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700",
                widthClass: "w-[75%]",
              },
              {
                label: "Tóquio · Nov",
                gradientClass: "bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-700",
                widthClass: "w-[40%]",
              },
              {
                label: "Lisboa · Fev",
                gradientClass: "bg-gradient-to-br from-slate-900 via-violet-950 to-violet-700",
                widthClass: "w-[20%]",
              },
            ].map((c, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-white/6">
                <div className={`h-12 ${c.gradientClass}`} />
                <div className="p-1.5 bg-slate-950">
                  <div className="text-[7px] font-semibold text-slate-300">{c.label}</div>
                  <div className={`mt-1 h-1 rounded-full bg-blue-500/40 ${c.widthClass}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            {["Itinerário", "Orçamento", "Malas", "Mapa"].map((label, i) => (
              <div key={i} className="flex-1 text-[7px] text-center py-1 rounded border border-white/5 text-slate-600 bg-white/[0.02]">{label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMockItinerary() {
  return (
      <div className="rounded-xl border border-white/8 overflow-hidden bg-slate-950">
      <div className="px-3 py-2 border-b border-white/6 flex items-center gap-2 bg-slate-900">
        <Map className="h-3 w-3 text-blue-400" aria-hidden="true" />
        <span className="text-[9px] font-bold text-slate-400">Itinerário · Dia 3 — Roma</span>
      </div>
      <div className="p-3 space-y-1.5">
        {/* Alerta realista de usuário */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-2.5 w-2.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="text-[8px] text-amber-300 font-semibold">Comprar ingresso Coliseu antecipado!</span>
        </div>
        {[
          { time: "09:00", label: "Coliseu",          accentClass: "bg-blue-500", emoji: "🏛️", fav: true  },
          { time: "12:30", label: "Trattoria Roma",   accentClass: "bg-amber-500", emoji: "🍝", fav: false },
          { time: "15:00", label: "Fontana di Trevi", accentClass: "bg-sky-500", emoji: "💧", fav: false },
          { time: "19:00", label: "Hotel Piazza",     accentClass: "bg-violet-500", emoji: "🏨", fav: false },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 rounded-lg px-2 bg-white/[0.03]">
            <span className="text-[9px] text-slate-600 w-8 shrink-0">{a.time}</span>
            <div className={`w-0.5 h-4 rounded-full shrink-0 ${a.accentClass}`} aria-hidden="true" />
            <span className="text-[8px]" aria-hidden="true">{a.emoji}</span>
            <span className="text-[9px] font-medium text-slate-300 flex-1">{a.label}</span>
            {a.fav && <span className="text-amber-400 text-[10px]" title="Favorito">★</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMockPacking() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-slate-950">
      <div className="px-3 py-2 border-b border-white/6 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
          <Package className="h-3 w-3 text-violet-400" aria-hidden="true" />
          <span className="text-[9px] font-bold text-slate-400">Lista de malas</span>
        </div>
        <span className="text-[8px] text-violet-400 font-semibold">2/4 itens</span>
      </div>
      <div className="p-3 space-y-1.5">
        {[
          { name: "Passaporte",       done: true  },
          { name: "Seguro viagem",    done: true  },
          { name: "Adaptador tomada", done: false },
          { name: "Roteador portátil",done: false },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 py-1 px-1.5 rounded-md ${item.done ? "bg-emerald-500/10" : "bg-white/5"}`}>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-700"}`} aria-hidden="true">
              {item.done && <Check className="h-2 w-2 text-white" />}
            </div>
            <span className={`text-[9px] ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pilar 4: Itinerário com realismo e imperfeições humanas ───────

function ItineraryMockup() {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
          <Map className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-300">Dia 3 — Roma, Itália</span>
        </div>
        <div className="flex gap-2 text-[9px]">
          {["Manhã", "Tarde", "Noite"].map((p, i) => (
            <span key={p} className={`px-2 py-0.5 rounded-full font-semibold ${i === 0 ? "bg-blue-600/30 text-blue-300" : "text-slate-600"}`}>{p}</span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Alerta de ingresso — toque humano realista */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-amber-300 font-semibold">⚠️ Comprar ingresso do Coliseu antecipado!</p>
          <span className="ml-auto text-[9px] text-amber-500/70 shrink-0">lembrete</span>
        </div>

        {[
          { time: "09:00", label: "Coliseu",             sub: "Via Sacra s/n",     cost: "€ 18",   emoji: "🏛️", accentClass: "bg-blue-500", fav: true,  note: null },
          { time: "11:30", label: "Foro Romano",          sub: "A 200m do Coliseu", cost: "incluso", emoji: "🏛️", accentClass: "bg-blue-500", fav: false, note: null },
          { time: "13:00", label: "Trattoria da Luigi",   sub: "Piazza Navona",     cost: "€ 24",   emoji: "🍝", accentClass: "bg-amber-500", fav: false, note: "reservei mesa p/ 13h" },
          { time: "15:30", label: "Fontana di Trevi",     sub: "Piazza di Trevi",   cost: "grátis", emoji: "💧", accentClass: "bg-sky-500", fav: false, note: null },
          { time: "19:00", label: "Hotel Piazza Venezia", sub: "Check-in",          cost: "€ 140",  emoji: "🏨", accentClass: "bg-violet-500", fav: false, note: null },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-12 text-[9px] text-slate-600 shrink-0">{a.time}</div>
            <div className={`w-0.5 h-8 rounded-full shrink-0 ${a.accentClass}`} aria-hidden="true" />
            <div className="text-sm shrink-0" aria-hidden="true">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-semibold text-slate-200">{a.label}</p>
                {a.fav && <span className="text-amber-400 text-[11px] leading-none" title="Favorito" aria-label="Favorito">★</span>}
              </div>
              <p className="text-[9px] text-slate-600 truncate">
                {a.note
                  ? <span className="text-blue-400/80 italic">{a.note}</span>
                  : a.sub}
              </p>
            </div>
            <div className="text-[9px] text-emerald-400 font-semibold shrink-0">{a.cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
