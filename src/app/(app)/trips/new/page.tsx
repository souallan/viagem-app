"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Plus, X, MapPin, ArrowRight,
  Route, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/location-input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTemplateById } from "@/lib/route-templates";
import { cn } from "@/lib/utils";

const POPULAR_DESTINATIONS = [
  { label: "Paris, França", flag: "🇫🇷" },
  { label: "Tokyo, Japão", flag: "🇯🇵" },
  { label: "Roma, Itália", flag: "🇮🇹" },
  { label: "Lisboa, Portugal", flag: "🇵🇹" },
  { label: "Barcelona, Espanha", flag: "🇪🇸" },
  { label: "Nova York, EUA", flag: "🇺🇸" },
  { label: "Dubai, EAU", flag: "🇦🇪" },
  { label: "Bali, Indonésia", flag: "🇮🇩" },
  { label: "Amsterdam, Holanda", flag: "🇳🇱" },
  { label: "Tóquio, Japão", flag: "🇯🇵" },
  { label: "Buenos Aires, Argentina", flag: "🇦🇷" },
  { label: "Cidade do Cabo, África do Sul", flag: "🇿🇦" },
];

const COUNTRY_FLAGS: Record<string, string> = {
  "brasil": "🇧🇷", "france": "🇫🇷", "frança": "🇫🇷", "paris": "🇫🇷",
  "japan": "🇯🇵", "japão": "🇯🇵", "tokyo": "🇯🇵", "tóquio": "🇯🇵", "osaka": "🇯🇵",
  "italy": "🇮🇹", "itália": "🇮🇹", "roma": "🇮🇹", "rome": "🇮🇹", "veneza": "🇮🇹",
  "spain": "🇪🇸", "espanha": "🇪🇸", "barcelona": "🇪🇸", "madri": "🇪🇸",
  "portugal": "🇵🇹", "lisboa": "🇵🇹", "porto": "🇵🇹",
  "germany": "🇩🇪", "alemanha": "🇩🇪", "berlin": "🇩🇪",
  "usa": "🇺🇸", "eua": "🇺🇸", "nova york": "🇺🇸", "miami": "🇺🇸", "orlando": "🇺🇸",
  "uk": "🇬🇧", "reino unido": "🇬🇧", "london": "🇬🇧", "londres": "🇬🇧",
  "dubai": "🇦🇪", "eau": "🇦🇪",
  "bali": "🇮🇩", "indonésia": "🇮🇩",
  "amsterdam": "🇳🇱", "holanda": "🇳🇱", "netherlands": "🇳🇱",
  "grécia": "🇬🇷", "greece": "🇬🇷", "atenas": "🇬🇷", "santorini": "🇬🇷",
  "argentina": "🇦🇷", "buenos aires": "🇦🇷",
  "méxico": "🇲🇽", "cancún": "🇲🇽",
  "tailândia": "🇹🇭", "bangkok": "🇹🇭", "phuket": "🇹🇭",
  "suíça": "🇨🇭", "zurique": "🇨🇭",
  "áustria": "🇦🇹", "viena": "🇦🇹",
  "austrália": "🇦🇺", "sydney": "🇦🇺",
  "canadá": "🇨🇦", "toronto": "🇨🇦",
  "china": "🇨🇳", "pequim": "🇨🇳", "xangai": "🇨🇳",
  "coreia": "🇰🇷", "seoul": "🇰🇷", "seul": "🇰🇷",
  "marrocos": "🇲🇦", "marrakech": "🇲🇦",
};

function guessFlag(destination: string): string {
  const lower = destination.toLowerCase();
  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (lower.includes(key)) return flag;
  }
  return "📍";
}

