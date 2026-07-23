"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationInput } from "@/components/ui/location-input";
import { UpgradeNotice } from "@/components/plan/upgrade-notice";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: "AMAZING",     emoji: "✨", label: "Incrível"    },
  { value: "GREAT",       emoji: "😃", label: "Ótima"       },
  { value: "GOOD",        emoji: "😊", label: "Boa"         },
  { value: "MIXED",       emoji: "🤔", label: "Mista"       },
  { value: "CHALLENGING", emoji: "💪", label: "Desafiadora" },
];

const COVER_PRESETS = [
  { label: "Montanhas", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { label: "Praia", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { label: "Cidade", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" },
  { label: "Floresta", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
  { label: "Deserto", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80" },
  { label: "Neve", url: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80" },
  { label: "Templo", url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80" },
  { label: "Mercado", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
  { label: "Estrada", url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" },
  { label: "Porto", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80" },
  { label: "Ruins", url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80" },
  { label: "Aurora", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80" },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(value === s ? 0 : s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
        >
          <Star className={cn(
            "h-6 w-6 transition-colors",
            s <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-gray-200"
          )} />
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-gray-500 ml-1">{value}/5</span>
      )}
    </div>
  );
}

function NewExperienceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDest = searchParams.get("destination") ?? "";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [planLimit, setPlanLimit] = useState(false);
  const [coverMode, setCoverMode] = useState<"preset" | "url">("preset");

  const [form, setForm] = useState({
    title: "",
    destination: initialDest,
    tripDate: "",
    coverImage: "",
    excerpt: "",
    content: "",
    rating: 0,
    mood: "",
    tags: "",
  });

  function set(field: string, value: string | number) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.destination || !form.tripDate || !form.content) {
      setError("Preencha os campos obrigatórios: título, destino, período e conteúdo.");
      return;
    }
    setSaving(true);
    setError("");

    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: form.rating || null }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      router.push(`/experiences/${data.id}`);
    } else {
      // Usa a mensagem do servidor: com "Erro ao salvar" genérico, o bloqueio de
      // plano parecia falha do sistema em vez de recurso Premium.
      setPlanLimit(data.code === "PLAN_LIMIT");
      setError(data.error ?? "Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/experiences" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Novo Relato</h1>
          <p className="text-sm text-gray-500">Compartilhe sua experiência de viagem</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic info */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Informações básicas</h2>

          <div className="space-y-1.5">
            <Label>Título do relato *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Três semanas pelo sul da Itália"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Destino principal *</Label>
              <LocationInput
                value={form.destination}
                onChange={(val) => set("destination", val)}
                placeholder="Ex: Roma, Itália"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Período da viagem *</Label>
              <Input
                value={form.tripDate}
                onChange={(e) => set("tripDate", e.target.value)}
                placeholder="Ex: Julho 2025 · 18 dias"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Resumo (opcional)</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Uma frase que descreve essa experiência..."
              rows={2}
            />
          </div>
        </section>

        {/* Cover image */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Foto de Capa
            </h2>
            <div className="flex gap-1 text-xs">
              {(["preset", "url"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCoverMode(m)}
                  className={cn(
                    "px-3 py-1 rounded-lg font-medium transition-colors",
                    coverMode === m
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {m === "preset" ? "Fotos prontas" : "URL própria"}
                </button>
              ))}
            </div>
          </div>

          {coverMode === "preset" ? (
            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => set("coverImage", form.coverImage === p.url ? "" : p.url)}
                  className={cn(
                    "relative rounded-xl overflow-hidden h-16 border-2 transition-all",
                    form.coverImage === p.url
                      ? "border-primary-500 ring-2 ring-primary-400/30"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                    <span className="text-white text-[9px] font-semibold">{p.label}</span>
                  </div>
                  {form.coverImage === p.url && (
                    <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <Input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://..."
            />
          )}

          {form.coverImage && (
            <div className="relative rounded-xl overflow-hidden h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImage}
                alt="Capa"
                className="w-full h-full object-cover"
                onError={() => set("coverImage", "")}
              />
              <button
                type="button"
                onClick={() => set("coverImage", "")}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* Content */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Seu Relato *</h2>
          <Textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Conte sua história... O que você viveu, sentiu, descobriu? Quais foram os melhores e piores momentos? Dicas para quem quiser ir? Escreva à vontade."
            className="min-h-[300px] leading-relaxed"
            required
          />
          <p className="text-xs text-gray-500">{form.content.length} caracteres</p>
        </section>

        {/* Mood, Rating, Tags */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Avaliação</h2>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Como foi essa viagem?</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => set("mood", form.mood === m.value ? "" : m.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all",
                    form.mood === m.value
                      ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span>{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Nota geral</Label>
            <StarPicker value={form.rating} onChange={(v) => set("rating", v)} />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags (separadas por vírgula)</Label>
            <Input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Ex: gastronomia, cultura, família, mochilão"
            />
            {form.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {error && (
          planLimit
            ? <UpgradeNotice message={error} />
            : <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link href="/experiences">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={saving} className="gap-2 min-w-[140px]">
            {saving ? "Publicando..." : "Publicar Relato"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewExperiencePage() {
  return (
    <Suspense>
      <NewExperienceForm />
    </Suspense>
  );
}
