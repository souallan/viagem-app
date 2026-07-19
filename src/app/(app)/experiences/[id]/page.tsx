"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Star, Calendar, Pencil, Trash2, Tag,
  Lightbulb, CheckCircle2, AlertCircle, Clock, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  publishedAsTip: boolean;
  createdAt: string;
}

const MOOD_CONFIG: Record<string, {
  emoji: string; label: string;
  bg: string; text: string; border: string;
  accent: string; gradient: string;
}> = {
  AMAZING:     { emoji: "✨", label: "Incrível",    bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", accent: "#7c3aed", gradient: "from-purple-600 to-violet-800"   },
  GREAT:       { emoji: "😃", label: "Ótima",       bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200",  accent: "#059669", gradient: "from-green-600 to-emerald-800"   },
  GOOD:        { emoji: "😊", label: "Boa",         bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   accent: "#2563eb", gradient: "from-blue-600 to-primary-800"       },
  MIXED:       { emoji: "🤔", label: "Mista",       bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200",  accent: "#d97706", gradient: "from-amber-500 to-orange-700"   },
  CHALLENGING: { emoji: "💪", label: "Desafiadora", bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200",    accent: "#dc2626", gradient: "from-red-600 to-rose-800"       },
};

const DEFAULT_ACCENT = "#1a56cc";
const DEFAULT_GRADIENT = "from-slate-800 to-indigo-900";

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function checkRequirements(exp: Experience) {
  return [
    { label: "Título preenchido",            ok: exp.title.length > 0       },
    { label: "Destino informado",            ok: exp.destination.length > 0  },
    { label: "Conteúdo com 200+ caracteres", ok: exp.content.length >= 200   },
    { label: "Foto de capa selecionada",     ok: !!exp.coverImage            },
  ];
}

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showPublishPanel, setShowPublishPanel] = useState(false);

  useEffect(() => {
    fetch(`/api/experiences/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setExp(data); setLoading(false); });
  }, [id]);

  async function handleDelete() {
    if (!(await confirmDialog("Excluir este relato? Esta ação não pode ser desfeita."))) return;
    await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    router.push("/experiences");
  }

  async function handleTogglePublish() {
    if (!exp) return;
    setPublishing(true);
    const res = await fetch(`/api/experiences/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishedAsTip: !exp.publishedAsTip }),
    });
    if (res.ok) {
      const updated = await res.json();
      setExp((prev) => prev ? { ...prev, publishedAsTip: updated.publishedAsTip } : prev);
    }
    setPublishing(false);
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse pb-16 space-y-4">
        <div className="h-[480px] rounded-3xl bg-gray-200" />
        <div className="max-w-2xl mx-auto space-y-3 px-4">
          <div className="h-6 bg-gray-200 rounded-xl w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-3 font-medium">Relato não encontrado.</p>
        <Link href="/experiences" className="text-primary-600 text-sm font-semibold hover:underline">
          ← Voltar para experiências
        </Link>
      </div>
    );
  }

  const mood       = exp.mood ? MOOD_CONFIG[exp.mood] : null;
  const accent     = mood?.accent     ?? DEFAULT_ACCENT;
  const gradient   = mood?.gradient   ?? DEFAULT_GRADIENT;
  const tags       = exp.tags ? exp.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const paragraphs = exp.content.split("\n").filter((p) => p.trim());
  const requirements = checkRequirements(exp);
  const allMet     = requirements.every((r) => r.ok);
  const minutes    = readingTime(exp.content);

  return (
    <div className="pb-24">

      {/* ══════════════════════════════════════
          HERO IMAGE
      ══════════════════════════════════════ */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ height: 460 }}
      >
        {exp.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exp.coverImage}
            alt={exp.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn("w-full h-full bg-gradient-to-br", gradient)} />
        )}

        {/* Multi-layer gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* ── Top action bar ── */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hover:bg-black/55 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Experiências
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPublishPanel((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all",
                exp.publishedAsTip
                  ? "bg-teal-500/35 text-teal-200 border-teal-400/40 hover:bg-teal-500/50"
                  : "bg-black/35 text-white/85 border-white/20 hover:bg-black/55"
              )}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {exp.publishedAsTip ? "Publicado" : "Publicar"}
            </button>
            <Link href={`/experiences/${id}/edit`}>
              <button className="w-9 h-9 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/55 transition-all">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="w-9 h-9 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-red-500/60 hover:border-red-400/50 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Hero bottom — title & meta ── */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 pt-16 z-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}>

          {/* Mood + destination row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-white/75 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5" style={{ color: accent }} />
              {exp.destination}
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5 text-white/60 text-xs">
              <Calendar className="h-3 w-3" />
              {exp.tripDate}
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5 text-white/60 text-xs">
              <Clock className="h-3 w-3" />
              {minutes} min
            </span>
            {mood && (
              <>
                <span className="text-white/30">·</span>
                <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border", mood.bg, mood.text, mood.border)}>
                  {mood.emoji} {mood.label}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-[2rem] font-black text-white leading-tight tracking-tight drop-shadow-lg mb-3 max-w-3xl">
            {exp.title}
          </h1>

          {/* Star rating */}
          {exp.rating && (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  className={cn("h-4 w-4 drop-shadow", s <= exp.rating! ? "fill-amber-400 text-amber-400" : "fill-white/15 text-white/15")}
                />
              ))}
              <span className="text-white/55 text-xs ml-1.5 font-medium tabular-nums">{exp.rating}.0 / 5.0</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FLOATING INFO STRIP
      ══════════════════════════════════════ */}
      <div className="relative z-10 mx-2 sm:mx-4 -mt-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
          />
          <div className="grid grid-cols-3 divide-x divide-gray-100 px-0 py-0">
            {[
              { icon: <MapPin className="h-4 w-4" style={{ color: accent }} />, label: "Destino",  value: exp.destination.split(",")[0] },
              { icon: <Calendar className="h-4 w-4 text-gray-400" />,           label: "Período",  value: exp.tripDate                  },
              { icon: <Clock className="h-4 w-4 text-gray-400" />,              label: "Leitura",  value: `${minutes} min`              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-4 px-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {icon} {label}
                </div>
                <p className="text-sm font-bold text-gray-900 text-center leading-tight truncate w-full text-center" title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          {exp.rating && (
            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avaliação</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn("h-4 w-4", s <= exp.rating! ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                ))}
                <span className="text-sm font-bold ml-1.5 tabular-nums" style={{ color: accent }}>{exp.rating}/5</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          PUBLISH PANEL
      ══════════════════════════════════════ */}
      {showPublishPanel && (
        <div className={cn(
          "mt-4 rounded-2xl border p-5 shadow-sm",
          exp.publishedAsTip ? "bg-teal-50 border-teal-200" : "bg-white border-gray-200"
        )}>
          <div className="flex items-start gap-3 mb-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", exp.publishedAsTip ? "bg-teal-100" : "bg-primary-50")}>
              <Lightbulb className={cn("h-5 w-5", exp.publishedAsTip ? "text-teal-600" : "text-primary-600")} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {exp.publishedAsTip ? "Sua experiência está visível nas Dicas" : "Publicar como Dica da Comunidade"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {exp.publishedAsTip
                  ? "Outros viajantes podem ler seu relato. Você pode despublicar a qualquer momento."
                  : "Compartilhe seu relato com outros viajantes na seção de Dicas."}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            {requirements.map((req) => (
              <div key={req.label} className="flex items-center gap-2 text-xs">
                {req.ok
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  : <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                <span className={req.ok ? "text-gray-600" : "text-amber-700 font-semibold"}>{req.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleTogglePublish}
              disabled={publishing || (!exp.publishedAsTip && !allMet)}
              className={cn("gap-1.5", exp.publishedAsTip ? "bg-red-500 hover:bg-red-600 text-white border-none" : "")}
            >
              {publishing ? "Salvando..." : exp.publishedAsTip ? "Despublicar" : allMet ? "Publicar nas Dicas" : "Requisitos não atendidos"}
            </Button>
            <button onClick={() => setShowPublishPanel(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
              Fechar
            </button>
          </div>
        </div>
      )}

      {exp.publishedAsTip && !showPublishPanel && (
        <div className="mt-4 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Este relato está publicado nas Dicas da Comunidade
        </div>
      )}

      {/* ══════════════════════════════════════
          ARTICLE BODY
      ══════════════════════════════════════ */}
      <div className="mt-8 max-w-2xl mx-auto">

        {/* Excerpt — pull quote */}
        {exp.excerpt && (
          <div
            className="relative mb-10 px-6 py-5 rounded-2xl overflow-hidden"
            style={{ background: `${accent}0d`, borderLeft: `4px solid ${accent}` }}
          >
            {/* Decorative large quotation mark */}
            <span
              className="absolute top-0 right-4 text-7xl font-black leading-none select-none pointer-events-none"
              style={{ color: `${accent}20` }}
            >
              "
            </span>
            <p
              className="text-base leading-relaxed font-semibold italic relative z-10"
              style={{ color: accent }}
            >
              {exp.excerpt}
            </p>
          </div>
        )}

        {/* Article content */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Thin accent bar at top */}
          <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

          <div className="px-6 sm:px-8 py-8 space-y-0">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={cn(
                  "text-gray-700 leading-[1.9] tracking-[0.012em] mb-5 last:mb-0",
                  i === 0
                    ? "text-[16px] first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none"
                    : "text-[15px]"
                )}
                style={i === 0 ? { ["--tw-first-letter-color" as string]: accent } : undefined}
              >
                {i === 0 ? (
                  <>
                    <span
                      className="float-left text-5xl font-black leading-none mr-2 mt-1"
                      style={{ color: accent }}
                    >
                      {para[0]}
                    </span>
                    {para.slice(1)}
                  </>
                ) : para}
              </p>
            ))}
          </div>

          {/* ── Tags ── */}
          {tags.length > 0 && (
            <div className="px-6 sm:px-8 pb-7 pt-2 border-t border-gray-50 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      background: `${accent}10`,
                      color: accent,
                      borderColor: `${accent}30`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Article footer ── */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <BookOpen className="h-3.5 w-3.5" />
              Publicado em {new Date(exp.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/experiences/${id}/edit`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors bg-white"
              >
                <Pencil className="h-3 w-3" /> Editar
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                style={{ background: accent }}
              >
                Ver todos os relatos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