function DestinationBuilder({
  destinations,
  onChange,
}: {
  destinations: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [inputValidated, setInputValidated] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function add() {
    const val = input.trim();
    if (!val) return;
    onChange([...destinations, val]);
    setInput("");
    setInputValidated(false);
  }

  function remove(i: number) {
    onChange(destinations.filter((_, idx) => idx !== i));
  }

  function addPopular(label: string) {
    if (destinations.includes(label)) return;
    onChange([...destinations, label]);
  }

  function handleDragStart(i: number) {
    setDragIdx(i);
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDragOverIdx(i);
  }

  function handleDrop(i: number) {
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...destinations];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onChange(next);
    setDragIdx(null);
    setDragOverIdx(null);
  }

  const showPopular = destinations.length === 0;

  return (
    <div className="space-y-3">
      <Label>
        Destinos *
        {destinations.length > 1 && (
          <span className="ml-2 text-xs font-normal text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-2 py-0.5">
            <Route className="inline h-3 w-3 mr-1" />
            Roteiro multi-destino
          </span>
        )}
      </Label>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <LocationInput
            value={input}
            onChange={(val, validated) => { setInput(val); setInputValidated(validated); }}
            placeholder="Ex: Paris, França"
          />
          {input.trim() && !inputValidated && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              ⚠ Selecione uma sugestão para validar o destino
            </p>
          )}
        </div>
        <Button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="shrink-0 gap-1.5 self-start"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar
        </Button>
      </div>

      {/* Destination list */}
      {destinations.length > 0 && (
        <div className="space-y-2">
          {destinations.map((dest, i) => (
            <div
              key={dest + i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all cursor-grab active:cursor-grabbing",
                dragOverIdx === i && dragIdx !== i
                  ? "border-sky-400 bg-sky-50 shadow-md"
                  : i === 0
                  ? "bg-gradient-to-r from-sky-50 to-teal-50 border-sky-200"
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Drag handle */}
              <GripVertical className="h-4 w-4 text-gray-300 shrink-0" aria-hidden="true" />

              {/* Step number */}
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                i === 0 ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {i + 1}
              </div>

              {/* Flag + name */}
              <span className="text-base leading-none" aria-hidden="true">{guessFlag(dest)}</span>
              <span className={cn("flex-1 text-sm font-medium", i === 0 ? "text-gray-900" : "text-gray-700")}>
                {dest}
              </span>

              {/* Connector arrow (between stops) */}
              {i < destinations.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0" aria-hidden="true" />
              )}

              {/* Badge: primary */}
              {i === 0 && (
                <span className="text-xs text-sky-600 font-medium shrink-0">Principal</span>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-1"
                aria-label={`Remover ${dest}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {destinations.length > 1 && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5 pl-1">
              <GripVertical className="h-3 w-3" aria-hidden="true" />
              Arraste para reordenar · O primeiro destino é usado para previsão do tempo
            </p>
          )}
        </div>
      )}

      {/* Visual route summary */}
      {destinations.length > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1 py-2 bg-gray-50 rounded-lg border border-gray-100">
          {destinations.map((dest, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-sm" aria-hidden="true">{guessFlag(dest)}</span>
              <span className="text-xs font-medium text-gray-700">{dest.split(",")[0]}</span>
              {i < destinations.length - 1 && (
                <ArrowRight className="h-3 w-3 text-gray-400" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      )}

      {/* Popular suggestions */}
      {showPopular && (
        <div>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Destinos populares
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_DESTINATIONS.map(({ label, flag }) => (
              <button
                key={label}
                type="button"
                onClick={() => addPopular(label)}
                className="inline-flex items-center gap-1 text-xs bg-gray-50 hover:bg-sky-50 hover:text-sky-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors border border-gray-200 hover:border-sky-200"
              >
                <span aria-hidden="true">{flag}</span>
                {label.split(",")[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {destinations.length > 0 && destinations.length < 8 && (
        <p className="text-xs text-gray-400">
          Pode adicionar mais destinos para criar um roteiro multi-cidade.
        </p>
      )}
    </div>
  );
}

interface CommunityActivity {
  id: string;
  title: string;
  type: string;
  day: number;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  cost: number | null;
}

interface CommunityRouteData {
  id: string;
  title: string;
  destination: string;
  description: string;
  currency: string;
  coverImage: string | null;
  flag: string;
  duration: number;
  estimatedBudget: string;
  highlights: string;
  activities: CommunityActivity[];
  authorName: string;
}

function NewTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const communityId = searchParams.get("community");
  const template = templateId ? getTemplateById(templateId) : undefined;

  const [loading, setLoading] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);
  const [templateProgress, setTemplateProgress] = useState(0);
  const [error, setError] = useState("");
  const [communityRoute, setCommunityRoute] = useState<CommunityRouteData | null>(null);

  const [destinations, setDestinations] = useState<string[]>(
    template?.destination ? [template.destination] : []
  );

  const [form, setForm] = useState({
    title: (template?.title ?? "").toUpperCase(),
    description: template?.description ?? "",
    startDate: "",
    endDate: "",
    currency: template?.currency ?? "BRL",
    budget: "",
    status: "PLANNING",
  });

  useEffect(() => {
    if (template) {
      setForm((prev) => ({
        ...prev,
        title: template.title.toUpperCase(),
        currency: template.currency,
        description: template.description,
      }));
      setDestinations([template.destination]);
    }
  }, [template]);

  useEffect(() => {
    if (!communityId) return;
    fetch(`/api/community-routes/${communityId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: CommunityRouteData | null) => {
        if (!data) return;
        setCommunityRoute(data);
        setForm((prev) => ({
          ...prev,
          title: data.title.toUpperCase(),
          currency: data.currency,
          description: data.description,
        }));
        setDestinations([data.destination]);
      });
  }, [communityId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const value = e.target.name === "title" ? e.target.value.toUpperCase() : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  }

  const applyActivitiesToTrip = useCallback(
    async (
      tripId: string,
      tripStartDate: string,
      activities: Array<{ title: string; type: string; day: number; startTime?: string | null; endTime?: string | null; location?: string | null; address?: string | null; description?: string | null; cost?: number | null }>
    ) => {
      setApplyingTemplate(true);
      const base = tripStartDate ? new Date(tripStartDate) : new Date();
      const total = activities.length;
      for (let i = 0; i < total; i++) {
        const act = activities[i];
        const actDate = new Date(base);
        actDate.setDate(actDate.getDate() + (act.day - 1));
        try {
          await fetch(`/api/trips/${tripId}/activities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: act.title,
              type: act.type,
              date: actDate.toISOString(),
              startTime: act.startTime ?? null,
              endTime: act.endTime ?? null,
              location: act.location ?? null,
              address: act.address ?? null,
              description: act.description ?? null,
              cost: act.cost ?? null,
            }),
          });
        } catch {
          // Continue even if one activity fails
        }
        setTemplateProgress(Math.round(((i + 1) / total) * 100));
      }
      setApplyingTemplate(false);
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (destinations.length === 0) {
      setError("Adicione pelo menos um destino.");
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("A data de volta não pode ser anterior à data de ida.");
      return;
    }
    setError("");
    setLoading(true);

    const destinationValue = destinations.join(" → ");

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          destination: destinationValue,
          // Include template cover image if no custom image was set
          coverImage: template?.coverImage ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar viagem");
        setLoading(false);
        return;
      }

      if (template) {
        await applyActivitiesToTrip(data.id, form.startDate, template.activities);
        router.push(`/trips/${data.id}/itinerary`);
      } else if (communityRoute) {
        await applyActivitiesToTrip(data.id, form.startDate, communityRoute.activities);
        router.push(`/trips/${data.id}/itinerary`);
      } else {
        router.push(`/trips/${data.id}`);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  const activeSource = template ?? communityRoute;
  const activityCount = template?.activities.length ?? communityRoute?.activities.length ?? 0;

  if (applyingTemplate) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-4 animate-float" aria-hidden="true">✈️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aplicando roteiro...</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Estamos adicionando {activityCount} atividades à sua viagem.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-sky-500 to-teal-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${templateProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{templateProgress}% concluído</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={activeSource ? "/routes" : "/dashboard"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova viagem</h1>
          {template && (
            <p className="text-sm text-sky-600 mt-0.5">
              Usando roteiro: <span className="font-semibold">{template.title}</span>{" "}
              <span aria-hidden="true">{template.flag}</span>
            </p>
          )}
          {communityRoute && (
            <p className="text-sm text-violet-600 mt-0.5">
              Roteiro da comunidade: <span className="font-semibold">{communityRoute.title}</span>
            </p>
          )}
        </div>
      </div>

      {/* Template banner */}
      {template && (
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100">
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.coverImage}
              alt={template.destination}
              className="h-14 w-20 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg" aria-hidden="true">{template.flag}</span>
                <p className="font-semibold text-gray-900 text-sm">{template.title}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {template.destination} · {template.duration} dias
              </p>
              <p className="text-xs text-sky-700 mt-1">
                {template.activities.length} atividades serão adicionadas automaticamente
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Community route banner */}
      {communityRoute && (
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
          <div className="flex items-start gap-3">
            {communityRoute.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={communityRoute.coverImage}
                alt={communityRoute.destination}
                className="h-14 w-20 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="h-14 w-20 rounded-lg bg-violet-200 flex items-center justify-center text-2xl shrink-0">
                {communityRoute.flag || "🗺️"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg" aria-hidden="true">{communityRoute.flag || "📍"}</span>
                <p className="font-semibold text-gray-900 text-sm">{communityRoute.title}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {communityRoute.destination} · {communityRoute.duration} dias
              </p>
              <p className="text-xs text-violet-700 mt-1">
                {communityRoute.activities.length} atividades serão adicionadas automaticamente
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações da viagem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="title">Nome da viagem *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Férias na Europa 2025"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Destinos — multi-picker */}
            <DestinationBuilder
              destinations={destinations}
              onChange={setDestinations}
            />

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de ida</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      startDate: newStart,
                      endDate: prev.endDate && prev.endDate < newStart ? "" : prev.endDate,
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de volta</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Conte um pouco sobre essa viagem..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Template highlights */}
            {template && (
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">O que está incluído neste roteiro</p>
                <ul className="space-y-1">
                  {template.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-sky-500 mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 pt-1 border-t border-sky-100">
                  <span className="font-medium">Orçamento estimado:</span> {template.estimatedBudget} por pessoa · {template.activities.length} atividades planejadas
                </p>
              </div>
            )}

            {/* Community route highlights */}
            {communityRoute && (() => {
              const highlights: string[] = (() => { try { return JSON.parse(communityRoute.highlights); } catch { return []; } })();
              return highlights.length > 0 ? (
                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Destaques deste roteiro</p>
                  <ul className="space-y-1">
                    {highlights.map((h, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <span className="text-violet-500 mt-0.5">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                  {communityRoute.estimatedBudget && (
                    <p className="text-xs text-gray-500 pt-1 border-t border-violet-100">
                      <span className="font-medium">Orçamento estimado:</span> {communityRoute.estimatedBudget} · {communityRoute.activities.length} atividades planejadas
                    </p>
                  )}
                </div>
              ) : null;
            })()}

            {/* Moeda + Orçamento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda principal</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="BRL">🇧🇷 BRL — Real</option>
                  <option value="USD">🇺🇸 USD — Dólar</option>
                  <option value="EUR">🇪🇺 EUR — Euro</option>
                  <option value="GBP">🇬🇧 GBP — Libra</option>
                  <option value="JPY">🇯🇵 JPY — Iene</option>
                  <option value="ARS">🇦🇷 ARS — Peso Argentino</option>
                  <option value="AED">🇦🇪 AED — Dirham</option>
                  <option value="IDR">🇮🇩 IDR — Rupia</option>
                  <option value="CHF">🇨🇭 CHF — Franco Suíço</option>
                  <option value="MXN">🇲🇽 MXN — Peso Mexicano</option>
                  <option value="AUD">🇦🇺 AUD — Dólar Australiano</option>
                  <option value="THB">🇹🇭 THB — Baht</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento total</Label>
                <CurrencyInput
                  value={form.budget}
                  onChange={(raw) => setForm((p) => ({ ...p, budget: raw }))}
                  currency={form.currency}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PLANNING">📋 Planejando</option>
                <option value="CONFIRMED">✅ Confirmada</option>
                <option value="IN_PROGRESS">✈️ Em andamento</option>
                <option value="COMPLETED">🏁 Concluída</option>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-100">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Link href={template ? "/routes" : "/dashboard"} className="flex-1">
                <Button variant="outline" className="w-full" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || destinations.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Criando...
                  </>
                ) : (template || communityRoute) ? (
                  "Criar com roteiro"
                ) : (
                  "Criar viagem"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewTripPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-16 text-center text-gray-400">
          Carregando...
        </div>
      }
    >
      <NewTripForm />
    </Suspense>
  );
}
