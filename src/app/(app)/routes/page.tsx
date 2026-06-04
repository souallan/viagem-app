"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Clock, MapPin, ChevronDown, ChevronUp, ArrowRight,
  Compass, Globe2, Wallet, CalendarDays, Star, CheckCircle2,
  Users, Plus, User, Sparkles, MessageCircle, Send,
} from "lucide-react";
import { ROUTE_TEMPLATES, RouteTemplate } from "@/lib/route-templates";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface CommunityActivity {
  id: string;
  title: string;
  type: string;
  day: number;
  startTime: string | null;
  location: string | null;
}

interface CommunityRoute {
  id: string;
  authorName: string;
  title: string;
  destination: string;
  country: string;
  continent: string;
  flag: string;
  duration: number;
  coverImage: string | null;
  description: string;
  tags: string;
  highlights: string;
  currency: string;
  estimatedBudget: string;
  createdAt: string;
  activities: CommunityActivity[];
  _count?: { comments: number };
}

interface RouteComment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

// ── Continent config ─────────────────────────────────────────
// key = internal value used for filtering; label comes from translations

const CONTINENT_DEFS: { key: string; dbValue: string | null; icon: string; color: string; activeBg: string; activeBorder: string }[] = [
  { key: "all",         dbValue: null,           icon: "🌍", color: "text-gray-700",  activeBg: "bg-primary-600",  activeBorder: "border-primary-600" },
  { key: "Europa",      dbValue: "Europa",        icon: "🏰", color: "text-blue-700",  activeBg: "bg-blue-600",     activeBorder: "border-blue-600"    },
  { key: "Asia",        dbValue: "Ásia",          icon: "🏯", color: "text-amber-700", activeBg: "bg-amber-500",    activeBorder: "border-amber-500"   },
  { key: "Americas",    dbValue: "Américas",      icon: "🗽", color: "text-teal-700",  activeBg: "bg-teal-600",     activeBorder: "border-teal-600"    },
  { key: "MiddleEast",  dbValue: "Oriente Médio", icon: "🕌", color: "text-purple-700",activeBg: "bg-purple-600",   activeBorder: "border-purple-600"  },
];

const CONTINENT_CARD_ACCENT: Record<string, string> = {
  Europa:        "from-blue-600/80",
  Ásia:          "from-amber-600/80",
  Américas:      "from-teal-600/80",
  "Oriente Médio":"from-purple-600/80",
};

// ── Template Card (Curados) ──────────────────────────────────

