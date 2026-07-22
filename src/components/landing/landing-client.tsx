"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, ArrowRight, Check, CheckCircle, Star, Crown, Zap,
  Globe, BookOpen, BedDouble, Route, Wallet, Luggage,
  Shield, CreditCard, Lock, ChevronDown, Smartphone,
} from "lucide-react";
import { landingI18n, type LandingLang } from "@/lib/landing-i18n";
import { trackEvent } from "@/lib/analytics";

const S = {
  roteiros: "/screenshots/roteiros.png",
  stats:    "/screenshots/stats.png",
};

// Screenshot com moldura de navegador — sem glow colorido, sombra neutra (editorial)
function ScreenFrame({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#161b26] border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="ml-2 flex-1 h-5 rounded-md px-2 flex items-center bg-white/[0.05]">
          <span className="text-[9px] text-slate-500 font-medium">roteiroapp.com</span>
        </div>
      </div>
      <img src={src} alt={alt} className="w-full h-auto block" loading={eager ? "eager" : "lazy"} decoding="async" />
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
            ${lang === o.id ? "bg-primary-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
          <span>{o.flag}</span><span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

const FEATURE_ICONS: Record<string, React.ElementType> = {
  route: Route, bed: BedDouble, globe: Globe, wallet: Wallet, luggage: Luggage, book: BookOpen,
};
const GUARANTEE_ICONS: Record<string, React.ElementType> = {
  shield: Shield, card: CreditCard, lock: Lock, globe: Globe,
};

// Botão de loja (Em breve — não clicável)
function StoreBadge({ lead, name }: { lead: string; name: string }) {
  return (
    <div className="relative flex items-center gap-3 px-5 py-3 rounded-xl border border-white/12 bg-white/[0.03] cursor-default select-none" aria-disabled="true">
      <Smartphone className="h-6 w-6 text-slate-300 shrink-0" />
      <div className="text-left leading-tight">
        <p className="text-[10px] text-slate-500">{lead}</p>
        <p className="text-sm font-bold text-white">{name}</p>
      </div>
    </div>
  );
}

export function LandingClient() {
  const [lang, setLang] = useState<LandingLang>("pt");
  const [email, setEmail] = useState("");
  const [nlState, setNlState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = landingI18n[lang];

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault(); setNlState("loading");
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) trackEvent("app_notify");
    setNlState(res.ok ? "success" : "error");
  }

  const cta = (position: string) => () => trackEvent("cta_click", { position });

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-vibe-dark pb-16 sm:pb-0">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle bg-grid-48 opacity-[0.35]" aria-hidden />

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/5 backdrop-blur-sm bg-slate-950/70">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cta-blue shadow-primary-md transition-transform group-hover:scale-105">
            <Plane className="h-4 w-4 text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">RoteiroApp</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <a href="#planos" className="hidden md:block text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">{t.nav.plans}</a>
          <div className="hidden sm:block"><LangPicker lang={lang} set={setLang} /></div>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">{t.nav.login}</Link>
          <Link href="/register" onClick={cta("nav")} className="text-sm font-bold px-5 py-2.5 rounded-xl bg-cta-blue shadow-primary-md hover:opacity-90 transition-all">{t.nav.register}</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 text-xs font-semibold mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {t.hero.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            {t.hero.title1}<br />
            <span className="bg-hero-text bg-clip-text text-transparent">{t.hero.title2}</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-4 max-w-xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-sm text-slate-500 italic mb-8">{t.hero.human}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/register" onClick={cta("hero_primary")} className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 transition-all">
              {t.hero.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#planos" onClick={cta("hero_plans")} className="px-8 py-4 rounded-xl font-semibold text-sm text-slate-200 border border-white/12 hover:border-white/25 hover:bg-white/5 transition-all">
              {t.hero.ctaPlans}
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {t.hero.trust.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {item}
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <ScreenFrame src={S.roteiros} alt={t.hero.showcaseAlt} eager />
        </div>
      </section>

      {/* ── TUDO NUM APP (grade + 1 screenshot) ── */}
      <section id="recursos" className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.features.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.features.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {t.features.items.map((f) => {
              const Icon = FEATURE_ICONS[f.icon] ?? Route;
              return (
                <div key={f.title} className="rounded-2xl border border-white/8 p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary-600/15 border border-primary-500/20 mb-4">
                    <Icon className="h-5 w-5 text-primary-300" />
                  </div>
                  <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="max-w-4xl mx-auto">
            <ScreenFrame src={S.stats} alt={t.features.showcaseAlt} />
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6 md:px-14 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">{t.howItWorks.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.howItWorks.title}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {t.howItWorks.steps.map((s) => (
              <div key={s.n} className="text-center sm:text-left">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cta-blue text-white font-black text-lg mb-4 shadow-primary-md mx-auto sm:mx-0">{s.n}</div>
                <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" className="relative z-10 border-t border-white/5 py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">{t.plans.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t.plans.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{t.plans.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t.plans.free.name}</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-black text-white">{t.plans.free.price}</span>
                <span className="text-slate-500 mb-1.5 text-sm">{t.plans.free.period}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2 mb-6">{t.plans.free.desc}</p>
              <Link href="/register" onClick={cta("plans_free")}
                className="block w-full text-center py-3 px-6 rounded-xl border-2 border-white/12 font-bold text-slate-200 hover:border-white/25 hover:bg-white/5 transition-all mb-7">
                {t.plans.free.cta}
              </Link>
              <ul className="space-y-3">
                {t.plans.free.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Premium */}
            <div className="relative rounded-2xl border-2 border-primary-500/60 p-8 bg-gradient-to-b from-primary-600/10 to-transparent">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 bg-cta-blue text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-primary-md">
                  <Star className="h-3 w-3 fill-current" /> {t.plans.mostPopular}
                </span>
              </div>
              <span className="text-sm font-bold text-primary-300 uppercase tracking-wide">{t.plans.premium.name}</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-black text-white">{t.plans.premium.price}</span>
                <span className="text-slate-500 mb-1.5 text-sm">{t.plans.premium.period}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{t.plans.premium.note}</p>
              <p className="text-sm text-slate-400 mt-2 mb-6">{t.plans.premium.desc}</p>
              {/* "Assinar Premium" é CTA de compra: sai de cena no app nativo
                  (política de Pagamentos do Google). A landing é alcançável pelo
                  app quando o usuário está deslogado. */}
              <Link href="/pricing" onClick={cta("plans_premium")}
                className="hide-in-app flex items-center justify-center gap-2 w-full text-center py-3 px-6 rounded-xl font-bold text-white bg-cta-blue shadow-primary-md hover:opacity-90 transition-all mb-7">
                <Zap className="h-4 w-4" /> {t.plans.premium.cta}
              </Link>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">{t.plans.premium.featuresIntro}</p>
              <ul className="space-y-3">
                {t.plans.premium.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                    <Crown className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Garantias — faixa compacta */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {t.guarantees.items.map((g) => {
              const Icon = GUARANTEE_ICONS[g.icon] ?? Shield;
              return (
                <span key={g.label} className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="h-4 w-4 text-emerald-400 shrink-0" /> {g.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── APP EM BREVE ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto px-6 md:px-14 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-600/10 text-primary-300 text-xs font-bold mb-5">
            <Smartphone className="h-3 w-3" /> {t.app.eyebrow}
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t.app.title}</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">{t.app.subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <div className="relative">
              <StoreBadge lead={t.app.storeLeadIos} name={t.app.storeIos} />
              <span className="absolute -top-2 -right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-900">{t.app.comingSoon}</span>
            </div>
            <div className="relative">
              <StoreBadge lead={t.app.storeLeadAndroid} name={t.app.storeAndroid} />
              <span className="absolute -top-2 -right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-900">{t.app.comingSoon}</span>
            </div>
          </div>

          {nlState === "success" ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
              <CheckCircle className="h-4 w-4" /> {t.app.notifySuccess}
            </span>
          ) : (
            <form onSubmit={handleNotify} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t.app.notifyPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-primary-500/40 transition-all" />
              <button type="submit" disabled={nlState === "loading"}
                className="shrink-0 px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-cta-blue shadow-primary-md hover:opacity-90 disabled:opacity-60 transition-all">
                {nlState === "loading" ? "..." : t.app.notifyButton}
              </button>
            </form>
          )}
          {nlState === "error" && <p className="text-red-400 text-xs mt-2">{t.app.notifyError}</p>}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 border-t border-white/5 max-w-3xl mx-auto px-6 md:px-14 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">{t.faq.eyebrow}</p>
          <h2 className="text-3xl font-black tracking-tight">{t.faq.title}</h2>
        </div>
        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => { setOpenFaq(openFaq === i ? null : i); if (openFaq !== i) trackEvent("faq_open", { q: String(i) }); }}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-semibold text-white text-sm">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-14 pb-24">
        <div className="rounded-3xl p-10 md:p-14 text-center border border-white/10 bg-white/[0.03]">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">{t.cta.title}</h2>
          <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto leading-relaxed">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" onClick={cta("final_primary")} className="flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 transition-all">
              {t.cta.button} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#planos" onClick={cta("final_plans")} className="px-8 py-4 rounded-xl font-semibold text-sm text-slate-200 border border-white/12 hover:border-white/25 hover:bg-white/5 transition-all">
              {t.cta.buttonPlans}
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-6">{t.cta.fine}</p>
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
              <p className="text-[10px] text-slate-600">{t.footer.copy}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 text-xs text-slate-400">
            {t.footer.links.map(({ label, href }) => (
              <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <LangPicker lang={lang} set={setLang} />
        </div>
      </footer>

      {/* ── STICKY CTA (mobile) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <p className="text-xs text-slate-300 font-medium flex-1 leading-tight">{t.stickyCta.text}</p>
        <Link href="/register" onClick={cta("sticky_mobile")}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-cta-blue shadow-primary-md">
          {t.stickyCta.button} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
