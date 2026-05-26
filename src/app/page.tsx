import Link from "next/link";
import {
  Plane, Map, Wallet, Package, BookOpen, Star, ArrowRight,
  CheckCircle, Globe, Lightbulb, Route, Check, X,
  MapPin, Clock, Users, TrendingUp, Shield, Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// ── Static data ────────────────────────────────────────────────────
const FEATURES = [
  { icon: Map,       title: "Roteiro dia a dia",        desc: "Monte atividades com horário, local e mapa — manha, tarde e noite organizados automaticamente.", color: "from-blue-500/20 to-blue-600/5",    iconColor: "text-blue-400" },
  { icon: Wallet,    title: "Controle total de gastos",  desc: "Registre despesas por categoria, divida entre participantes e acompanhe o câmbio em tempo real.", color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400" },
  { icon: Package,   title: "Lista de malas inteligente",desc: "Gere a lista por destino e clima. Sugestões de compra na Amazon por categoria incluídas.",      color: "from-violet-500/20 to-violet-600/5",  iconColor: "text-violet-400" },
  { icon: Route,     title: "Roteiros da comunidade",    desc: "Explore roteiros criados por viajantes reais e clone para a sua viagem em um clique.",           color: "from-orange-500/20 to-orange-600/5",  iconColor: "text-orange-400" },
  { icon: BookOpen,  title: "Diário e relatos",          desc: "Registre momentos durante a viagem e publique relatos para inspirar outros viajantes.",           color: "from-pink-500/20 to-pink-600/5",     iconColor: "text-pink-400" },
  { icon: Shield,    title: "Documentos e alertas",      desc: "Guarde passaporte, vistos e seguros. Alertas automáticos de vencimento para nunca ser pego de surpresa.", color: "from-yellow-500/20 to-yellow-600/5", iconColor: "text-yellow-400" },
];

const STEPS = [
  { n: "01", icon: Plane,    title: "Crie sua viagem",  desc: "Informe destino, datas e viajantes. O RoteiroApp organiza tudo na estrutura certa." },
  { n: "02", icon: Map,      title: "Monte o roteiro",   desc: "Adicione atividades, hospedagens, transporte e despesas. Tudo com mapa integrado." },
  { n: "03", icon: TrendingUp,title: "Viaje e registre", desc: "Acompanhe gastos, escreva no diário e compartilhe o roteiro com o grupo." },
];

const TESTIMONIALS = [
  { name: "Marina C.", dest: "Itália · 18 dias",   text: "Nunca mais esqueci nada. O checklist de malas me salvou!", av: "M", color: "from-pink-600 to-rose-500" },
  { name: "Rafael S.", dest: "Japão · 21 dias",    text: "O controle de orçamento mostrou onde eu estava gastando mais. Perfeito.", av: "R", color: "from-blue-600 to-indigo-500" },
  { name: "Ana P.",    dest: "Portugal · 10 dias", text: "Usei o roteiro da comunidade e adaptei em 5 minutos. Genial.", av: "A", color: "from-violet-600 to-purple-500" },
];

const COMPETITORS = [
  { feature: "100% gratuito",                wp: true, tripit: false, notion: false },
  { feature: "Roteiro dia a dia",            wp: true, tripit: true,  notion: false },
  { feature: "Mapa integrado",               wp: true, tripit: false, notion: false },
  { feature: "Lista de malas por clima",     wp: true, tripit: false, notion: false },
  { feature: "Controle de gastos",           wp: true, tripit: false, notion: false },
  { feature: "Roteiros da comunidade",       wp: true, tripit: false, notion: false },
  { feature: "Diário de viagem",             wp: true, tripit: false, notion: true  },
  { feature: "Alertas de documentos",        wp: true, tripit: false, notion: false },
  { feature: "PT, ES e EN",                  wp: true, tripit: false, notion: false },
];

// ── Live stats from DB (server-rendered) ──────────────────────────
async function getStats() {
  try {
    const [users, trips, destRaw] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.groupBy({ by: ["destination"], _count: { id: true } }),
    ]);
    return { users, trips, destinations: destRaw.length };
  } catch {
    return { users: 0, trips: 0, destinations: 0 };
  }
}

