"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, Map, Wallet, Package, BookOpen, Star, ArrowRight,
  CheckCircle, Globe, Lightbulb, Route, Check, X,
  MapPin, Clock, Users, TrendingUp, Shield, Zap,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";
import { AppShowcase } from "@/components/landing/app-showcase";

const FEATURE_ICONS = [Map, Wallet, Package, Route, BookOpen, Shield];
const FEATURE_COLORS = [
  { color: "from-blue-500/20 to-blue-600/5",    iconColor: "text-blue-400"    },
  { color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400" },
  { color: "from-violet-500/20 to-violet-600/5",  iconColor: "text-violet-400"  },
  { color: "from-orange-500/20 to-orange-600/5",  iconColor: "text-orange-400"  },
  { color: "from-pink-500/20 to-pink-600/5",      iconColor: "text-pink-400"    },
  { color: "from-yellow-500/20 to-yellow-600/5",  iconColor: "text-yellow-400"  },
];
const STEP_ICONS = [Plane, Map, TrendingUp];
const COMMUNITY_ICONS = [BookOpen, Route, Lightbulb, Users, Globe];
const COMMUNITY_COLORS = ["text-pink-400", "text-orange-400", "text-yellow-400", "text-blue-400", "text-teal-400"];

const COMPETITORS_DATA = [
  [true,  false, false],
  [true,  true,  false],
  [true,  false, false],
  [true,  false, false],
  [true,  false, false],
  [true,  false, false],
  [true,  false, true ],
  [true,  false, false],
  [true,  false, false],
];

const LANG_OPTIONS: { id: LandingLang; flag: string; label: string }[] = [
  { id: "pt", flag: "🇧🇷", label: "PT" },
  { id: "en", flag: "🇬🇧", label: "EN" },
  { id: "es", flag: "🇪🇸", label: "ES" },
];

interface Props {
  stats: { users: number; trips: number; destinations: number };
}

export function LandingClient({ stats }: Props) {
  const [lang, setLang] = useState<LandingLang>("pt");
  const t = landingI18n[lang];

  const STATS_ITEMS = [
    {
      value: stats.trips > 0 ? `${stats.trips}+` : "100%",
      label: stats.trips > 0 ? t.stats.trips : t.stats.fallbackFree,
    },
    {
      value: stats.users > 0 ? `${stats.users}+` : "12+",
      label: stats.users > 0 ? t.stats.users : t.stats.fallbackFeatures,
    },
    {
      value: stats.destinations > 0 ? `${stats.destinations}+` : "3",
      label: stats.destinations > 0 ? t.stats.destinations : t.stats.fallbackLangs,
    },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "linear-gradient(160deg, #070D14 0%, #0A1520 50%, #070E1A 100%)" }}>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Glows */}
      <div className="fixed top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(26,95,204,0.12) 0%, transparent 65%)" }} />
      <div className="fixed bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(13,123,163,0.09) 0%, transparent 65%)" }} />

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/5 backdrop-blur-sm" style={{ background: "rgba(7,13,20,0.75)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 4px 16px rgba(26,95,204,0.40)" }}>
            <Plane className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[17px] font-bold tracking-tight" style={{ background: "linear-gradient(90deg,#fff,#85ADFD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RoteiroApp</span>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold leading-none">Travel Planner</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  lang === opt.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">{t.nav.login}</Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 4px 14px rgba(26,95,204,0.35)" }}>
            {t.nav.register}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-7">
            <Star className="h-3 w-3 fill-current" />
            {t.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.07] mb-5">
            {t.hero.title1}<br />
            <span style={{ background: "linear-gradient(90deg,#5585FA,#2570E8,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t.hero.title2}
            </span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-lg">{t.hero.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/register" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 22px rgba(26,95,204,0.38)" }}>
              {t.hero.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
              {t.hero.ctaLogin}
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {t.hero.trust.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
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
          <div className="absolute -top-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300" style={{ background: "rgba(16,185,129,0.10)", backdropFilter: "blur(12px)" }}>
            <CheckCircle className="h-3.5 w-3.5" /> {lang === "pt" ? "Orçamento no controle" : lang === "en" ? "Budget on track" : "Presupuesto controlado"}
          </div>
          <div className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300" style={{ background: "rgba(37,112,232,0.12)", backdropFilter: "blur(12px)" }}>
            <MapPin className="h-3.5 w-3.5" /> {lang === "pt" ? "4 atividades hoje" : lang === "en" ? "4 activities today" : "4 actividades hoy"}
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="relative z-10 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/5 text-center">
          {STATS_ITEMS.map((s, i) => (
            <div key={i} className="px-6">
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ background: "linear-gradient(90deg,#5585FA,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.features.sectionLabel}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {t.features.title1}<br />
            <span className="text-slate-500 font-medium">{t.features.title2}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.features.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            const { color, iconColor } = FEATURE_COLORS[i];
            return (
              <div key={f.title} className="group rounded-2xl border border-white/6 p-6 hover:border-white/12 transition-all duration-300" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── APP SHOWCASE ── */}
      <div className="relative z-10 border-y border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
        <AppShowcase t={t.showcase} />
      </div>

      {/* ── ITINERARY FEATURE ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
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
                    <BulletIcon className="h-4 w-4 text-blue-400 shrink-0" />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
          <ItineraryMockup />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 border-y border-white/5 py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-5xl mx-auto px-6 md:px-14">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.howItWorks.sectionLabel}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.howItWorks.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            {t.howItWorks.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-black text-blue-300" style={{ background: "linear-gradient(135deg,rgba(26,95,204,0.20),rgba(37,112,232,0.10))", border: "1px solid rgba(37,112,232,0.20)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPETITORS ── */}
      <section className="relative z-10 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.competitors.sectionLabel}</p>
            <h2 className="text-3xl font-black tracking-tight">
              {t.competitors.title1}<br />
              <span className="text-slate-400 font-medium">{t.competitors.title2}</span>
            </h2>
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="grid grid-cols-4 border-b border-white/6">
              <div className="p-4 text-[11px] text-slate-600 font-semibold">{lang === "pt" ? "Funcionalidade" : lang === "en" ? "Feature" : "Funcionalidad"}</div>
              {[
                { name: "RoteiroApp", highlight: true },
                { name: "TripIt",     highlight: false },
                { name: "Notion",     highlight: false },
              ].map(({ name, highlight }) => (
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
                    {v ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-slate-700" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="relative z-10 border-y border-white/5 py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                    <Icon className={`h-4 w-4 shrink-0 ${COMMUNITY_COLORS[i]}`} />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            {t.community.testimonials.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{item.text}"</p>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[10px] font-black text-white`}>{item.av}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-600">{item.dest}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
        <div className="rounded-3xl p-12 text-center border border-blue-500/20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(26,95,204,0.15),rgba(13,123,163,0.08))" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%,rgba(37,112,232,0.10) 0%,transparent 70%)" }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 24px rgba(26,95,204,0.45)" }}>
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{t.cta.title}</h2>
            <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 22px rgba(26,95,204,0.40)" }}>
                {t.cta.button} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">{t.cta.login}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-14" style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}>
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
          <div className="flex items-center gap-1 p-1 rounded-lg border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                  lang === opt.id ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-300"
                }`}
              >
                {opt.flag} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Small hero mockups (kept from original) ───────────────────

function HeroMockDashboard() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden text-left" style={{ background: "#0D1525" }}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/6" style={{ background: "#080E1A" }}>
        <div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" />
        <div className="ml-2 flex-1 h-4 rounded bg-white/4 text-[8px] text-slate-700 flex items-center px-2">roteiroapp.com/dashboard</div>
      </div>
      <div className="flex h-52">
        <div className="w-14 border-r border-white/5 flex flex-col items-center py-3 gap-3" style={{ background: "#080F1C" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}><Plane className="h-3 w-3 text-white" /></div>
          {[Map, Wallet, Package, BookOpen].map((Icon, i) => <Icon key={i} className="h-3.5 w-3.5 text-slate-700" />)}
        </div>
        <div className="flex-1 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-5 w-16 rounded-lg bg-blue-600/60 text-[7px] text-blue-200 flex items-center justify-center font-semibold">+ Nova viagem</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Roma · Ago",    color: "#1A3A5C", accent: "#2D6A9F" },
              { label: "Tóquio · Nov",  color: "#1C3B2A", accent: "#2D7A4F" },
              { label: "Lisboa · Fev",  color: "#3B1C35", accent: "#7A2D6A" },
            ].map((c, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-white/6">
                <div className="h-12" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.accent})` }} />
                <div className="p-1.5" style={{ background: "#0D1525" }}>
                  <div className="text-[7px] font-semibold text-slate-300">{c.label}</div>
                  <div className="mt-1 h-1 rounded-full bg-blue-500/40" style={{ width: `${[75, 40, 20][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            {["Itinerário", "Orçamento", "Malas", "Mapa"].map((label, i) => (
              <div key={i} className="flex-1 text-[7px] text-center py-1 rounded border border-white/5 text-slate-600" style={{ background: "rgba(255,255,255,0.02)" }}>{label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMockItinerary() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "#0D1525" }}>
      <div className="px-3 py-2 border-b border-white/6 flex items-center gap-2" style={{ background: "#080E1A" }}>
        <Map className="h-3 w-3 text-blue-400" />
        <span className="text-[9px] font-bold text-slate-400">Itinerário · Dia 3 — Roma</span>
      </div>
      <div className="p-3 space-y-1.5">
        {[
          { time: "09:00", label: "Coliseu",          color: "#3B82F6", emoji: "🏛️" },
          { time: "12:30", label: "Trattoria Roma",   color: "#F59E0B", emoji: "🍝" },
          { time: "15:00", label: "Fontana di Trevi", color: "#06B6D4", emoji: "💧" },
          { time: "19:00", label: "Hotel Piazza",     color: "#8B5CF6", emoji: "🏨" },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 rounded-lg px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-[9px] text-slate-600 w-8 shrink-0">{a.time}</span>
            <div className="w-0.5 h-4 rounded-full shrink-0" style={{ background: a.color }} />
            <span className="text-[8px]">{a.emoji}</span>
            <span className="text-[9px] font-medium text-slate-300">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMockPacking() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "#0D1525" }}>
      <div className="px-3 py-2 border-b border-white/6 flex items-center justify-between" style={{ background: "#080E1A" }}>
        <div className="flex items-center gap-2"><Package className="h-3 w-3 text-violet-400" /><span className="text-[9px] font-bold text-slate-400">Lista de malas</span></div>
        <span className="text-[8px] text-violet-400 font-semibold">2/4 itens</span>
      </div>
      <div className="p-3 space-y-1.5">
        {[
          { name: "Passaporte", done: true }, { name: "Seguro viagem", done: true },
          { name: "Adaptador tomada", done: false }, { name: "Roteador portátil", done: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-1 px-1.5 rounded-md" style={{ background: item.done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)" }}>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-700"}`}>
              {item.done && <Check className="h-2 w-2 text-white" />}
            </div>
            <span className={`text-[9px] ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItineraryMockup() {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "#0D1525", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div className="p-4 border-b border-white/5 flex items-center justify-between" style={{ background: "#080E1A" }}>
        <div className="flex items-center gap-2"><Map className="h-3.5 w-3.5 text-blue-400" /><span className="text-xs font-bold text-slate-300">Dia 3 — Roma, Itália</span></div>
        <div className="flex gap-2 text-[9px]">
          {["Manhã", "Tarde", "Noite"].map((p, i) => (
            <span key={p} className={`px-2 py-0.5 rounded-full font-semibold ${i === 0 ? "bg-blue-600/30 text-blue-300" : "text-slate-600"}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-2">
        {[
          { time: "09:00", label: "Coliseu",             sub: "Via Sacra s/n",     cost: "€ 18",   emoji: "🏛️", color: "#3B82F6" },
          { time: "11:30", label: "Foro Romano",          sub: "A 200m do Coliseu", cost: "incluso", emoji: "🏛️", color: "#3B82F6" },
          { time: "13:00", label: "Trattoria da Luigi",   sub: "Piazza Navona",     cost: "€ 24",   emoji: "🍝", color: "#F59E0B" },
          { time: "15:30", label: "Fontana di Trevi",     sub: "Piazza di Trevi",   cost: "grátis", emoji: "💧", color: "#06B6D4" },
          { time: "19:00", label: "Hotel Piazza Venezia", sub: "Check-in",          cost: "€ 140",  emoji: "🏨", color: "#8B5CF6" },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-12 text-[9px] text-slate-600 shrink-0">{a.time}</div>
            <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: a.color }} />
            <div className="text-sm shrink-0">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-200">{a.label}</p>
              <p className="text-[9px] text-slate-600 truncate">{a.sub}</p>
            </div>
            <div className="text-[9px] text-emerald-400 font-semibold shrink-0">{a.cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