function TemplateCard({ template }: { template: RouteTemplate }) {
  const [expanded, setExpanded] = useState(false);
  const accentGradient = CONTINENT_CARD_ACCENT[template.continent] ?? "from-slate-600/80";

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">

      {/* Cover image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.coverImage}
          alt={template.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent via-black/10", accentGradient)} />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Globe2 className="h-3 w-3" />
            {template.continent}
          </span>
          <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            {template.duration} dias
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl drop-shadow-md leading-none">{template.flag}</span>
            <div>
              <p className="text-white font-black text-lg leading-tight drop-shadow-sm">
                {template.destination.split(",")[0]}
              </p>
              <p className="text-white/75 text-xs font-medium">
                {template.destination.split(",").slice(1).join(",").trim() || template.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center divide-x divide-gray-100 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600">
          <Wallet className="h-3.5 w-3.5 text-green-500 shrink-0" />
          <span className="truncate">{template.estimatedBudget}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600">
          <CalendarDays className="h-3.5 w-3.5 text-primary-500 shrink-0" />
          <span>{template.activities.length} atividades</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-gray-900 text-base mb-1.5 leading-tight">{template.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{template.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[11px] bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full font-medium capitalize">
              {tag}
            </span>
          ))}
        </div>

        <ul className="space-y-1.5 mb-4">
          {template.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
              <span>{h}</span>
            </li>
          ))}
          {template.highlights.length > 3 && !expanded && (
            <li className="text-xs text-gray-400 pl-5">+{template.highlights.length - 3} pontos de interesse</li>
          )}
        </ul>

        {expanded && (
          <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-gray-100">
              Atividades incluídas
            </div>
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
              {template.activities.map((act, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                  <span className="text-[10px] font-black text-primary-600 bg-primary-50 border border-primary-100 rounded-md px-1.5 py-0.5 shrink-0 w-10 text-center">
                    D{act.day}
                  </span>
                  <span className="text-xs text-gray-700 flex-1 truncate">{act.title}</span>
                  {act.startTime && (
                    <span className="text-[10px] text-gray-400 shrink-0">{act.startTime}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2.5">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors py-1"
          >
            {expanded
              ? <><ChevronUp className="h-3.5 w-3.5" /> Ocultar atividades</>
              : <><ChevronDown className="h-3.5 w-3.5" /> Ver {template.activities.length} atividades do roteiro</>}
          </button>

          <Link
            href={`/trips/new?template=${template.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white transition-all shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 active:scale-[0.98]"
          >
            Usar este roteiro
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Community Route Card ─────────────────────────────────────

function CommunityCard({ route }: { route: CommunityRoute }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<RouteComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const highlights: string[] = (() => {
    try { return JSON.parse(route.highlights); } catch { return []; }
  })();
  const tags = route.tags ? route.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const accentGradient = CONTINENT_CARD_ACCENT[route.continent] ?? "from-slate-600/80";
  const createdAt = new Date(route.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const commentCount = route._count?.comments ?? 0;

  async function loadComments() {
    if (commentsLoaded) return;
    const r = await fetch(`/api/community-routes/${route.id}/comments`);
    if (r.ok) setComments(await r.json());
    setCommentsLoaded(true);
  }

  async function toggleComments() {
    if (!showComments) await loadComments();
    setShowComments((v) => !v);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    const r = await fetch(`/api/community-routes/${route.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    setCommentLoading(false);
    if (r.ok) {
      const newComment = await r.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    }
  }

  const FALLBACK = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">

      {/* Cover image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={route.coverImage ?? FALLBACK}
          alt={route.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent via-black/10", accentGradient)} />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Users className="h-3 w-3" />
            Comunidade
          </span>
          <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            {route.duration} dias
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl drop-shadow-md leading-none">{route.flag || "📍"}</span>
            <div>
              <p className="text-white font-black text-lg leading-tight drop-shadow-sm">
                {route.destination.split(",")[0]}
              </p>
              <p className="text-white/75 text-xs font-medium">
                {route.destination.split(",").slice(1).join(",").trim() || route.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center divide-x divide-gray-100 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600">
          <Wallet className="h-3.5 w-3.5 text-green-500 shrink-0" />
          <span className="truncate">{route.estimatedBudget || "A definir"}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600">
          <CalendarDays className="h-3.5 w-3.5 text-primary-500 shrink-0" />
          <span>{route.activities.length} atividades</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center shrink-0">
            <User className="h-3 w-3 text-primary-600" />
          </div>
          <span className="text-xs text-gray-500 font-medium">{route.authorName}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">{createdAt}</span>
        </div>

        <h3 className="font-black text-gray-900 text-base mb-1.5 leading-tight">{route.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{route.description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[11px] bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full font-medium capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {highlights.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
            {highlights.length > 3 && !expanded && (
              <li className="text-xs text-gray-400 pl-5">+{highlights.length - 3} destaques</li>
            )}
          </ul>
        )}

        {expanded && route.activities.length > 0 && (
          <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-gray-100">
              Atividades incluídas
            </div>
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
              {route.activities.map((act) => (
                <div key={act.id} className="flex items-center gap-2.5 px-3 py-2">
                  <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 rounded-md px-1.5 py-0.5 shrink-0 w-10 text-center">
                    D{act.day}
                  </span>
                  <span className="text-xs text-gray-700 flex-1 truncate">{act.title}</span>
                  {act.startTime && (
                    <span className="text-[10px] text-gray-400 shrink-0">{act.startTime}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2.5">
          {route.activities.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors py-1"
            >
              {expanded
                ? <><ChevronUp className="h-3.5 w-3.5" /> Ocultar atividades</>
                : <><ChevronDown className="h-3.5 w-3.5" /> Ver {route.activities.length} atividades</>}
            </button>
          )}

          {/* Comments toggle */}
          <button
            onClick={toggleComments}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors py-1 border-t border-gray-50 pt-2"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {showComments ? "Fechar comentários" : `${commentCount > 0 ? commentCount : ""} Comentários`.trim()}
          </button>

          {/* Comments section */}
          {showComments && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="max-h-40 overflow-y-auto divide-y divide-gray-50">
                {comments.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <User className="h-2.5 w-2.5 text-violet-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{c.userName}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 pl-6.5">{c.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={submitComment} className="flex gap-2 p-2 bg-gray-50 border-t border-gray-100">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Deixe um comentário..."
                  className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors shrink-0"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          )}

          <Link
            href={`/trips/new?community=${route.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white transition-all shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98]"
          >
            Usar este roteiro
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function RoutesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<"curados" | "comunidade">(
    searchParams.get("tab") === "community" ? "comunidade" : "curados"
  );
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("all");

  // Community routes state
  const [communityRoutes, setCommunityRoutes] = useState<CommunityRoute[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);

  const loadCommunity = useCallback(async () => {
    setCommunityLoading(true);
    try {
      const r = await fetch("/api/community-routes");
      if (r.ok) setCommunityRoutes(await r.json());
    } finally {
      setCommunityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "comunidade") loadCommunity();
  }, [tab, loadCommunity]);

  // Update URL when tab changes
  function switchTab(t: "curados" | "comunidade") {
    setTab(t);
    setSearch("");
    setContinent("all");
    const params = new URLSearchParams(searchParams.toString());
    if (t === "comunidade") params.set("tab", "community");
    else params.delete("tab");
    router.replace(`/routes?${params.toString()}`, { scroll: false });
  }

  const filteredCurados = useMemo(() => {
    const q = search.toLowerCase();
    return ROUTE_TEMPLATES.filter((tmpl) => {
      const matchesSearch =
        !q ||
        tmpl.title.toLowerCase().includes(q) ||
        tmpl.destination.toLowerCase().includes(q) ||
        tmpl.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        tmpl.highlights.some((h) => h.toLowerCase().includes(q));
      const def = CONTINENT_DEFS.find((c) => c.key === continent);
      const matchesContinent = continent === "all" || tmpl.continent === def?.dbValue;
      return matchesSearch && matchesContinent;
    });
  }, [search, continent]);

  const filteredCommunity = useMemo(() => {
    const q = search.toLowerCase();
    return communityRoutes.filter((r) => {
      const highlights: string[] = (() => { try { return JSON.parse(r.highlights); } catch { return []; } })();
      const tags = r.tags ? r.tags.split(",") : [];
      return !q ||
        r.title.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q)) ||
        highlights.some((h) => h.toLowerCase().includes(q));
    });
  }, [communityRoutes, search]);

  const stats = useMemo(() => {
    const destinations = new Set(ROUTE_TEMPLATES.map((t) => t.country)).size;
    const continents = new Set(ROUTE_TEMPLATES.map((t) => t.continent)).size;
    return { total: ROUTE_TEMPLATES.length, destinations, continents };
  }, []);

  const activeContinent = CONTINENT_DEFS.find((c) => c.key === continent) ?? CONTINENT_DEFS[0];
  const CONTINENTS = CONTINENT_DEFS.map((c) => ({
    ...c,
    label: (t.routes.continents as Record<string, string>)[c.key] ?? c.key,
  }));
  const filtered = tab === "curados" ? filteredCurados : filteredCommunity;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Hero header ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute top-5 right-10 text-5xl opacity-10 animate-float select-none" aria-hidden="true">✈️</div>
        <div className="absolute bottom-5 left-16 text-4xl opacity-10 animate-float select-none" style={{ animationDelay: "1.2s" }} aria-hidden="true">🗺️</div>
        <div className="absolute top-10 left-1/2 text-3xl opacity-10 animate-float select-none" style={{ animationDelay: "2.4s" }} aria-hidden="true">🌍</div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="h-5 w-5 text-primary-400" />
            <p className="text-primary-400 text-sm font-bold tracking-widest uppercase">Biblioteca de Roteiros</p>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t.routes.title}</h1>
          <p className="text-slate-300 mb-6 max-w-xl text-sm leading-relaxed">{t.routes.subtitle}</p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.routes.searchPlaceholder}
              className="w-full h-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 pl-10 pr-4 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
            />
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 mt-6 flex-wrap">
            {[
              { icon: Star,    label: `${stats.total} roteiros curados`     },
              { icon: MapPin,  label: `${stats.destinations} países`         },
              { icon: Users,   label: `${communityRoutes.length || "+"} contribuições da comunidade` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                <span className="text-slate-300 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => switchTab("curados")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
            tab === "curados"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Curados
          <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold", tab === "curados" ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-500")}>
            {stats.total}
          </span>
        </button>
        <button
          onClick={() => switchTab("comunidade")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
            tab === "comunidade"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          Comunidade
          {communityRoutes.length > 0 && (
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold", tab === "comunidade" ? "bg-violet-100 text-violet-700" : "bg-gray-200 text-gray-500")}>
              {communityRoutes.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Continent filter (curados only) ── */}
      {tab === "curados" && (
        <div className="flex gap-2 flex-wrap">
          {CONTINENTS.map((c) => {
            const isActive = continent === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setContinent(c.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                  isActive
                    ? `${c.activeBg} text-white border-transparent shadow-md`
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                )}
              >
                <span className="text-base leading-none">{c.icon}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Community tab header ── */}
      {tab === "comunidade" && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Roteiros da Comunidade</h2>
            <p className="text-sm text-gray-500 mt-0.5">Roteiros criados e compartilhados por outros viajantes</p>
          </div>
          <Link
            href="/routes/contribute"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white transition-all shadow-md shadow-violet-200 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Contribuir com roteiro
          </Link>
        </div>
      )}

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
          roteiro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          {tab === "curados" && continent !== "all" && (
            <span className="ml-1">
              em <span className="font-semibold text-gray-700">{activeContinent.icon} {CONTINENTS.find(c => c.key === continent)?.label ?? continent}</span>
            </span>
          )}
          {search && (
            <span className="ml-1">
              para &quot;<span className="font-semibold text-gray-700">{search}</span>&quot;
            </span>
          )}
        </p>
        {(search || (tab === "curados" && continent !== "Todos")) && (
          <button
            onClick={() => { setSearch(""); setContinent("Todos"); }}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Limpar filtros ×
          </button>
        )}
      </div>

      {/* ── Community loading ── */}
      {tab === "comunidade" && communityLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-gray-100 h-96 skeleton" />
          ))}
        </div>
      )}

      {/* ── Community empty state ── */}
      {tab === "comunidade" && !communityLoading && communityRoutes.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5">
            <Users className="h-9 w-9 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhum roteiro da comunidade ainda</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Seja o primeiro a compartilhar sua experiência de viagem com a comunidade!
          </p>
          <Link
            href="/routes/contribute"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-violet-500 text-white transition-all shadow-md shadow-violet-200"
          >
            <Plus className="h-4 w-4" />
            Criar primeiro roteiro
          </Link>
        </div>
      )}

      {/* ── Grid ── */}
      {(!communityLoading || tab === "curados") && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === "curados"
            ? (filtered as RouteTemplate[]).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))
            : (filtered as CommunityRoute[]).map((route) => (
                <CommunityCard key={route.id} route={route} />
              ))
          }
        </div>
      )}

      {/* ── No results (curados search) ── */}
      {tab === "curados" && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">{t.routes.noResults}</h3>
          <p className="text-gray-400 text-sm">{t.routes.noResultsDesc}</p>
          <button
            onClick={() => { setSearch(""); setContinent("Todos"); }}
            className="mt-5 text-sm text-primary-600 hover:underline font-semibold"
          >
            Ver todos os roteiros
          </button>
        </div>
      )}

      {/* ── No results (community search) ── */}
      {tab === "comunidade" && !communityLoading && communityRoutes.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 font-medium">Nenhum roteiro da comunidade para &quot;{search}&quot;</p>
          <button
            onClick={() => setSearch("")}
            className="mt-4 text-sm text-violet-600 hover:underline font-semibold"
          >
            Ver todos
          </button>
        </div>
      )}

      {/* ── Contribute CTA (curados tab footer) ── */}
      {tab === "curados" && (
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Conhece um roteiro incrível?</p>
              <p className="text-sm text-gray-500">Compartilhe sua experiência e ajude outros viajantes</p>
            </div>
          </div>
          <Link
            href="/routes/contribute"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white transition-all shadow-md shadow-violet-200 active:scale-[0.98] shrink-0"
          >
            <Plus className="h-4 w-4" />
            Contribuir com roteiro
          </Link>
        </div>
      )}
    </div>
  );
}