// ── App mockup components ─────────────────────────────────────────
function MockDashboard() {
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden text-left" style={{ background: "#0D1525" }}>
      {/* browser bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/6" style={{ background: "#080E1A" }}>
        <div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" />
        <div className="ml-2 flex-1 h-4 rounded bg-white/4 text-[8px] text-slate-700 flex items-center px-2">RoteiroApp.com.br/dashboard</div>
      </div>
      <div className="flex h-52">
        {/* sidebar */}
        <div className="w-14 border-r border-white/5 flex flex-col items-center py-3 gap-3" style={{ background: "#080F1C" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}><Plane className="h-3 w-3 text-white" /></div>
          {[Map, Wallet, Package, BookOpen].map((Icon, i) => <Icon key={i} className="h-3.5 w-3.5 text-slate-700" />)}
        </div>
        {/* main */}
        <div className="flex-1 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-5 w-16 rounded-lg bg-blue-600/60 text-[7px] text-blue-200 flex items-center justify-center font-semibold">+ Nova viagem</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Roma · Ago", color: "#1A3A5C", accent: "#2D6A9F" },
              { label: "Tóquio · Nov", color: "#1C3B2A", accent: "#2D7A4F" },
              { label: "Lisboa · Fev", color: "#3B1C35", accent: "#7A2D6A" },
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
            {["Itinerário", "Orçamento", "Malas", "Mapa"].map((t, i) => (
              <div key={i} className="flex-1 text-[7px] text-center py-1 rounded border border-white/5 text-slate-600" style={{ background: "rgba(255,255,255,0.02)" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockItinerary() {
  const activities = [
    { time: "09:00", label: "Coliseu", type: "🏛️", color: "#3B82F6" },
    { time: "12:30", label: "Trattoria Roma", type: "🍝", color: "#10B981" },
    { time: "15:00", label: "Fontana di Trevi", type: "🏛️", color: "#3B82F6" },
    { time: "19:00", label: "Hotel Piazza", type: "🏨", color: "#8B5CF6" },
  ];
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "#0D1525" }}>
      <div className="px-3 py-2 border-b border-white/6 flex items-center gap-2" style={{ background: "#080E1A" }}>
        <Map className="h-3 w-3 text-blue-400" />
        <span className="text-[9px] font-bold text-slate-400">Itinerário · Dia 3 — Roma</span>
      </div>
      <div className="p-3 space-y-1.5">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 rounded-lg px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-[9px] text-slate-600 w-8 shrink-0">{a.time}</span>
            <div className="w-0.5 h-4 rounded-full shrink-0" style={{ background: a.color }} />
            <span className="text-[8px]">{a.type}</span>
            <span className="text-[9px] font-medium text-slate-300">{a.label}</span>
          </div>
        ))}
        <div className="mt-2 flex gap-1.5">
          <div className="flex-1 h-16 rounded-lg border border-white/5" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))" }}>
            <div className="p-2"><div className="text-[7px] text-slate-600 mb-1">📍 Mapa</div><div className="h-8 rounded bg-blue-900/30 flex items-center justify-center"><MapPin className="h-3 w-3 text-blue-400" /></div></div>
          </div>
          <div className="flex-1 h-16 rounded-lg border border-white/5 p-2" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-[7px] text-slate-600 mb-1.5">💰 Hoje</div>
            {[["Alimentação","€ 42"],["Ingresso","€ 18"]].map(([l, v]) => (
              <div key={l} className="flex justify-between text-[7px]"><span className="text-slate-500">{l}</span><span className="text-emerald-400">{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockPacking() {
  const items = [
    { name: "Passaporte", done: true }, { name: "Seguro viagem", done: true },
    { name: "Adaptador tomada", done: false }, { name: "Roteador portátil", done: false },
  ];
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "#0D1525" }}>
      <div className="px-3 py-2 border-b border-white/6 flex items-center justify-between" style={{ background: "#080E1A" }}>
        <div className="flex items-center gap-2"><Package className="h-3 w-3 text-violet-400" /><span className="text-[9px] font-bold text-slate-400">Lista de malas</span></div>
        <span className="text-[8px] text-violet-400 font-semibold">2/4 itens</span>
      </div>
      <div className="p-3 space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-1 px-1.5 rounded-md" style={{ background: item.done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)" }}>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-700"}`}>
              {item.done && <Check className="h-2 w-2 text-white" />}
            </div>
            <span className={`text-[9px] ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.name}</span>
          </div>
        ))}
        <div className="mt-2 rounded-lg border border-orange-500/20 p-2" style={{ background: "rgba(249,115,22,0.06)" }}>
          <div className="text-[7px] text-orange-400 font-semibold mb-1">🛒 Comprar na Amazon</div>
          <div className="text-[7px] text-slate-500">Adaptador Universal — R$ 45 →</div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default async function LandingPage() {
  const stats = await getStats();

  const STATS_ITEMS = [
    { value: stats.trips > 0 ? `${stats.trips}+` : "100%", label: stats.trips > 0 ? "viagens planejadas" : "Gratuito para começar" },
    { value: stats.users > 0 ? `${stats.users}+` : "12+",  label: stats.users > 0 ? "viajantes cadastrados" : "funcionalidades inclusas" },
    { value: stats.destinations > 0 ? `${stats.destinations}+` : "3", label: stats.destinations > 0 ? "destinos diferentes" : "idiomas disponíveis" },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "linear-gradient(160deg, #070D14 0%, #0A1520 50%, #070E1A 100%)" }}>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Glows */}
      <div className="fixed top-[-20%] left-[5%]  w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(26,95,204,0.12) 0%, transparent 65%)" }} />
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
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">Entrar</Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 4px 14px rgba(26,95,204,0.35)" }}>
            Criar conta grátis
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-600/10 text-blue-300 text-xs font-semibold mb-7">
            <Star className="h-3 w-3 fill-current" />
            Planejamento completo, 100% gratuito
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.07] mb-5">
            Planeje sua viagem<br />
            <span style={{ background: "linear-gradient(90deg,#5585FA,#2570E8,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              sem complicação
            </span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-lg">
            Roteiro, orçamento, lista de malas, documentos e comunidade — tudo num só lugar. Do primeiro planejamento até a última foto.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/register" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 22px rgba(26,95,204,0.38)" }}>
              Começar agora — é grátis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
              Já tenho conta
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "Sem cartão de crédito",
              "Sem anúncios invasivos",
              "PT · ES · EN",
            ].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* App mockups stack */}
        <div className="relative hidden lg:block">
          <div className="space-y-3">
            <MockDashboard />
            <div className="grid grid-cols-2 gap-3">
              <MockItinerary />
              <MockPacking />
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 text-xs font-semibold text-emerald-300" style={{ background: "rgba(16,185,129,0.10)", backdropFilter: "blur(12px)" }}>
            <CheckCircle className="h-3.5 w-3.5" /> Orçamento no controle
          </div>
          <div className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/25 text-xs font-semibold text-blue-300" style={{ background: "rgba(37,112,232,0.12)", backdropFilter: "blur(12px)" }}>
            <MapPin className="h-3.5 w-3.5" /> 4 atividades hoje
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
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Funcionalidades</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Tudo que sua viagem precisa,<br />
            <span className="text-slate-500 font-medium">num único lugar</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group rounded-2xl border border-white/6 p-6 hover:border-white/12 transition-all duration-300" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MOCKUP DESTAQUE — Itinerário ── */}
      <section className="relative z-10 border-y border-white/5 py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Roteiro inteligente</p>
            <h2 className="text-3xl font-black tracking-tight mb-5">Organize cada dia<br /><span className="text-slate-400 font-medium">no detalhe certo</span></h2>
            <p className="text-slate-400 leading-relaxed mb-7">Adicione atividades com horário, local e custo. O RoteiroApp agrupa automaticamente por Manhã, Tarde e Noite — e mostra tudo no mapa.</p>
            <div className="space-y-3">
              {[
                { icon: Clock,  label: "Agrupamento automático por período do dia" },
                { icon: MapPin, label: "Mapa interativo com todos os pontos da viagem" },
                { icon: Zap,    label: "Affiliate integrado: GetYourGuide e Viator" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                  <Icon className="h-4 w-4 text-blue-400 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
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
                { time: "09:00", label: "Coliseu", sub: "Via Sacra s/n", cost: "€ 18", type: "🏛️", color: "#3B82F6", tag: "Manhã" },
                { time: "11:30", label: "Foro Romano", sub: "A 200m do Coliseu", cost: "incluso", type: "🏛️", color: "#3B82F6", tag: "Manhã" },
                { time: "13:00", label: "Trattoria da Luigi", sub: "Piazza Navona", cost: "€ 24", type: "🍝", color: "#10B981", tag: "Tarde" },
                { time: "15:30", label: "Fontana di Trevi", sub: "Piazza di Trevi", cost: "grátis", type: "💧", color: "#06B6D4", tag: "Tarde" },
                { time: "19:00", label: "Hotel Piazza Venezia", sub: "Check-in", cost: "€ 140/n", type: "🏨", color: "#8B5CF6", tag: "Noite" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-12 text-[9px] text-slate-600 shrink-0">{a.time}</div>
                  <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: a.color }} />
                  <div className="text-sm shrink-0">{a.type}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-200">{a.label}</p>
                    <p className="text-[9px] text-slate-600 truncate">{a.sub}</p>
                  </div>
                  <div className="text-[9px] text-emerald-400 font-semibold shrink-0">{a.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-14 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Como funciona</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">3 passos para a viagem perfeita</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-black text-blue-300" style={{ background: "linear-gradient(135deg,rgba(26,95,204,0.20),rgba(37,112,232,0.10))", border: "1px solid rgba(37,112,232,0.20)" }}>
                  {step.n}
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPARATIVO ── */}
      <section className="relative z-10 border-y border-white/5 py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Por que RoteiroApp?</p>
            <h2 className="text-3xl font-black tracking-tight">A escolha óbvia para<br /><span className="text-slate-400 font-medium">viajantes brasileiros</span></h2>
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="grid grid-cols-4 border-b border-white/6">
              <div className="p-4 text-[11px] text-slate-600 font-semibold">Funcionalidade</div>
              {[
                { name: "RoteiroApp", highlight: true },
                { name: "TripIt", highlight: false },
                { name: "Notion", highlight: false },
              ].map(({ name, highlight }) => (
                <div key={name} className={`p-4 text-center text-xs font-bold ${highlight ? "text-blue-300" : "text-slate-600"}`}>
                  {highlight && <div className="text-[9px] text-blue-400 font-semibold mb-0.5">✓ RECOMENDADO</div>}
                  {name}
                </div>
              ))}
            </div>
            {COMPETITORS.map(({ feature, wp, tripit, notion }, i) => (
              <div key={i} className={`grid grid-cols-4 border-b border-white/4 last:border-0 ${i % 2 === 0 ? "" : ""}`}>
                <div className="p-3 text-xs text-slate-400">{feature}</div>
                {[wp, tripit, notion].map((v, j) => (
                  <div key={j} className={`p-3 flex items-center justify-center ${j === 0 ? "bg-blue-600/5" : ""}`}>
                    {v
                      ? <Check className="h-4 w-4 text-emerald-400" />
                      : <X className="h-4 w-4 text-slate-700" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Comunidade</p>
            <h2 className="text-3xl font-black tracking-tight mb-5">Aprenda com quem<br /><span className="text-slate-400 font-medium">já viajou</span></h2>
            <p className="text-slate-400 leading-relaxed mb-8">Leia relatos reais, descubra roteiros testados e contribua com suas experiências. A comunidade RoteiroApp cresce junto.</p>
            <div className="space-y-3">
              {[
                { icon: BookOpen,   label: "Relatos com avaliação e humor da viagem",   color: "text-pink-400" },
                { icon: Route,      label: "Roteiros prontos para clonar em 1 clique",  color: "text-orange-400" },
                { icon: Lightbulb,  label: "Dicas semanais: documentos, câmbio, saúde", color: "text-yellow-400" },
                { icon: Users,      label: "Compartilhe o roteiro com o grupo de viagem", color: "text-blue-400" },
                { icon: Globe,      label: "Conteúdo em Português, Espanhol e Inglês",  color: "text-teal-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-[10px] font-black text-white`}>{t.av}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-600">{t.dest}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 pb-24">
        <div className="rounded-3xl p-12 text-center border border-blue-500/20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(26,95,204,0.15),rgba(13,123,163,0.08))" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%,rgba(37,112,232,0.10) 0%,transparent 70%)" }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 24px rgba(26,95,204,0.45)" }}>
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Sua próxima viagem começa aqui</h2>
            <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">Crie sua conta em segundos e comece a planejar. Sem cartão de crédito, sem limite.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)", boxShadow: "0 6px 22px rgba(26,95,204,0.40)" }}>
                Criar conta grátis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Já tenho conta →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-14" style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}><Plane className="h-3.5 w-3.5 text-white" /></div>
            <div>
              <span className="text-sm font-bold text-white">RoteiroApp</span>
              <p className="text-[10px] text-slate-700">© 2025 · Feito com ♥ no Brasil</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            {[["Entrar","/login"],["Criar conta","/register"],["Dashboard","/dashboard"],["Roteiros","/routes"],["Dicas","/tips"],["Contato","mailto:alandesouza.ac@gmail.com"]].map(([l,h]) => (
              <a key={l} href={h} className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-[10px] text-slate-700">v1.0 · Next.js 15 · Prisma</div>
        </div>
      </footer>
    </div>
  );
}
