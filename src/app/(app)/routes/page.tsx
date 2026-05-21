"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, MapPin, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { ROUTE_TEMPLATES, RouteTemplate } from "@/lib/route-templates";
import { Input } from "@/components/ui/input";

const CONTINENTS = ["Todos", "Europa", "Ásia", "Américas", "Oriente Médio"];

export default function RoutesPage() {
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("Todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ROUTE_TEMPLATES.filter((t) => {
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesContinent =
        continent === "Todos" || t.continent === continent;
      return matchesSearch && matchesContinent;
    });
  }, [search, continent]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-4 right-8 text-6xl animate-float">✈️</div>
          <div className="absolute bottom-4 left-12 text-4xl animate-float" style={{ animationDelay: "1s" }}>🗺️</div>
          <div className="absolute top-8 left-1/3 text-3xl animate-float" style={{ animationDelay: "2s" }}>🌍</div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Roteiros Prontos</span>
          </h1>
          <p className="text-slate-300 mb-6 max-w-xl">
            Escolha um destino e aplique um roteiro completo à sua viagem com um clique.
            Atividades, restaurantes e atrações já organizados por dia.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar destino, cidade ou tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15"
            />
          </div>
        </div>
      </div>

      {/* Continent Filter */}
      <div className="flex gap-2 flex-wrap">
        {CONTINENTS.map((c) => (
          <button
            key={c}
            onClick={() => setContinent(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              continent === c
                ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-sky-300 hover:text-sky-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {filtered.length} roteiro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            expanded={expandedId === template.id}
            onToggle={() =>
              setExpandedId(expandedId === template.id ? null : template.id)
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum roteiro encontrado</h3>
          <p className="text-gray-500">Tente outra busca ou selecione &quot;Todos&quot; os continentes.</p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  expanded,
  onToggle,
}: {
  template: RouteTemplate;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm travel-card-hover overflow-hidden flex flex-col">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.coverImage}
          alt={`Foto de ${template.destination}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{template.flag}</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{template.destination}</p>
              <p className="text-white/70 text-xs">{template.continent}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {template.duration} dias
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1">{template.title}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Budget */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-700">Orçamento estimado:</span>
          <span className="text-teal-600 font-semibold">{template.estimatedBudget}</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-1 mb-4">
          {template.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin className="h-3 w-3 text-sky-500 mt-0.5 shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-gray-100 pt-3 mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Atividades incluídas ({template.activities.length}):
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {template.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="bg-sky-100 text-sky-600 rounded px-1.5 py-0.5 shrink-0 font-medium">
                    Dia {act.day}
                  </span>
                  <span>{act.title}</span>
                  {act.startTime && (
                    <span className="ml-auto text-gray-400 shrink-0">{act.startTime}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={onToggle}
            className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-sky-600 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Ver detalhes
              </>
            )}
          </button>

          <Link
            href={`/trips/new?template=${template.id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white transition-all shadow-sm shadow-sky-200"
          >
            Usar este roteiro
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
