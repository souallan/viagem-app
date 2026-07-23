"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Search, MapPin, Star, Trash2, Pencil, Globe, BookOpen,
  Clock, SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface Experience {
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
}

const MOOD_CONFIG: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
  AMAZING:     { emoji: "✨", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  GREAT:       { emoji: "😃", bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200"  },
  GOOD:        { emoji: "😊", bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200"   },
  MIXED:       { emoji: "🤔", bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200"  },
  CHALLENGING: { emoji: "💪", bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200"    },
};

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function StarRating({ rating, size = "sm" }: { rating: number | null; size?: "sm" | "md" }) {
  if (!rating) return null;
  const sz = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn(sz, s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
      ))}
    </div>
  );
}

function FeaturedCard({ exp, onDelete }: { exp: Experience; onDelete: (id: string) => void }) {
  const { t } = useLanguage();
  const mood = exp.mood ? MOOD_CONFIG[exp.mood] : null;
  const moodLabel = exp.mood ? (t.experiences.moods as Record<string, string>)[exp.mood] ?? exp.mood : null;
  const tags = exp.tags ? exp.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
  const minutes = readingTime(exp.content);

  return (
    <article className="group relative rounded-3xl overflow-hidden shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300">
      {/* Background */}
      <div className="relative h-[420px] sm:h-[480px]">
        {exp.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exp.coverImage}
            alt={exp.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
            <Globe className="h-24 w-24 text-slate-600 opacity-20" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tracking-wide">
            {t.experiences.featured}
          </span>
          <div className="flex items-center gap-2 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity">
            <Link
              href={`/experiences/${exp.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-colors shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(exp.id); }}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content overlay */}
        <Link href={`/experiences/${exp.id}`} className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary-300" />
              {exp.destination}
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
              <Clock className="h-3 w-3" />
              {minutes} {t.experiences.readMin}
            </span>
            {mood && (
              <>
                <span className="text-white/30">·</span>
                <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border", mood.bg, mood.text, mood.border)}>
                  {mood.emoji} {moodLabel}
                </span>
              </>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-2 drop-shadow-sm">
            {exp.title}
          </h2>

          {exp.excerpt && (
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-3 max-w-2xl">
              {exp.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StarRating rating={exp.rating} />
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs font-medium text-white/50 hidden sm:block">#{tag}</span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/25 transition-colors">
              Ler relato →
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
}

function ExperienceCard({ exp, onDelete }: { exp: Experience; onDelete: (id: string) => void }) {
  const { t } = useLanguage();
  const mood = exp.mood ? MOOD_CONFIG[exp.mood] : null;
  const moodLabel = exp.mood ? (t.experiences.moods as Record<string, string>)[exp.mood] ?? exp.mood : null;
  const tags = exp.tags ? exp.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
  const excerpt = exp.excerpt || exp.content.slice(0, 100) + (exp.content.length > 100 ? "…" : "");
  const minutes = readingTime(exp.content);

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col hover:-translate-y-0.5">
      {/* Cover */}
      <Link href={`/experiences/${exp.id}`} className="block shrink-0">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {exp.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exp.coverImage}
              alt={exp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Globe className="h-14 w-14 text-slate-600 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

          {/* Mood badge */}
          {mood && (
            <div className="absolute top-3 left-3">
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm", mood.bg, mood.text, mood.border)}>
                {mood.emoji} {moodLabel}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity">
            <Link
              href={`/experiences/${exp.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(exp.id); }}
              className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3">
            <StarRating rating={exp.rating} />
          </div>

          {/* Reading time */}
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center gap-1 text-white/60 text-[10px] font-medium">
              <Clock className="h-3 w-3" /> {minutes} min
            </span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <Link href={`/experiences/${exp.id}`} className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 text-primary-400 shrink-0" />
          <span className="font-semibold text-gray-600 truncate">{exp.destination}</span>
          <span className="ml-auto shrink-0 text-[10px] text-gray-500 tabular-nums">{exp.tripDate}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {exp.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-50">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-gray-500 leading-none self-center">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}

export default function ExperiencesPage() {
  const { t } = useLanguage();
  const MOOD_FILTERS = [
    { value: "ALL", label: t.experiences.filterAll },
    ...Object.entries(MOOD_CONFIG).map(([k, v]) => ({
      value: k,
      label: `${v.emoji} ${(t.experiences.moods as Record<string, string>)[k] ?? k}`,
    })),
  ];
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("ALL");

  async function load() {
    const r = await fetch("/api/experiences");
    if (r.ok) setExperiences(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!(await confirmDialog("Excluir esta experiência?"))) return;
    await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  }

  const filtered = useMemo(() => {
    let result = experiences;
    if (moodFilter !== "ALL") result = result.filter((e) => e.mood === moodFilter);
    const q = search.toLowerCase().trim();
    if (q) result = result.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.destination.toLowerCase().includes(q) ||
      (e.tags ?? "").toLowerCase().includes(q)
    );
    return result;
  }, [experiences, search, moodFilter]);

  const [featured, ...rest] = filtered;

  const totalMinutes = experiences.reduce((s, e) => s + readingTime(e.content), 0);

  return (
    <div className="space-y-8 pb-12">

      {/* ── Hero header ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0c1628 0%, #1a2e52 50%, #1e1040 100%)" }}
      >
        {/* Noise/grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.18) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 85% 40%, rgba(20,184,166,0.12) 0%, transparent 55%)" }} />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-primary-400 text-[11px] font-black tracking-[0.2em] uppercase mb-3">Diário de Bordo</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-2">
                Minhas <span style={{ background: "linear-gradient(90deg,#818cf8,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Experiências</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Documente suas aventuras, guarde memórias e inspire outras pessoas com seus relatos de viagem.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {experiences.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-2xl font-black text-white leading-none">{experiences.length}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">relato{experiences.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-2xl font-black text-white leading-none">{totalMinutes}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">{t.experiences.readMin}</p>
                  </div>
                </div>
              )}
              <Button onClick={() => router.push("/experiences/new")} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" /> {t.experiences.newExperience}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      {experiences.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar relatos..."
              className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15"
            />
          </div>

          {/* Mood filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-px" style={{ scrollbarWidth: "none" }}>
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            {MOOD_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setMoodFilter(f.value)}
                className={cn(
                  "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  moodFilter === f.value
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gray-100 h-[420px] skeleton" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-64 skeleton" />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && experiences.length === 0 && (
        <div className="text-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <BookOpen className="h-9 w-9 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t.experiences.noExperiences}</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            {t.experiences.noExperiencesDesc}
          </p>
          <Button onClick={() => router.push("/experiences/new")} className="gap-2">
            <Plus className="h-4 w-4" /> {t.experiences.newExperience}
          </Button>
        </div>
      )}

      {/* ── No results ── */}
      {!loading && experiences.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-gray-600">Nenhum resultado encontrado</p>
          <p className="text-sm mt-1">Tente outros termos ou remova os filtros.</p>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-6">
          {/* Results count when filtered */}
          {(search || moodFilter !== "ALL") && (
            <p className="text-sm text-gray-500">
              {filtered.length} relato{filtered.length !== 1 ? "s" : ""}
              {search ? ` para "${search}"` : ""}
              {moodFilter !== "ALL" && ` · ${(t.experiences.moods as Record<string, string>)[moodFilter] ?? moodFilter}`}
            </p>
          )}

          {/* Featured card (first result) */}
          <FeaturedCard exp={featured} onDelete={handleDelete} />

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
