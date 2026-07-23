"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Clock, ChevronDown, ChevronUp, ExternalLink, Lightbulb,
  Sparkles, Search, Globe, Loader2, Star, MapPin, Users,
} from "lucide-react";
import { TIPS, type Tip } from "@/lib/tips-data";
import { useLanguage } from "@/contexts/language-context";
import type { ExternalTip } from "@/lib/rss-feeds";
import { cn } from "@/lib/utils";

// ── Week helpers ─────────────────────────────────────────────

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

function nextMonday(): Date {
  const now = new Date();
  const day = now.getDay() || 7;
  const diff = 8 - day;
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

// ── Types ────────────────────────────────────────────────────

interface CommunityTip {
  id: string;
  title: string;
  destination: string;
  tripDate: string;
  coverImage: string | null;
  excerpt: string | null;
  content: string;
  rating: number | null;
  mood: string | null;
  tags: string | null;
  createdAt: string;
  user: { name: string | null } | null;
}

const LANG_FLAGS: Record<string, string> = { pt: "🇧🇷", en: "🇬🇧", es: "🇪🇸" };
const LANG_LABELS: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

const ALL_STATIC_CATEGORIES = ["Todos", ...Array.from(new Set(TIPS.map((t) => t.category)))];

const MOOD_EMOJI: Record<string, string> = {
  AMAZING: "✨", GREAT: "😃", GOOD: "😊", MIXED: "🤔", CHALLENGING: "💪",
};

// ── Static Tip Card ──────────────────────────────────────────

function TipCard({ tip, isNew }: { tip: Tip; isNew: boolean }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className={`h-1.5 ${isNew ? "bg-gradient-to-r from-teal-400 via-primary-400 to-teal-500 animate-pulse" : "bg-gradient-to-r from-gray-200 to-gray-300"}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
            <tip.icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            {isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500 text-white">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> {t.tips.new}
              </span>
            )}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
              {LANG_FLAGS["pt"]} PT
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.categoryColor}`}>
              {tip.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
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
            ? <><ChevronUp className="h-4 w-4" aria-hidden="true" /> {t.tips.close}</>
            : <><ChevronDown className="h-4 w-4" aria-hidden="true" /> {t.tips.readArticle}</>}
        </button>
      </div>
    </article>
  );
}

// ── External Tip Card ────────────────────────────────────────

