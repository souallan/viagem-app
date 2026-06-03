"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane, ArrowRight, CheckCircle, Star,
  MapPin, Zap, BookOpen, Route, Globe,
} from "lucide-react";

function AppScreen({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
    </div>
  );
}

interface Props {
  stats: { users: number; trips: number; destinations: number };
}

export function LandingClient({ stats }: Props) {
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState<"idle" | "loading" | "success" | "error">("idle");

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

  const tripsLabel  = stats.trips  > 0 ? `${stats.trips.toLocaleString("pt-BR")}+`  : "15.000+";
  const usersLabel  = stats.users  > 0 ? `${stats.users.toLocaleString("pt-BR")}+`  : "R$ 0";
  const destsLabel  = stats.destinations > 0 ? `${stats.destinations.toLocaleString("pt-BR")}+` : "Global";

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-vibe-dark">

      {/* Grid overlay */}
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
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Entrar
          </Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-cta-blue shadow-primary-md hover:opacity-90 hover:scale-[1.02] transition-all">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-6">
            <Star className="h-3 w-3 fill-current" />
            100% gratuito · sem cartão de crédito
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.07] mb-6">
            Chega de aba esquecida<br />
            <span className="bg-hero-text bg-clip-text text-transparent">
              e planilha que ninguém entende.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            O RoteiroApp organiza tudo da sua viagem num só lugar — itinerário, gastos, malas, documentos e roteiros prontos — para você gastar mais tempo viajando e menos planejando.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 hover:scale-[1.02] transition-all">
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
              Já tenho conta
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Sem cartão de crédito", "Cancele quando quiser", "Dados protegidos (LGPD)"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* App screenshot — trip overview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <img src="/screenshots/trip-overview.png" alt="Visão geral da viagem no RoteiroApp" className="w-full object-cover object-top" loading="eager" />
          </div>
          {/* floating badges */}
          <div className="absolute -top-4 -right-4 sm:-right-8 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300 bg-emerald-500/10 backdrop-blur-md shadow-lg">
            <CheckCircle className="h-3.5 w-3.5" /> Orçamento no controle
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-left-8 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300 bg-blue-500/10 backdrop-blur-md shadow-lg">
            <MapPin className="h-3.5 w-3.5" /> 5 atividades hoje
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 divide-x divide-white/5 text-center">
          {[
            { value: tripsLabel,  label: stats.trips  > 0 ? "viagens planejadas" : "funcionalidades" },
            { value: usersLabel,  label: stats.users  > 0 ? "viajantes ativos"   : "para sempre grátis" },
            { value: destsLabel,  label: stats.destinations > 0 ? "destinos únicos" : "idiomas suportados" },
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
        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Reconhece esse cenário?</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
          Você tem 27 abas abertas,<br />
          <span className="text-slate-500 font-medium">um grupo no WhatsApp fora de controle</span><br />
          e uma planilha que só você entende.
        </h2>
        <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto mb-12">
          Organizar uma viagem virou um segundo emprego. Hotéis numa aba, voos em outra, roteiro num documento que ninguém mais acha, gastos num caderninho que ficou em casa. O RoteiroApp acabou com isso.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { before: "27 abas no navegador",         after: "Tudo num só lugar",                emoji: "🗂️" },
            { before: "Grupo no WhatsApp bagunçado",  after: "Itinerário compartilhado e claro", emoji: "📋" },
            { before: "Não sei quanto gastei",        after: "Controle de gastos em tempo real", emoji: "💰" },
          ].map(({ before, after, emoji }) => (
            <div key={before} className="rounded-2xl border border-white/6 p-5 bg-white/[0.03] hover:border-white/12 transition-all">
              <div className="text-2xl mb-4">{emoji}</div>
              <p className="text-sm text-rose-400/80 line-through mb-1">{before}</p>
              <p className="text-sm font-bold text-emerald-400">{after}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOWCASE: 4 telas reais ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">O app por dentro</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Cada detalhe pensado<br />
              <span className="text-slate-500 font-medium">para quem viaja de verdade.</span>
            </h2>
          </div>

          {/* Row 1: Sidebar + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 mb-4">
            <AppScreen src="/screenshots/sidebar.png" alt="Menu lateral do RoteiroApp" className="max-h-[380px]" />
            <AppScreen src="/screenshots/stats.png"   alt="Cards de estatísticas da viagem" className="max-h-[380px]" />
          </div>

          {/* Row 2: Dicas + Experiências */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <AppScreen src="/screenshots/dicas.png"       alt="Dicas e guias de viagem" className="max-h-[340px]" />
            <AppScreen src="/screenshots/experiences.png" alt="Minhas experiências de viagem" className="max-h-[340px]" />
          </div>
        </div>
      </section>

      {/* ── FEATURES 3 pilares ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Por que o RoteiroApp</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Três coisas que vão mudar<br />
            <span className="text-slate-500 font-medium">como você planeja viagens.</span>
          </h2>
        </div>

        <div className="space-y-20">
          {/* Pilar 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold mb-5">
                <Zap className="h-3 w-3" /> Itinerário visual
              </div>
              <h3 className="text-2xl font-black mb-4">Sem planilha.<br />Sem PDF de 40 páginas.</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Monte seu roteiro dia a dia com horários, locais e custos. Veja tudo numa linha do tempo clara — manhã, tarde e noite. E se mudar de ideia, arrasta e reorganiza em segundos.
              </p>
              <ul className="space-y-2.5">
                {["Linha do tempo por período (manhã, tarde e noite)", "Sugestões de atividades com IA para seu destino", "Alertas de ingressos e reservas antecipadas"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <AppScreen src="/screenshots/trip-overview.png" alt="Itinerário visual da viagem" className="max-h-[420px]" />
          </div>

          {/* Pilar 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AppScreen src="/screenshots/roteiros.png" alt="Roteiros prontos para aplicar" className="order-last lg:order-first max-h-[420px]" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-5">
                <Route className="h-3 w-3" /> Roteiros prontos
              </div>
              <h3 className="text-2xl font-black mb-4">Não sabe por onde começar?<br />A gente já fez por você.</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Paris, Tóquio, Nova York, Lisboa — roteiros completos e validados, com atividades, horários e estimativas de custo. Aplique à sua viagem com um clique e personalize o que quiser.
              </p>
              <ul className="space-y-2.5">
                {["10 roteiros curados para os destinos mais populares", "Comunidade contribuindo com novos roteiros todo mês", "Adapta ao seu estilo: mochileiro, família, casal"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-5">
                <BookOpen className="h-3 w-3" /> Diário de experiências
              </div>
              <h3 className="text-2xl font-black mb-4">Documente a viagem.<br />Não só fotografe.</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Escreva relatos, dê notas e compartilhe o que viveu com outros viajantes. Sua memória de "aquele restaurante incrível em Roma" nunca mais vai sumir num grupo do WhatsApp.
              </p>
              <ul className="space-y-2.5">
                {["Relatos com fotos, notas e avaliações", "Dicas compartilhadas com a comunidade", "Seu diário de bordo para todas as viagens"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <AppScreen src="/screenshots/experience-detail.png" alt="Detalhe de experiência de viagem" className="max-h-[420px]" />
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Viajantes reais</p>
            <h2 className="text-3xl font-black tracking-tight">O que estão dizendo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { text: "Eu usava seis aplicativos diferentes para planejar uma viagem. Agora uso só o RoteiroApp. Sério, salvou a minha vida na viagem para o Japão.", name: "Mariana S.", dest: "Tóquio, Japão", av: "MS", color: "from-pink-600 to-rose-600" },
              { text: "A funcionalidade de lista de malas com sugestão por destino é genial. Nunca mais esqueci adaptador de tomada. E olha que eu viajo bastante.", name: "Rafael C.", dest: "Europa — 3 países", av: "RC", color: "from-blue-600 to-cyan-600" },
              { text: "Organizei minha lua de mel toda aqui. Itinerário, hotel, gastos, tudo. Minha esposa ficou impressionada — e eu que sou péssimo em organização.", name: "Bruno M.", dest: "Lisboa, Portugal", av: "BM", color: "from-violet-600 to-purple-600" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/6 p-6 bg-white/[0.03] hover:border-white/12 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-[11px] font-black text-white shrink-0`}>
                    {t.av}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-600">{t.dest}</p>
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
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Sua próxima viagem<br />começa aqui.
            </h2>
            <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Crie sua conta em menos de 1 minuto. Sem cartão de crédito, sem complicação. Só você, o destino e um roteiro organizado de verdade.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base bg-cta-blue shadow-primary-lg hover:opacity-90 hover:scale-[1.03] transition-all">
                Começar grátis agora <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                Já tenho conta → entrar
              </Link>
            </div>
            <p className="text-slate-700 text-xs mt-6">Sem cartão de crédito · Cancele quando quiser · LGPD compliant</p>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="relative z-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Star className="h-4 w-4 text-violet-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-300 leading-none">Dicas de viagem toda semana</p>
              <p className="text-xs text-slate-600 mt-0.5">Roteiros, promoções e destinos na sua caixa de entrada.</p>
            </div>
          </div>
          {nlState === "success" ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold shrink-0">
              <CheckCircle className="h-4 w-4" /> Inscrito!
            </span>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <input
                type="email"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder="seu@email.com"
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all w-full sm:w-48"
              />
              <button
                type="submit"
                disabled={nlState === "loading"}
                className="shrink-0 px-4 py-2 rounded-lg font-bold text-xs text-white bg-cta-violet hover:opacity-90 disabled:opacity-60 transition-all"
              >
                {nlState === "loading" ? "..." : "Inscrever"}
              </button>
            </form>
          )}
          {nlState === "error" && <p className="text-red-400 text-[10px] sm:ml-2">Erro. Tente novamente.</p>}
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
              <p className="text-[10px] text-slate-700">© 2026 · Todos os direitos reservados</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            {[
              { label: "Privacidade", href: "/privacy" },
              { label: "Termos", href: "/terms" },
              { label: "Blog", href: "/blog" },
              { label: "Roteiros", href: "/roteiro" },
              { label: "Dicas", href: "/tips" },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="hover:text-slate-300 transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── (mockups removidos — usando screenshots reais) ───────────────

function _unused() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header azul */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-violet-600 px-6 py-5">
        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Meus roteiros</p>
        <h3 className="text-2xl font-black text-white tracking-tight">EUROTRIP</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
            <span>📍</span> Lisboa
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
            <span>📅</span> 15–22 Jul
          </span>
        </div>
      </div>
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-gray-200 px-4 overflow-x-auto bg-white">
        {["Visão Geral", "Atividades", "Hospedagem", "Transporte", "Orçamento", "Malas", "Documentos"].map((tab, i) => (
          <div key={tab} className={`shrink-0 px-3 py-2.5 text-[10px] font-semibold border-b-2 transition-colors ${i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>
            {tab}
          </div>
        ))}
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50">
        {[
          { label: "ATIVIDADES", value: "5", sub: "atividades", color: "bg-blue-500", icon: "⚡" },
          { label: "HOSPEDAGENS", value: "2", sub: "hospedagens", color: "bg-violet-500", icon: "🏨" },
          { label: "TRANSPORTES", value: "3", sub: "trechos", color: "bg-emerald-500", icon: "✈️" },
        ].map(({ label, value, sub, color, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`h-1 ${color}`} />
            <div className="p-3">
              <div className="text-lg mb-1">{icon}</div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-[9px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockSidebar() {
  return (
    <div className="h-full min-h-[320px] flex flex-col" style={{ background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)" }}>
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-white/6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)" }}>
          <Plane className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-none tracking-tight">RoteiroApp</p>
          <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-0.5">Travel Planner</p>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest px-2 pb-2">Menu</p>
        {[
          { label: "Meus Roteiros", active: true,  icon: "⊞" },
          { label: "Roteiros",      active: false, icon: "◎" },
          { label: "Dicas",         active: false, icon: "💡" },
          { label: "Experiências",  active: false, icon: "📖" },
          { label: "Meu Perfil",    active: false, icon: "👤" },
        ].map(({ label, active, icon }) => (
          <div key={label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium ${active ? "bg-white/8 text-white" : "text-slate-500"}`}>
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: active ? "rgba(37,112,232,0.3)" : "rgba(255,255,255,0.04)" }}>{icon}</span>
            {label}
          </div>
        ))}
      </nav>
      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-slate-500">
          <span className="text-sm">→</span> Sair da conta
        </div>
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3 text-slate-700" />
          <div className="flex gap-0.5 flex-1">
            {[{ code: "PT", active: true }, { code: "ES", active: false }, { code: "EN", active: false }].map(({ code, active }) => (
              <div key={code} className={`flex-1 text-center py-0.5 rounded text-[9px] font-bold ${active ? "bg-blue-600/25 text-blue-300" : "text-slate-700"}`}>{code}</div>
            ))}
          </div>
        </div>
        <p className="text-[8px] text-slate-800 px-1">© 2026 RoteiroApp</p>
      </div>
    </div>
  );
}

function MockItinerary() {
  return (
    <div className="bg-white font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-blue-200 font-semibold uppercase tracking-widest">Itinerário</p>
          <p className="text-sm font-bold text-white">EUROTRIP · Lisboa</p>
        </div>
        <div className="flex gap-1.5">
          {["📋 Timeline", "⊞ Períodos"].map((v, i) => (
            <span key={v} className={`text-[9px] px-2 py-1 rounded-lg font-semibold ${i === 0 ? "bg-white text-blue-700" : "bg-white/20 text-white"}`}>{v}</span>
          ))}
        </div>
      </div>
      {/* Day */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex flex-col items-center justify-center text-white shrink-0">
            <span className="text-[7px] font-bold uppercase">Dia</span>
            <span className="text-base font-black leading-none">1</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Terça-feira</p>
            <p className="text-[10px] text-gray-400">15 de julho de 2026</p>
          </div>
          <span className="ml-auto text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-medium">5 atividades</span>
        </div>
        <div className="space-y-2">
          {[
            { time: "09:00", label: "Castelo de São Jorge",  type: "⚡", color: "bg-blue-500",   cost: "€ 15" },
            { time: "11:00", label: "Pastéis de Belém",      type: "🍽️", color: "bg-orange-500", cost: "€ 8"  },
            { time: "14:00", label: "Mosteiro dos Jerônimos",type: "⚡", color: "bg-blue-500",   cost: "€ 10" },
            { time: "17:30", label: "Miradouro da Graça",    type: "⚡", color: "bg-blue-500",   cost: "Grátis" },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-[10px] text-gray-400 w-8 shrink-0">{a.time}</span>
              <div className={`w-0.5 h-6 rounded-full shrink-0 ${a.color}`} />
              <span className="text-sm shrink-0">{a.type}</span>
              <span className="text-[10px] font-semibold text-gray-900 flex-1 truncate">{a.label}</span>
              <span className="text-[9px] font-bold text-emerald-600 shrink-0">{a.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockDicas() {
  return (
    <div className="bg-white font-sans">
      {/* Header escuro */}
      <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
        <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Comunidade RoteiroApp</p>
        <h3 className="text-xl font-black text-white">Dicas & Guias de Viagem</h3>
        <p className="text-[10px] text-slate-400 mt-1">Novos artigos toda semana — escritos por especialistas e viajantes experientes.</p>
      </div>
      {/* Articles grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {[
          { tag: "Finanças",   title: "Como encontrar voos baratos: guia definitivo 2026",        time: "6 min", color: "bg-amber-100 text-amber-700"   },
          { tag: "Segurança",  title: "Viagem solo feminina: segurança sem paranoia",              time: "5 min", color: "bg-red-100 text-red-700"       },
          { tag: "Tecnologia", title: "Como usar o Google Maps totalmente offline",                time: "3 min", color: "bg-blue-100 text-blue-700"     },
          { tag: "Documentos", title: "Passaporte brasileiro: 65+ destinos sem visto",             time: "4 min", color: "bg-green-100 text-green-700"   },
        ].map(({ tag, title, time, color }) => (
          <div key={title} className="rounded-xl border border-gray-100 p-3 hover:shadow-md transition-all bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${color}`}>{tag}</span>
              <span className="text-[9px] text-gray-400">⏱ {time}</span>
            </div>
            <p className="text-[10px] font-semibold text-gray-900 leading-snug">{title}</p>
            <p className="text-[9px] text-blue-600 font-semibold mt-2">↓ Ler artigo</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockExperiences() {
  return (
    <div className="bg-white font-sans h-full">
      {/* Header */}
      <div className="px-4 py-4" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}>
        <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest">Diário de Bordo</p>
        <h3 className="text-base font-black text-white">Minhas Experiências</h3>
        <p className="text-[9px] text-slate-400 mt-0.5">Documente suas aventuras</p>
      </div>
      {/* Experience card */}
      <div className="relative mx-3 mt-3 mb-2 rounded-xl overflow-hidden" style={{ height: 120 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700" />
        <div className="absolute inset-0 flex flex-col justify-end p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
          <span className="text-[8px] bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full w-fit mb-1">⭐ Destaque</span>
          <p className="text-xs font-black text-white">Visita Coliseu</p>
          <p className="text-[9px] text-slate-300">A batalha contra as pedras irregulares</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[8px] text-slate-300">📍 roma</span>
            <span className="text-[9px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full font-bold">Incrível</span>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex gap-0.5">
          {[1,2,3,4].map(s => <span key={s} className="text-amber-400 text-[10px]">★</span>)}
          <span className="text-gray-300 text-[10px]">★</span>
          <span className="text-[9px] text-gray-400 ml-1">4.0 / 5</span>
        </div>
      </div>
    </div>
  );
}

function MockItineraryDetail() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center justify-between">
        <span className="text-xs font-bold text-white">Dia 3 — Roma, Itália</span>
        <div className="flex gap-2">
          {["🌅 Manhã", "☀️ Tarde", "🌙 Noite"].map((p) => (
            <span key={p} className="text-[9px] text-blue-200 font-semibold">{p}</span>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-700 font-semibold">
          ⚠️ Comprar ingresso do Coliseu com antecedência!
        </div>
        {[
          { time: "09:00", label: "Coliseu",           cost: "€ 18",   color: "bg-blue-500"  },
          { time: "12:30", label: "Trattoria da Luigi", cost: "€ 24",   color: "bg-orange-500" },
          { time: "15:00", label: "Fontana di Trevi",   cost: "Grátis", color: "bg-sky-500"   },
          { time: "19:00", label: "Hotel Piazza",        cost: "€ 140",  color: "bg-violet-500" },
        ].map((a) => (
          <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] text-gray-400 w-10 shrink-0">{a.time}</span>
            <div className={`w-0.5 h-7 rounded-full shrink-0 ${a.color}`} />
            <span className="text-xs font-semibold text-gray-900 flex-1">{a.label}</span>
            <span className="text-[10px] font-bold text-emerald-600 shrink-0">{a.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockRoteiros() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl font-sans">
      <div className="px-4 py-3" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Biblioteca de Roteiros</p>
        <p className="text-base font-black text-white">Roteiros Prontos</p>
        <p className="text-[9px] text-slate-400">Escolha um destino e aplique com um clique.</p>
      </div>
      <div className="p-3 space-y-3">
        {[
          { flag: "🇫🇷", dest: "Paris",    country: "França",  days: 5, acts: 12, cost: "€1.5k–€2.5k", gradient: "from-blue-600 to-violet-600" },
          { flag: "🇯🇵", dest: "Tóquio",   country: "Japão",   days: 7, acts: 13, cost: "¥150k–¥250k", gradient: "from-red-600 to-rose-500"   },
          { flag: "🇺🇸", dest: "Nova York", country: "EUA",    days: 5, acts: 10, cost: "$1.8k–$3k",   gradient: "from-teal-600 to-emerald-500" },
        ].map(({ flag, dest, country, days, acts, cost, gradient }) => (
          <div key={dest} className="rounded-xl overflow-hidden border border-gray-100">
            <div className={`h-10 bg-gradient-to-r ${gradient} flex items-end px-3 pb-1.5 relative`}>
              <span className="text-[9px] font-black text-white">{flag} {dest} · {country}</span>
              <span className="ml-auto text-[8px] bg-black/30 text-white px-1.5 py-0.5 rounded-full font-semibold">{days} dias</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-gray-500">💰 {cost}</span>
                <span className="text-[9px] text-gray-500">📋 {acts} atividades</span>
              </div>
              <span className="text-[9px] font-bold text-blue-600">Usar →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockExperienceDetail() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl font-sans">
      <div className="relative h-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 p-4">
          <div className="flex items-center gap-2 mb-1 text-[9px] text-slate-300">
            <span>📍 roma</span>
            <span>📅 Julho 2025</span>
            <span>⏱ 1 min</span>
          </div>
          <p className="text-base font-black text-white">Visita Coliseu</p>
          <div className="flex gap-0.5 mt-0.5">
            {[1,2,3,4].map(s => <span key={s} className="text-amber-400 text-[10px]">★</span>)}
            <span className="text-slate-500 text-[10px]">★</span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="p-3 rounded-xl border-l-4 border-violet-400 bg-violet-50 text-[10px] text-violet-800 italic font-medium">
          &ldquo;A batalha contra as pedras irregulares (e como meus pés sobreviveram)&rdquo;
        </div>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          <strong className="text-4xl text-violet-600 font-black float-left mr-1 leading-none">E</strong>
          u já tinha sido avisado de que caminharia bastante em pedras irregulares, então deixei qualquer calçado bonitinho no hotel. Fui com o meu tênis de caminhada mais surrado e macio...
        </p>
        <div className="flex gap-2">
          <span className="text-[9px] bg-violet-50 text-violet-600 px-2 py-1 rounded-full font-semibold">#Coliseu</span>
          <span className="text-[9px] bg-violet-50 text-violet-600 px-2 py-1 rounded-full font-semibold">#Roma</span>
          <span className="text-[9px] bg-violet-50 text-violet-600 px-2 py-1 rounded-full font-semibold">#DicasDeViagem</span>
        </div>
      </div>
    </div>
  );
}
