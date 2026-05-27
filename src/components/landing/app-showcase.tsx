"use client";

import { useState } from "react";
import {
  LayoutGrid, Map, Wallet, Package, Shield, Calendar, Plane,
  Plus, ShoppingCart, AlertTriangle, CheckCircle2, FileWarning,
  Clock, MapPin, Star, Check, TrendingUp, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Sidebar ────────────────────────────────────────────────────

function MockSidebar({ active }: { active: string }) {
  const nav = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
    { id: "itinerary", icon: Map,         label: "Itinerário" },
    { id: "budget",    icon: Wallet,       label: "Orçamento" },
    { id: "packing",   icon: Package,      label: "Malas" },
    { id: "documents", icon: Shield,       label: "Documentos" },
  ];

  return (
    <div className="w-44 border-r border-gray-100 bg-white shrink-0 flex flex-col">
      <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}>
          <Plane className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs font-bold text-gray-900">RoteiroApp</span>
      </div>
      <div className="px-3 py-2 border-b border-gray-50">
        <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wide">Viagem ativa</p>
        <p className="text-[10px] font-bold text-gray-700 mt-0.5 truncate">Roma · Jul 2026</p>
      </div>
      <nav className="flex-1 py-2 px-2 space-y-0.5">
        {nav.map(({ id, icon: Icon, label }) => (
          <div key={id} className={cn(
            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold",
            active === id ? "bg-blue-50 text-blue-700" : "text-gray-500"
          )}>
            <Icon className={cn("h-3 w-3 shrink-0", active === id ? "text-blue-600" : "text-gray-400")} />
            {label}
          </div>
        ))}
      </nav>
      <div className="px-3 pb-3 mt-auto space-y-0.5 border-t border-gray-50 pt-2">
        {["Mapa", "Transporte", "Diário", "Preparativos"].map((l) => (
          <div key={l} className="text-[9px] text-gray-400 px-2.5 py-1">{l}</div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 1: Dashboard ────────────────────────────────────────

function DashboardScreen() {
  const trips = [
    { dest: "Roma, Itália",       dates: "15–28 Jul 2026",  status: "Em andamento", pct: 68, bg: "linear-gradient(135deg,#1A3A5C,#2D6A9F)", budget: "€ 842 / € 1.500",  star: 0 },
    { dest: "Tóquio, Japão",      dates: "4–18 Nov 2026",   status: "Planejando",   pct: 28, bg: "linear-gradient(135deg,#1C2A3B,#3B5080)", budget: "¥ 28.000 / ¥ 90.000", star: 0 },
    { dest: "Lisboa, Portugal",   dates: "10–19 Fev 2027",  status: "Planejando",   pct: 10, bg: "linear-gradient(135deg,#2A1C3B,#5C3A7A)", budget: "€ 150 / € 1.200",  star: 0 },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Minhas Viagens</h2>
          <p className="text-[9px] text-gray-400">3 viagens · 1 em andamento</p>
        </div>
        <button className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-sm" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}>
          <Plus className="h-2.5 w-2.5" /> Nova viagem
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {trips.map((trip, i) => (
          <div key={i} className={cn("bg-white rounded-xl border overflow-hidden shadow-sm", i === 0 ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100")}>
            <div className="h-20 relative" style={{ background: trip.bg }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-1.5 left-2">
                <span className={cn(
                  "text-[7px] font-bold px-1.5 py-0.5 rounded-full",
                  i === 0 ? "bg-green-500 text-white" : "bg-white/25 text-white"
                )}>{trip.status}</span>
              </div>
              {i === 0 && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-2 w-2 fill-amber-400 text-amber-400" />)}
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-[10px] font-bold text-gray-900 truncate">{trip.dest}</p>
              <p className="text-[8px] text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-2 w-2" />{trip.dates}
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-[7px] text-gray-400 mb-0.5">
                  <span>Orçamento</span><span className={i === 0 ? "text-blue-600 font-semibold" : ""}>{trip.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-1 rounded-full" style={{ width: `${trip.pct}%`, background: i === 0 ? "#2570E8" : "#94A3B8" }} />
                </div>
                <p className="text-[7px] text-gray-400 mt-1">{trip.budget}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { l: "Itinerário",  v: "5 atividades", c: "text-blue-600" },
          { l: "Orçamento",   v: "€ 842 gastos",   c: "text-emerald-600" },
          { l: "Malas",       v: "18/28 itens",    c: "text-violet-600" },
          { l: "Documentos",  v: "⚠️ 1 alerta",    c: "text-red-600" },
        ].map(({ l, v, c }) => (
          <div key={l} className="bg-white rounded-xl border border-gray-100 p-2.5 shadow-sm">
            <p className="text-[8px] text-gray-500 font-medium">{l}</p>
            <p className={cn("text-[9px] font-bold mt-0.5", c)}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 2: Itinerary ────────────────────────────────────────

function ItineraryScreen() {
  const acts = [
    { time: "09:00", label: "Coliseu",              sub: "Via Sacra s/n, Roma",   cost: "€ 18",   emoji: "🏛️", color: "#3B82F6" },
    { time: "11:30", label: "Foro Romano",           sub: "Perto do Coliseu",       cost: "incluso", emoji: "🏛️", color: "#3B82F6" },
    { time: "13:00", label: "Trattoria da Luigi",    sub: "Piazza Navona, 15",      cost: "€ 24",   emoji: "🍝", color: "#F59E0B" },
    { time: "15:30", label: "Fontana di Trevi",      sub: "Piazza di Trevi",        cost: "grátis", emoji: "💧", color: "#06B6D4" },
    { time: "19:00", label: "Hotel Piazza Venezia",  sub: "Check-in · Piazza Venezia",cost: "€ 140", emoji: "🏨", color: "#8B5CF6" },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Itinerário</h2>
          <p className="text-[9px] text-gray-400">5 atividades · R$ 206 estimado</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex bg-gray-200 p-0.5 rounded-lg">
            <button className="text-[8px] px-2 py-1 rounded-md bg-white text-gray-900 font-bold shadow-sm">Timeline</button>
            <button className="text-[8px] px-2 py-1 text-gray-500">Por Período</button>
          </div>
          <button className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-sm" style={{ background: "#1A5FCC" }}>+ Adicionar</button>
        </div>
      </div>

      {/* Day header */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5">
        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg,#1A5FCC,#2570E8)" }}>
          <span className="text-[7px] font-bold uppercase opacity-80">DIA</span>
          <span className="text-base font-black leading-none">3</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-900">Terça-feira, 15 de julho de 2026</p>
          <p className="text-[8px] text-gray-400 mt-0.5">Roma, Itália</p>
        </div>
        <span className="text-[8px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">5 atividades</span>
        <span className="text-[8px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">€ 206</span>
      </div>

      {/* Timeline */}
      <div className="space-y-1.5">
        {acts.map((a, i) => (
          <div key={i} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="shrink-0 self-stretch w-1" style={{ background: a.color }} />
            <span className="text-[8px] text-gray-400 w-9 shrink-0 py-2">{a.time}</span>
            <span className="text-sm shrink-0">{a.emoji}</span>
            <div className="flex-1 min-w-0 py-2">
              <p className="text-[10px] font-bold text-gray-900 leading-tight">{a.label}</p>
              <p className="text-[8px] text-gray-400 truncate">{a.sub}</p>
            </div>
            <span className="text-[9px] font-semibold text-green-700 pr-3 shrink-0">{a.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: Budget ───────────────────────────────────────────

function BudgetScreen() {
  const cats = [
    { label: "Hospedagem",  emoji: "🏨", amount: 420, pct: 50, color: "#8B5CF6" },
    { label: "Alimentação", emoji: "🍽️", amount: 285, pct: 34, color: "#F59E0B" },
    { label: "Atividades",  emoji: "🎭", amount: 112, pct: 13, color: "#3B82F6" },
    { label: "Transporte",  emoji: "🚌", amount: 25,  pct:  3, color: "#10B981" },
  ];

  const expenses = [
    { label: "Hotel Leonardo da Vinci",  cat: "Hospedagem",  val: "€ 140", date: "15 Jul", color: "#8B5CF6" },
    { label: "Trattoria da Luigi",        cat: "Alimentação", val: "€ 24",  date: "15 Jul", color: "#F59E0B" },
    { label: "Coliseu + Foro Romano",     cat: "Atividades",  val: "€ 18",  date: "15 Jul", color: "#3B82F6" },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Orçamento</h2>
        <button className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-sm" style={{ background: "#1A5FCC" }}>+ Despesa</button>
      </div>

      {/* Overview card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <div className="flex justify-between items-start mb-2.5">
          <div>
            <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wide">Total gasto</p>
            <p className="text-xl font-black text-gray-900">€ 842</p>
            <p className="text-[8px] text-gray-400">de € 1.500 planejado · 7 dias</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-gray-400 mb-0.5">Restante</p>
            <p className="text-base font-bold text-green-600">€ 658</p>
            <div className="flex items-center gap-1 justify-end">
              <TrendingUp className="h-2.5 w-2.5 text-green-500" />
              <p className="text-[8px] text-green-600 font-medium">43% livre</p>
            </div>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-1">
          <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: "56%" }} />
        </div>
        <p className="text-[7px] text-gray-400">56% do orçamento utilizado</p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-2">Por categoria</p>
        <div className="space-y-2">
          {cats.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-medium text-gray-700 flex items-center gap-1.5">{cat.emoji} {cat.label}</span>
                <span className="text-[9px] font-bold text-gray-900">€ {cat.amount} <span className="text-gray-400 font-normal">({cat.pct}%)</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${cat.pct}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent expenses */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-2">Últimas despesas</p>
        <div className="space-y-1.5">
          {expenses.map((exp, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full shrink-0" style={{ background: exp.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-medium text-gray-800 truncate">{exp.label}</p>
                <p className="text-[7px] text-gray-400">{exp.cat} · {exp.date}</p>
              </div>
              <p className="text-[9px] font-bold text-gray-900 shrink-0">{exp.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Screen 4: Packing ──────────────────────────────────────────

function PackingScreen() {
  const categories = [
    { label: "Documentos", icon: "📄", items: [
      { name: "Passaporte", done: true },
      { name: "Visto Schengen", done: true },
      { name: "Seguro viagem", done: false, link: { label: "Contratar →", color: "text-green-600" } },
      { name: "Passagens impressas", done: true },
    ]},
    { label: "Eletrônicos", icon: "🔌", items: [
      { name: "Carregador de celular", done: true },
      { name: "Adaptador tipo C/F", done: false, link: { label: "Amazon →", color: "text-orange-500" } },
      { name: "Power bank 20.000 mAh", done: false },
    ]},
    { label: "Roupas", icon: "👕", items: [
      { name: "Casaco impermeável", done: true },
      { name: "Roupas em camadas", done: true },
      { name: "Tênis para caminhar", done: false },
    ]},
  ];

  const allItems = categories.flatMap((c) => c.items);
  const packed = allItems.filter((i) => i.done).length;
  const pct = Math.round((packed / allItems.length) * 100);

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Lista de Malas</h2>
          <p className="text-[9px] text-gray-400">{packed}/{allItems.length} itens · {pct}% empacotado · 12 dias</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 text-[8px] font-bold px-2 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50">✨ Gerar lista</button>
          <button className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-sm" style={{ background: "#1A5FCC" }}>+ Item</button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[8px] text-gray-500 mb-1 font-medium">
          <span>{packed} de {allItems.length} itens</span>
          <span className={pct === 100 ? "text-green-600 font-bold" : ""}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-2.5 rounded-full bg-sky-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 flex items-center gap-2.5">
        <span className="text-lg">🇪🇺</span>
        <div>
          <p className="text-[9px] font-bold text-blue-900">Lista personalizada para Europa detectada</p>
          <p className="text-[8px] text-blue-600 mt-0.5">2 perfis: Europa + 12 dias de viagem · 8 sugestões</p>
        </div>
      </div>

      <div className="space-y-2 overflow-auto">
        {categories.map((cat) => {
          const catPacked = cat.items.filter((i) => i.done).length;
          return (
            <div key={cat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">{cat.icon} {cat.label}</span>
                <span className="text-[7px] text-gray-400">{catPacked}/{cat.items.length}</span>
              </div>
              <div className="space-y-1">
                {cat.items.map((item: { name: string; done: boolean; link?: { label: string; color: string } }) => (
                  <div key={item.name} className={cn("flex items-center gap-2 py-1 px-1.5 rounded-lg", item.done ? "bg-green-50" : "")}>
                    <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0", item.done ? "bg-emerald-500 border-emerald-500" : "border-gray-300")}>
                      {item.done && <Check className="h-2 w-2 text-white" />}
                    </div>
                    <span className={cn("text-[9px] flex-1", item.done ? "text-gray-400 line-through" : "text-gray-700")}>{item.name}</span>
                    {!item.done && item.link && (
                      <span className={cn("text-[7px] font-semibold flex items-center gap-0.5 shrink-0", item.link.color)}>
                        {item.link.label.includes("Amazon") && <ShoppingCart className="h-2 w-2" />}
                        {item.link.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Screen 5: Documents ────────────────────────────────────────

function DocumentsScreen() {
  const docs = [
    { icon: "🛂", type: "PASSAPORTE", typeColor: "text-blue-700 bg-blue-50 border-blue-100", title: "Passaporte Brasileiro", detail: "Vence em 89d — 15 mar 2027", detailColor: "text-red-600 bg-red-50 border-red-100", status: "critical", card: "border-red-200" },
    { icon: "📋", type: "VISTO",      typeColor: "text-purple-700 bg-purple-50 border-purple-100", title: "Visto Schengen (Múltiplas entradas)", detail: "Válido até 20 ago 2027",  detailColor: "text-gray-500", status: "ok",       card: "border-gray-100" },
    { icon: "🛡️", type: "SEGURO",     typeColor: "text-green-700 bg-green-50 border-green-100",  title: "Assist Card Internacional",          detail: "Válido até 28 jul 2026",   detailColor: "text-green-600", status: "ok",      card: "border-gray-100" },
    { icon: "🎫", type: "PASSAGEM",   typeColor: "text-orange-700 bg-orange-50 border-orange-100", title: "TAM — GRU → FCO → GRU",             detail: "Ver PDF →",               detailColor: "text-blue-600 underline cursor-pointer", status: "link", card: "border-gray-100" },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Cofre de Documentos</h2>
            <p className="text-[9px] text-gray-400">4 documentos armazenados com segurança</p>
          </div>
        </div>
        <button className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-sm" style={{ background: "#1A5FCC" }}>+ Adicionar</button>
      </div>

      {/* Alert banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-[10px] font-bold text-red-900">1 documento precisa de atenção imediata</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white rounded-lg px-3 py-2 border border-red-100">
          <span className="text-base">🛂</span>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-semibold text-gray-900">Passaporte Brasileiro</p>
            <p className="text-[8px] text-red-600 font-medium">Vence em 89 dias — antes da viagem!</p>
          </div>
          <span className="text-[7px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full shrink-0">CRÍTICO</span>
        </div>
      </div>

      {/* Date reference */}
      <div className="flex items-center gap-2 text-[8px] text-gray-500 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 shadow-sm">
        <Calendar className="h-3 w-3 text-blue-500 shrink-0" />
        Alertas calculados a partir de: <strong className="text-gray-700 ml-1">15 de julho de 2026</strong>
      </div>

      {/* Document cards */}
      <div className="space-y-2">
        {docs.map((doc, i) => (
          <div key={i} className={cn("bg-white rounded-xl border p-3 shadow-sm", doc.card)}>
            <div className="flex items-start gap-2.5">
              <span className="text-lg shrink-0">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-md border", doc.typeColor)}>{doc.type}</span>
                  {doc.status === "ok"       && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  {doc.status === "critical" && <FileWarning  className="h-3.5 w-3.5 text-red-500" />}
                </div>
                <p className="text-[10px] font-bold text-gray-900 leading-snug mb-1">{doc.title}</p>
                <span className={cn("text-[8px] font-semibold flex items-center gap-1", doc.detailColor)}>
                  {doc.status === "critical" && <AlertTriangle className="h-2.5 w-2.5" />}
                  {doc.status === "ok"       && <Calendar className="h-2.5 w-2.5" />}
                  {doc.detail}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Showcase ───────────────────────────────────────────────────

const TAB_CONFIG = [
  { id: "dashboard", icon: LayoutGrid, screen: DashboardScreen },
  { id: "itinerary", icon: Map,        screen: ItineraryScreen },
  { id: "budget",    icon: Wallet,     screen: BudgetScreen    },
  { id: "packing",   icon: Package,    screen: PackingScreen   },
  { id: "documents", icon: Shield,     screen: DocumentsScreen },
] as const;

interface ShowcaseT {
  sectionLabel: string;
  title1: string;
  title2: string;
  subtitle: string;
  disclaimer: string;
  tabs: { dashboard: string; itinerary: string; budget: string; packing: string; documents: string };
}

export function AppShowcase({ t }: { t: ShowcaseT }) {
  const [active, setActive] = useState<string>("dashboard");
  const ActiveScreen = TAB_CONFIG.find((tab) => tab.id === active)!.screen;

  const tabLabel: Record<string, string> = {
    dashboard: t.tabs.dashboard,
    itinerary: t.tabs.itinerary,
    budget:    t.tabs.budget,
    packing:   t.tabs.packing,
    documents: t.tabs.documents,
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 py-24">
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.sectionLabel}</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          {t.title1}<br />
          <span className="text-slate-500 font-medium">{t.title2}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">{t.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {TAB_CONFIG.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              active === id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {tabLabel[id]}
          </button>
        ))}
      </div>

      {/* Browser window */}
      <div
        className="rounded-2xl overflow-hidden border border-white/10"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-200" style={{ background: "#e8eaed" }}>
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
          <div className="ml-2 flex-1 max-w-sm h-6 rounded-md bg-white border border-gray-300 text-[10px] text-gray-400 flex items-center px-3 gap-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            roteiroapp.com{active === "dashboard" ? "/dashboard" : `/trips/abc/${active}`}
          </div>
        </div>

        {/* App content */}
        <div className="flex" style={{ height: 440, background: "#f8fafc" }}>
          <MockSidebar active={active} />
          <ActiveScreen />
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-700 mt-4">{t.disclaimer}</p>
    </section>
  );
}
