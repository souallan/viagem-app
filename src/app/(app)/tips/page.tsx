"use client";

import { useState, useMemo } from "react";
import {
  Clock, ChevronDown, ChevronUp, ExternalLink, Lightbulb,
  Sparkles, Archive, Calendar, ChevronRight,
} from "lucide-react";
import { TIPS, type Tip } from "@/lib/tips-data";

// ── Week helpers ────────────────────────────────────────────

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getISOYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d.getUTCFullYear();
}

function weekStart(isoYear: number, isoWeek: number): Date {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (isoWeek - 1) * 7);
  return monday;
}

function weekLabel(isoYear: number, isoWeek: number): string {
  const start = weekStart(isoYear, isoWeek);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function nextMonday(): Date {
  const now = new Date();
  const day = now.getDay() || 7;
  const diff = 8 - day; // days until next Monday (or 7 if today is Monday)
  const next = new Date(now);
  next.setDate(now.getDate() + (diff === 7 ? 7 : diff));
  next.setHours(0, 0, 0, 0);
  return next;
}

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - now.getTime()) / 86400000);
}

// ── Category filter ─────────────────────────────────────────

const ALL_CATEGORIES = ["Todos", ...Array.from(new Set(TIPS.map((t) => t.category)))];

// ── Tip Card ────────────────────────────────────────────────

function TipCard({ tip, isNew }: { tip: Tip; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className={`h-1.5 ${isNew ? "bg-gradient-to-r from-teal-400 via-sky-400 to-teal-500 animate-pulse" : "bg-gradient-to-r from-gray-200 to-gray-300"}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
            <tip.icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            {isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500 text-white">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> NOVO
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.categoryColor}`}>
              {tip.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {tip.readTime} min
            </span>
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-1.5 leading-snug">{tip.title}</h2>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tip.excerpt}</p>

        {expanded && (
          <div className="mb-4 space-y-2.5 border-t border-gray-100 pt-4">
            {tip.body.map((para, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
            ))}
            {tip.link && (
              <a
                href={tip.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 mt-2"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {tip.link.label}
              </a>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-auto flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          aria-expanded={expanded}
        >
          {expanded
            ? <><ChevronUp className="h-4 w-4" aria-hidden="true" /> Fechar</>
            : <><ChevronDown className="h-4 w-4" aria-hidden="true" /> Ler artigo</>}
        </button>
      </div>
    </article>
  );
}

// ── Week archive accordion ───────────────────────────────────

function WeekGroup({
  isoYear, isoWeek, tips, activeCategory,
}: {
  isoYear: number;
  isoWeek: number;
  tips: Tip[];
  activeCategory: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = activeCategory === "Todos" ? tips : tips.filter((t) => t.category === activeCategory);
  if (filtered.length === 0) return null;

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-gray-700">
            Semana de {weekLabel(isoYear, isoWeek)}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
            {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((tip) => (
              <TipCard key={tip.id} tip={tip} isNew={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const today = useMemo(() => new Date(), []);
  const currentISOWeek = getISOWeek(today);
  const currentISOYear = getISOYear(today);

  const { thisWeek, archive } = useMemo(() => {
    const thisWeek: Tip[] = [];
    const byWeek: Record<string, { year: number; week: number; tips: Tip[] }> = {};

    for (const tip of TIPS) {
      const d = new Date(tip.publishedAt + "T12:00:00Z");
      const w = getISOWeek(d);
      const y = getISOYear(d);
      if (w === currentISOWeek && y === currentISOYear) {
        thisWeek.push(tip);
      } else {
        const key = `${y}-${String(w).padStart(2, "0")}`;
        if (!byWeek[key]) byWeek[key] = { year: y, week: w, tips: [] };
        byWeek[key].tips.push(tip);
      }
    }

    // Sort archive descending (most recent first)
    const archive = Object.values(byWeek).sort((a, b) =>
      a.year !== b.year ? b.year - a.year : b.week - a.week
    );

    return { thisWeek, archive };
  }, [currentISOWeek, currentISOYear]);

  const filteredThisWeek =
    activeCategory === "Todos" ? thisWeek : thisWeek.filter((t) => t.category === activeCategory);

  const nextUpdate = nextMonday();
  const daysLeft = daysUntil(nextUpdate);

  const totalCount = TIPS.filter(
    (t) => activeCategory === "Todos" || t.category === activeCategory
  ).length;

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8">
        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle, #2dd4bf 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-1">
              Comunidade ViagemApp
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dicas & Guias de <span className="gradient-text">Viagem</span>
            </h1>
            <p className="text-slate-300 max-w-lg text-sm">
              Novos artigos toda semana — escritos por especialistas e viajantes experientes.
            </p>
          </div>
          {/* Next update badge */}
          <div className="travel-glass rounded-xl px-4 py-3 text-center shrink-0">
            <p className="text-teal-300 text-xs font-medium mb-0.5">Próxima atualização</p>
            <p className="text-white font-bold text-lg">
              {daysLeft === 0 ? "Hoje!" : daysLeft === 1 ? "Amanhã" : `Em ${daysLeft} dias`}
            </p>
            <p className="text-slate-400 text-xs">toda segunda-feira</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-teal-500 text-white shadow-md shadow-teal-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-gray-400">
          {totalCount} artigo{totalCount !== 1 ? "s" : ""} no total
        </span>
      </div>

      {/* ── Esta semana ── */}
      {filteredThisWeek.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="h-5 w-5 text-teal-500" aria-hidden="true" />
            <h2 className="text-lg font-bold text-gray-900">Esta semana</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500 text-white">
              {filteredThisWeek.length} novo{filteredThisWeek.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredThisWeek.map((tip) => (
              <TipCard key={tip.id} tip={tip} isNew={true} />
            ))}
          </div>
        </section>
      )}

      {filteredThisWeek.length === 0 && activeCategory !== "Todos" && (
        <div className="text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
          Nenhum artigo novo desta categoria esta semana. Confira o arquivo abaixo.
        </div>
      )}

      {/* ── Arquivo ── */}
      {archive.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Archive className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <h2 className="text-lg font-bold text-gray-900">Arquivo</h2>
            <span className="text-xs text-gray-400">
              {archive.length} semana{archive.length !== 1 ? "s" : ""} anteriores
            </span>
          </div>
          <div className="space-y-3">
            {archive.map(({ year, week, tips }) => (
              <WeekGroup
                key={`${year}-${week}`}
                isoYear={year}
                isoWeek={week}
                tips={tips}
                activeCategory={activeCategory}
              />
            ))}
          </div>
        </section>
      )}

      {/* All empty */}
      {filteredThisWeek.length === 0 && archive.every(({ tips }) =>
        activeCategory !== "Todos" && !tips.some((t) => t.category === activeCategory)
      ) && (
        <div className="text-center py-16">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-200" aria-hidden="true" />
          <p className="text-gray-500 font-medium">Nenhum artigo nesta categoria ainda.</p>
        </div>
      )}
    </div>
  );
}