function ExternalTipCard({ tip, isNew }: { tip: ExternalTip; isNew: boolean }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className={`h-1.5 ${isNew ? "bg-gradient-to-r from-teal-400 via-primary-400 to-teal-500 animate-pulse" : "bg-gradient-to-r from-gray-200 to-gray-300"}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0 text-xl">
            {LANG_FLAGS[tip.lang]}
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            {isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500 text-white">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> NOVO
              </span>
            )}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
              {LANG_FLAGS[tip.lang]} {LANG_LABELS[tip.lang]}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.categoryColor}`}>
              {tip.category}
            </span>
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2">{tip.title}</h2>
        <p className="text-sm text-gray-500 mb-3 line-clamp-3 flex-1">{tip.excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Globe className="h-3 w-3" aria-hidden="true" />
            {tip.sourceName}
          </span>
          <a
            href={tip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            Ler artigo
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ── Community Experience Card ────────────────────────────────

function CommunityTipCard({ tip }: { tip: CommunityTip }) {
  const [expanded, setExpanded] = useState(false);
  const tags = tip.tags ? tip.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const paragraphs = tip.content.split("\n").filter((p) => p.trim());
  const excerpt = tip.excerpt || tip.content.slice(0, 140) + (tip.content.length > 140 ? "…" : "");
  const authorName = tip.user?.name || "Viajante";

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500" />

      {/* Cover */}
      {tip.coverImage && (
        <div className="h-36 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tip.coverImage} alt={tip.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
              <Users className="h-3.5 w-3.5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">{authorName}</p>
              <p className="text-[10px] text-gray-500">{tip.tripDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto flex-wrap justify-end">
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100 font-semibold">
              Comunidade
            </span>
            {tip.mood && MOOD_EMOJI[tip.mood] && (
              <span className="text-sm" title={tip.mood}>{MOOD_EMOJI[tip.mood]}</span>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 text-primary-500 shrink-0" />
          <span className="font-medium">{tip.destination}</span>
        </div>

        <h2 className="font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2">{tip.title}</h2>

        {/* Rating */}
        {tip.rating && (
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={cn("h-3 w-3", s <= tip.rating! ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-3 line-clamp-3">{excerpt}</p>

        {/* Expanded content */}
        {expanded && (
          <div className="mb-4 space-y-2.5 border-t border-gray-100 pt-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
            ))}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <Link
            href={`/experiences/${tip.id}`}
            className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            Ver relato completo →
          </Link>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
          >
            {expanded
              ? <><ChevronUp className="h-4 w-4" /> Ocultar</>
              : <><ChevronDown className="h-4 w-4" /> Ler mais</>}
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Unified item ─────────────────────────────────────────────

type UnifiedTip =
  | { kind: "static";    tip: Tip;          publishedAt: string; lang: "pt" }
  | { kind: "external";  tip: ExternalTip;  publishedAt: string; lang: "pt" | "en" | "es" }
  | { kind: "community"; tip: CommunityTip; publishedAt: string; lang: "pt" };

// ── Page ─────────────────────────────────────────────────────

export default function TipsPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeLang, setActiveLang] = useState<"all" | "pt" | "en" | "es">("all");
  const [search, setSearch] = useState("");
  const [externalTips, setExternalTips] = useState<ExternalTip[]>([]);
  const [communityTips, setCommunityTips] = useState<CommunityTip[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(true);
  const [externalError, setExternalError] = useState(false);

  const today = useMemo(() => new Date(), []);
  const currentISOWeek = getISOWeek(today);
  const currentISOYear = getISOYear(today);

  useEffect(() => {
    fetch("/api/tips/external")
      .then((r) => r.json())
      .then((data) => { setExternalTips(data.tips ?? []); setLoadingExternal(false); })
      .catch(() => { setExternalError(true); setLoadingExternal(false); });
  }, []);

  useEffect(() => {
    fetch("/api/tips/community")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCommunityTips(data))
      .catch(() => {});
  }, []);

  function isCurrentWeek(publishedAt: string): boolean {
    const d = new Date(publishedAt + "T12:00:00Z");
    return getISOWeek(d) === currentISOWeek && getISOYear(d) === currentISOYear;
  }

  function matchesSearch(title: string, excerpt: string, body?: string): boolean {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      title.toLowerCase().includes(q) ||
      excerpt.toLowerCase().includes(q) ||
      (body ? body.toLowerCase().includes(q) : false)
    );
  }

  const unified = useMemo((): UnifiedTip[] => {
    const staticItems: UnifiedTip[] = TIPS.map((tip) => ({
      kind: "static", tip, publishedAt: tip.publishedAt, lang: "pt" as const,
    }));
    const externalItems: UnifiedTip[] = externalTips.map((tip) => ({
      kind: "external", tip, publishedAt: tip.publishedAt, lang: tip.lang,
    }));
    const communityItems: UnifiedTip[] = communityTips.map((tip) => ({
      kind: "community", tip, publishedAt: tip.createdAt, lang: "pt" as const,
    }));
    return [...staticItems, ...externalItems, ...communityItems].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [externalTips, communityTips]);

  const filtered = unified.filter((item) => {
    if (activeLang !== "all" && item.lang !== activeLang) return false;
    if (activeCategory !== "Todos" && item.kind === "static" && item.tip.category !== activeCategory) return false;

    if (item.kind === "static") {
      return matchesSearch(item.tip.title, item.tip.excerpt, item.tip.body.join(" "));
    } else if (item.kind === "external") {
      return matchesSearch(item.tip.title, item.tip.excerpt);
    } else {
      return matchesSearch(
        item.tip.title,
        item.tip.excerpt ?? item.tip.content.slice(0, 200),
        item.tip.content + " " + item.tip.destination
      );
    }
  });

  const nextUpdate = nextMonday();
  const daysLeft = daysUntil(nextUpdate);

  function countdownLabel() {
    if (daysLeft === 0) return t.tips.today;
    if (daysLeft === 1) return t.tips.tomorrow;
    return t.tips.inDays.replace("{n}", String(daysLeft));
  }

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
              {t.tips.community}
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">{t.tips.title}</h1>
            <p className="text-slate-300 max-w-lg text-sm">{t.tips.subtitle}</p>
          </div>
          <div className="travel-glass rounded-xl px-4 py-3 text-center shrink-0">
            <p className="text-teal-300 text-xs font-medium mb-0.5">{t.tips.nextUpdate}</p>
            <p className="text-white font-bold text-lg">{countdownLabel()}</p>
            <p className="text-slate-400 text-xs">{t.tips.everyMonday}</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {communityTips.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl text-sm">
          <Users className="h-4 w-4 text-violet-500 shrink-0" />
          <span className="text-violet-700 font-medium">
            {communityTips.length} relato{communityTips.length !== 1 ? "s" : ""} da comunidade incluído{communityTips.length !== 1 ? "s" : ""}
          </span>
          <span className="text-violet-400 text-xs ml-1">— experiências reais de outros viajantes</span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, destino ou conteúdo..."
          className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600">
            ×
          </button>
        )}
      </div>

      {/* Language filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Globe className="h-4 w-4 text-gray-500 shrink-0" aria-hidden="true" />
        {(["all", "pt", "en", "es"] as const).map((l) => (
          <button
            key={l}
            onClick={() => {
              setActiveLang(l);
              if (l !== "pt" && l !== "all") setActiveCategory("Todos");
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeLang === l
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            {l === "all" ? "Todos idiomas" : `${LANG_FLAGS[l]} ${LANG_LABELS[l]}`}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-gray-500">
          {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
          {loadingExternal && (
            <span className="inline-flex items-center gap-1 ml-2 text-gray-300">
              <Loader2 className="h-3 w-3 animate-spin" /> carregando externos...
            </span>
          )}
        </span>
      </div>

      {/* Category filter — only when PT or All selected */}
      {(activeLang === "all" || activeLang === "pt") && (
        <div className="flex gap-2 flex-wrap">
          {ALL_STATIC_CATEGORIES.map((cat) => (
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
        </div>
      )}

      {/* External error notice */}
      {externalError && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
          Não foi possível carregar artigos externos. Os artigos do RoteiroApp estão disponíveis normalmente.
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            if (item.kind === "static") return (
              <TipCard key={item.tip.id} tip={item.tip} isNew={isCurrentWeek(item.publishedAt)} />
            );
            if (item.kind === "external") return (
              <ExternalTipCard key={item.tip.id} tip={item.tip} isNew={isCurrentWeek(item.publishedAt)} />
            );
            return <CommunityTipCard key={item.tip.id} tip={item.tip} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-200" aria-hidden="true" />
          <p className="text-gray-500 font-medium">{t.tips.noArticles}</p>
        </div>
      )}
    </div>
  );
}
