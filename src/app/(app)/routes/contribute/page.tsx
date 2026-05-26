"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Image as ImageIcon, X,
  MapPin, Clock, Wallet, Tag, Star, CalendarDays,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { LocationInput } from "@/components/ui/location-input";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────

const CONTINENTS = ["Europa", "Ásia", "Américas", "Oriente Médio", "África", "Oceania", "Outros"];

const CURRENCIES = [
  { code: "BRL", label: "🇧🇷 BRL — Real" },
  { code: "USD", label: "🇺🇸 USD — Dólar" },
  { code: "EUR", label: "🇪🇺 EUR — Euro" },
  { code: "GBP", label: "🇬🇧 GBP — Libra" },
  { code: "JPY", label: "🇯🇵 JPY — Iene" },
  { code: "ARS", label: "🇦🇷 ARS — Peso" },
  { code: "AED", label: "🇦🇪 AED — Dirham" },
];

const COVER_PRESETS = [
  { label: "Paris",    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
  { label: "Tokyo",   url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80" },
  { label: "Roma",    url: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80" },
  { label: "Praia",   url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { label: "Montanhas",url:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { label: "Dubai",   url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
  { label: "Bali",    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { label: "Floresta",url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
  { label: "Deserto", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80" },
  { label: "Neve",    url: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80" },
  { label: "Lisboa",  url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
  { label: "NYC",     url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80" },
];

const ACTIVITY_TYPES = [
  { value: "ACTIVITY",      label: "⚡ Atividade" },
  { value: "MEAL",          label: "🍽️ Refeição" },
  { value: "TRANSPORT",     label: "🚌 Transporte" },
  { value: "ACCOMMODATION", label: "🏨 Hospedagem" },
  { value: "EVENT",         label: "🎭 Evento" },
  { value: "OTHER",         label: "📝 Outro" },
];

// ── Types ────────────────────────────────────────────────────

interface ActivityForm {
  _key: string;
  title: string;
  type: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  cost: string;
}

function emptyActivity(): ActivityForm {
  return { _key: crypto.randomUUID(), title: "", type: "ACTIVITY", day: "1", startTime: "", endTime: "", location: "", description: "", cost: "" };
}

// ── Section wrapper ──────────────────────────────────────────

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gray-50/60">
        <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-primary-600" />
        </div>
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function ContributeRoutePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coverMode, setCoverMode] = useState<"preset" | "url">("preset");

  // basic info
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("Europa");
  const [flag, setFlag] = useState("📍");
  const [duration, setDuration] = useState("");
  const [authorName, setAuthorName] = useState("");

  // cover
  const [coverImage, setCoverImage] = useState("");

  // content
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [tags, setTags] = useState("");

  // budget
  const [currency, setCurrency] = useState("BRL");
  const [estimatedBudget, setEstimatedBudget] = useState("");

  // activities
  const [activities, setActivities] = useState<ActivityForm[]>([emptyActivity()]);

  function handleLocationChange(val: string, _validated: boolean) {
    setDestination(val);
    // Try to extract country from "City, Country" format
    const parts = val.split(",");
    if (parts.length >= 2) setCountry(parts[parts.length - 1].trim());
  }

  // highlights management
  function setHighlight(i: number, v: string) {
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? v : h)));
  }
  function addHighlight() {
    setHighlights((prev) => [...prev, ""]);
  }
  function removeHighlight(i: number) {
    setHighlights((prev) => prev.filter((_, idx) => idx !== i));
  }

  // activities management
  function updateActivity(key: string, field: keyof ActivityForm, value: string) {
    setActivities((prev) => prev.map((a) => a._key === key ? { ...a, [field]: value } : a));
  }
  function addActivity() {
    setActivities((prev) => [...prev, emptyActivity()]);
  }
  function removeActivity(key: string) {
    setActivities((prev) => prev.filter((a) => a._key !== key));
  }

  // unique sorted days for display
  const dayGroups = [...new Set(activities.map((a) => Number(a.day)))].sort((a, b) => a - b);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validHighlights = highlights.filter((h) => h.trim());
    const validActivities = activities.filter((a) => a.title.trim() && a.day);

    if (!destination.trim()) { setError("Informe o destino da viagem."); return; }
    if (!duration || isNaN(Number(duration)) || Number(duration) < 1) { setError("Informe a duração em dias (mínimo 1)."); return; }
    if (!description.trim() || description.trim().length < 50) { setError("A descrição precisa ter pelo menos 50 caracteres."); return; }
    if (validHighlights.length < 2) { setError("Adicione pelo menos 2 destaques do roteiro."); return; }
    if (validActivities.length < 3) { setError("Adicione pelo menos 3 atividades ao roteiro."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/community-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, destination, country, continent, flag,
          duration: Number(duration),
          coverImage: coverImage || null,
          description,
          highlights: validHighlights,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          currency, estimatedBudget,
          authorName,
          activities: validActivities.map((a) => ({
            title: a.title,
            type: a.type,
            day: Number(a.day),
            startTime: a.startTime || null,
            endTime: a.endTime || null,
            location: a.location || null,
            description: a.description || null,
            cost: a.cost ? Number(a.cost) : null,
          })),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erro ao publicar roteiro.");
      } else {
        router.push("/routes?tab=community");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setSaving(false);
  }

  const completionItems = [
    { label: "Título",       done: title.trim().length > 3 },
    { label: "Destino",      done: destination.trim().length > 2 },
    { label: "Duração",      done: !!duration && Number(duration) > 0 },
    { label: "Descrição",    done: description.trim().length >= 50 },
    { label: "Destaques",    done: highlights.filter((h) => h.trim()).length >= 2 },
    { label: "Atividades",   done: activities.filter((a) => a.title.trim()).length >= 3 },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/routes" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">Contribuir com um Roteiro</h1>
          <p className="text-sm text-gray-500 mt-0.5">Compartilhe sua experiência com a comunidade de viajantes</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">Progresso do roteiro</p>
          <span className={cn("text-sm font-black", completionPct === 100 ? "text-green-600" : "text-primary-600")}>
            {completionPct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            className={cn("h-2 rounded-full transition-all duration-500", completionPct === 100 ? "bg-green-500" : "bg-primary-500")}
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {completionItems.map((item) => (
            <span key={item.label} className={cn(
              "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium",
              item.done ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"
            )}>
              {item.done ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1 — Informações básicas */}
        <Section icon={MapPin} title="Informações básicas">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Título do roteiro *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: 7 dias incríveis em Lisboa" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Destino principal *</Label>
                <LocationInput value={destination} onChange={handleLocationChange} placeholder="Ex: Lisboa, Portugal" required />
              </div>
              <div className="space-y-1.5">
                <Label>Continente *</Label>
                <Select value={continent} onChange={(e) => setContinent(e.target.value)}>
                  {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Duração (dias) *</Label>
                <Input type="number" min="1" max="90" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ex: 7" required />
              </div>
              <div className="space-y-1.5">
                <Label>Flag / Emoji do país</Label>
                <Input value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="🇵🇹" maxLength={4} />
              </div>
              <div className="space-y-1.5">
                <Label>Seu nome (opcional)</Label>
                <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Como quer ser identificado" />
              </div>
            </div>
          </div>
        </Section>

        {/* 2 — Foto de capa */}
        <Section icon={ImageIcon} title="Foto de capa">
          <div className="space-y-4">
            <div className="flex gap-2 text-xs">
              {(["preset", "url"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setCoverMode(m)}
                  className={cn("px-3 py-1.5 rounded-lg font-semibold transition-colors", coverMode === m ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                  {m === "preset" ? "Fotos prontas" : "URL personalizada"}
                </button>
              ))}
            </div>

            {coverMode === "preset" ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {COVER_PRESETS.map((p) => (
                  <button key={p.url} type="button" onClick={() => setCoverImage(coverImage === p.url ? "" : p.url)}
                    className={cn("relative rounded-xl overflow-hidden h-16 border-2 transition-all", coverImage === p.url ? "border-primary-500 ring-2 ring-primary-400/30" : "border-transparent hover:border-gray-300")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                      <span className="text-white text-[8px] font-semibold leading-tight">{p.label}</span>
                    </div>
                    {coverImage === p.url && (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            )}

            {coverImage && (
              <div className="relative rounded-xl overflow-hidden h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Capa" className="w-full h-full object-cover" onError={() => setCoverImage("")} />
                <button type="button" onClick={() => setCoverImage("")} className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* 3 — Descrição e destaques */}
        <Section icon={Star} title="Descrição e destaques">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>Descrição do roteiro * <span className="text-gray-400 font-normal">(mín. 50 caracteres)</span></Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Descreva o que torna esse roteiro especial: pontos altos, estilo de viagem, público ideal..." required />
              <p className={cn("text-xs", description.length >= 50 ? "text-green-600" : "text-gray-400")}>
                {description.length} caracteres {description.length < 50 && `(${50 - description.length} para o mínimo)`}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Destaques do roteiro * <span className="text-gray-400 font-normal">(mín. 2)</span></Label>
              <div className="space-y-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex items-center justify-center w-6 h-10 shrink-0">
                      <CheckCircle2 className={cn("h-4 w-4", h.trim() ? "text-green-500" : "text-gray-200")} />
                    </div>
                    <Input value={h} onChange={(e) => setHighlight(i, e.target.value)} placeholder={`Destaque ${i + 1} — ex: Vista panorâmica do Castelo de São Jorge`} className="flex-1" />
                    {highlights.length > 1 && (
                      <button type="button" onClick={() => removeHighlight(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Adicionar destaque
              </Button>
            </div>
          </div>
        </Section>

        {/* 4 — Tags e orçamento */}
        <Section icon={Wallet} title="Tags e orçamento">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ex: cultura, gastronomia, família, aventura (separadas por vírgula)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Moeda</Label>
                <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Orçamento estimado</Label>
                <Input value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)} placeholder="Ex: €800 – €1.500 por pessoa" />
              </div>
            </div>
          </div>
        </Section>

        {/* 5 — Atividades */}
        <Section icon={CalendarDays} title={`Atividades do roteiro * — ${activities.filter((a) => a.title.trim()).length} adicionadas (mín. 3)`}>
          <div className="space-y-6">
            {dayGroups.map((day) => {
              const dayActs = activities.filter((a) => Number(a.day) === day);
              return (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white shrink-0">
                      <span className="text-xs font-black">{day}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">Dia {day}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="space-y-3 pl-11">
                    {dayActs.map((act) => (
                      <div key={act._key} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <Label className="text-xs">Título da atividade *</Label>
                            <Input value={act.title} onChange={(e) => updateActivity(act._key, "title", e.target.value)} placeholder="Ex: Visita ao Museu Nacional" required />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tipo</Label>
                            <Select value={act.type} onChange={(e) => updateActivity(act._key, "type", e.target.value)}>
                              {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Início</Label>
                            <Input type="time" value={act.startTime} onChange={(e) => updateActivity(act._key, "startTime", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Fim</Label>
                            <Input type="time" value={act.endTime} onChange={(e) => updateActivity(act._key, "endTime", e.target.value)} />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> Local</Label>
                            <Input value={act.location} onChange={(e) => updateActivity(act._key, "location", e.target.value)} placeholder="Nome do local" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <Label className="text-xs">Descrição</Label>
                            <Input value={act.description} onChange={(e) => updateActivity(act._key, "description", e.target.value)} placeholder="Detalhes ou dicas sobre a atividade" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Custo estimado</Label>
                            <CurrencyInput value={act.cost} onChange={(raw) => updateActivity(act._key, "cost", raw)} />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button type="button" onClick={() => removeActivity(act._key)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Remover atividade
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add activity */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button type="button" variant="outline" onClick={addActivity} className="gap-2">
                <Plus className="h-4 w-4" /> Adicionar atividade
              </Button>
              {activities.length > 0 && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-500 whitespace-nowrap">Ao dia:</Label>
                  <Select
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const day = e.target.value;
                      setActivities((prev) => [...prev, { ...emptyActivity(), day }]);
                    }}
                    className="text-xs h-8 w-24"
                  >
                    <option value="">Dia...</option>
                    {Array.from({ length: Math.max(Number(duration) || 7, dayGroups.length + 1) }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={String(d)}>Dia {d}</option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/routes">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={saving || completionPct < 100} className="min-w-[180px] gap-2">
            {saving ? "Publicando..." : "Publicar roteiro"}
          </Button>
        </div>

        {completionPct < 100 && (
          <p className="text-xs text-center text-gray-400">
            Complete todos os requisitos acima para publicar o roteiro
          </p>
        )}
      </form>
    </div>
  );
}
