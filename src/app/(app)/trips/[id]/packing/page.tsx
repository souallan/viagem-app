"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Plus, Trash2, Pencil, Package, Wand2, ChevronDown, ChevronUp,
  CheckCircle2, Sparkles, Thermometer, ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { affiliates } from "@/lib/affiliates";
import { useLanguage } from "@/contexts/language-context";

interface PackingItem {
  id: string;
  name: string;
  category: string | null;
  isPacked: boolean;
  quantity: number;
}

interface Trip {
  destination: string;
  startDate: string | null;
  endDate: string | null;
}

// ── Template data ────────────────────────────────────────────

const BASE_TEMPLATES = [
  { label: "Documentos",  icon: "📄", items: ["Passaporte", "Visto", "Seguro viagem", "Passagens impressas", "Carteira de identidade"] },
  { label: "Roupas",      icon: "👕", items: ["Camisetas", "Calças", "Cuecas/Calcinhas", "Meias", "Pijama", "Agasalho"] },
  { label: "Higiene",     icon: "🧴", items: ["Escova de dentes", "Pasta de dente", "Shampoo", "Condicionador", "Protetor solar", "Desodorante"] },
  { label: "Eletrônicos", icon: "🔌", items: ["Carregador de celular", "Adaptador de tomada", "Fones de ouvido", "Power bank"] },
  { label: "Saúde",       icon: "💊", items: ["Remédios", "Analgésico", "Band-aid", "Repelente", "Antialérgico"] },
];

// ── Amazon affiliate links ────────────────────────────────────

const AFFILIATE_TAG = "roteiroapp-21";

const AMAZON_CATEGORY: Record<string, string> = {
  "Documentos":    "porta documentos viagem passaporte",
  "Roupas":        "roupas de viagem compactas",
  "Higiene":       "kit higiene viagem avião",
  "Eletrônicos":   "acessórios eletrônicos viagem",
  "Saúde":         "kit primeiros socorros viagem",
  "Acessórios":    "acessórios viagem mochila",
};

const AMAZON_ITEM: Record<string, string> = {
  "passaporte":              "porta passaporte slim",
  "adaptador de tomada":     "adaptador tomada universal viagem",
  "adaptador tipo c/f":      "adaptador tomada tipo c europeu",
  "adaptador tipo a":        "adaptador tomada tipo a japao",
  "power bank":              "power bank 20000mah",
  "fones de ouvido":         "fone de ouvido bluetooth cancelamento ruido",
  "cadeado para mala":       "cadeado tsa mala viagem",
  "mala de mão (cabine)":    "mala cabine bordo rígida",
  "mala despachada (média)": "mala despachada média 65l",
  "mala despachada (grande)":"mala despachada grande 80l",
  "protetor solar fps 60+":  "protetor solar fps 70 corporal",
  "repelente":               "repelente deet 50% viagem",
  "repelente forte (deet)":  "repelente deet 50%",
  "casaco térmico":          "casaco térmico masculino feminino",
  "roupa interior térmica":  "roupa interior termica segunda pele",
  "garrafa d'água reutilizável": "garrafa água térmica reutilizável",
  "seguro viagem":           "seguro viagem internacional",
};

function amazonUrl(query: string) {
  return `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}

function getCategoryAmazon(category: string): string | null {
  const key = Object.keys(AMAZON_CATEGORY).find(
    (k) => k.toLowerCase() === category.toLowerCase()
  );
  return key ? amazonUrl(AMAZON_CATEGORY[key]) : null;
}

function getItemAmazon(itemName: string): string | null {
  const key = Object.keys(AMAZON_ITEM).find(
    (k) => k.toLowerCase() === itemName.toLowerCase()
  );
  return key ? amazonUrl(AMAZON_ITEM[key]) : null;
}

const INSURANCE_ITEM_KEYWORDS = ["seguro viagem", "seguro de viagem", "travel insurance"];

function getItemLink(itemName: string): { url: string; label: string; isInsurance: boolean } | null {
  const lower = itemName.toLowerCase();
  if (INSURANCE_ITEM_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { url: affiliates.insurance[0].url, label: "Contratar", isInsurance: true };
  }
  const amazonLink = getItemAmazon(itemName);
  return amazonLink ? { url: amazonLink, label: "Amazon", isInsurance: false } : null;
}

// Climate-based smart suggestions
const CLIMATE_PROFILES: { id: string; label: string; icon: string; keywords: string[]; items: { name: string; category: string }[] }[] = [
  {
    id: "beach",
    label: "Praia / Tropical",
    icon: "🏖️",
    keywords: ["praia", "beach", "bali", "cancún", "cancun", "maldivas", "caribe", "caribbean", "hawaii", "havai", "tailândia", "thailand", "vietnam", "vietnã", "phuket"],
    items: [
      { name: "Biquíni/Sunga", category: "Roupas" },
      { name: "Toalha de praia", category: "Acessórios" },
      { name: "Chinelo", category: "Roupas" },
      { name: "Protetor solar FPS 60+", category: "Higiene" },
      { name: "Óculos de sol", category: "Acessórios" },
      { name: "Saída de praia", category: "Roupas" },
      { name: "Sacola impermeável", category: "Acessórios" },
    ],
  },
  {
    id: "europe",
    label: "Europa",
    icon: "🇪🇺",
    keywords: ["europa", "europe", "paris", "london", "roma", "amsterdam", "barcelona", "berlin", "viena", "prague", "praga", "budapest", "budapeste", "lisboa", "porto", "madri", "madrid"],
    items: [
      { name: "Adaptador tipo C/F", category: "Eletrônicos" },
      { name: "Casaco impermeável", category: "Roupas" },
      { name: "Roupas em camadas", category: "Roupas" },
      { name: "Scarpin/tênis confortável para caminhar", category: "Roupas" },
      { name: "ETIAS/Visto impresso", category: "Documentos" },
    ],
  },
  {
    id: "japan",
    label: "Japão",
    icon: "🇯🇵",
    keywords: ["japão", "japan", "tokyo", "osaka", "kyoto", "tóquio"],
    items: [
      { name: "Adaptador tipo A", category: "Eletrônicos" },
      { name: "IC Card (Suica/Pasmo)", category: "Documentos" },
      { name: "Lenços descartáveis", category: "Higiene" },
      { name: "Cartão de visita", category: "Acessórios" },
      { name: "Seguro saúde completo", category: "Documentos" },
      { name: "App de tradução offline", category: "Eletrônicos" },
    ],
  },
  {
    id: "cold",
    label: "Destino frio / neve",
    icon: "❄️",
    keywords: ["inverno", "neve", "ski", "alpes", "alps", "noruega", "norway", "finlândia", "finland", "islândia", "iceland", "canada", "canadá", "suíça", "swiss", "escandinávia"],
    items: [
      { name: "Casaco térmico", category: "Roupas" },
      { name: "Luvas", category: "Roupas" },
      { name: "Gorro", category: "Roupas" },
      { name: "Meias térmicas", category: "Roupas" },
      { name: "Bota impermeável", category: "Roupas" },
      { name: "Segunda pele / roupa interior térmica", category: "Roupas" },
      { name: "Balaclava / manta de pescoço", category: "Roupas" },
      { name: "Hidratante labial", category: "Higiene" },
    ],
  },
  {
    id: "parks",
    label: "Parques temáticos",
    icon: "🎢",
    keywords: ["disney", "universal", "parque", "theme park", "orlando", "florida"],
    items: [
      { name: "Tênis muito confortável", category: "Roupas" },
      { name: "Boné ou chapéu", category: "Acessórios" },
      { name: "Garrafa d'água reutilizável", category: "Acessórios" },
      { name: "Protetor solar", category: "Higiene" },
      { name: "Mochila pequena", category: "Acessórios" },
      { name: "Poncho descartável (chuva)", category: "Acessórios" },
    ],
  },
  {
    id: "safari",
    label: "Safari / África",
    icon: "🦁",
    keywords: ["safari", "africa", "áfrica", "quênia", "kenya", "tanzânia", "tanzania", "namíbia", "namibia"],
    items: [
      { name: "Roupas tons neutros (bege, caqui)", category: "Roupas" },
      { name: "Binóculo", category: "Acessórios" },
      { name: "Repelente forte (DEET)", category: "Higiene" },
      { name: "Vacina Febre Amarela", category: "Saúde" },
      { name: "Bota fechada", category: "Roupas" },
      { name: "Chapéu com aba", category: "Roupas" },
      { name: "Antimalarial", category: "Saúde" },
    ],
  },
  {
    id: "business",
    label: "Viagem de negócios",
    icon: "💼",
    keywords: ["negócios", "business", "conferência", "congresso", "trabalho", "reunião"],
    items: [
      { name: "Terno/Blazer", category: "Roupas" },
      { name: "Camisa social", category: "Roupas" },
      { name: "Sapato social", category: "Roupas" },
      { name: "Cartão de visita", category: "Acessórios" },
      { name: "Notebook e carregador", category: "Eletrônicos" },
      { name: "Pasta ou maleta", category: "Acessórios" },
    ],
  },
];

function getDurationExtras(days: number): { name: string; category: string }[] {
  if (days <= 3) return [
    { name: "Mala de mão (cabine)", category: "Acessórios" },
  ];
  if (days <= 7) return [
    { name: "Mala despachada (média)", category: "Acessórios" },
    { name: "Cadeado para mala", category: "Acessórios" },
  ];
  return [
    { name: "Mala despachada (grande)", category: "Acessórios" },
    { name: "Cadeado para mala", category: "Acessórios" },
    { name: "Roupa extra", category: "Roupas" },
    { name: "Bolsa organizadora para roupas", category: "Acessórios" },
    { name: "Detergente para lavar roupas", category: "Higiene" },
  ];
}

function getSmartSuggestions(destination: string): typeof CLIMATE_PROFILES {
  if (!destination) return [];
  const lower = destination.toLowerCase();
  return CLIMATE_PROFILES.filter((p) => p.keywords.some((kw) => lower.includes(kw)));
}

function getTripDays(startDate: string | null, endDate: string | null): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  return days > 0 ? days : null;
}

// ── Page ─────────────────────────────────────────────────────

export default function PackingPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [showEssentials, setShowEssentials] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", quantity: "1" });

  async function load() {
    const [packRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/packing`),
      fetch(`/api/trips/${id}`),
    ]);
    if (packRes.ok) {
      const data = await packRes.json();
      setItems(data.items ?? []);
    }
    if (tripRes.ok) setTrip(await tripRes.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function openEdit(item: PackingItem) {
    setForm({ name: item.name, category: item.category ?? "", quantity: String(item.quantity) });
    setEditingId(item.id);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = editingId ? { ...form, itemId: editingId } : form;
    const res = await fetch(`/api/trips/${id}/packing`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", category: "", quantity: "1" });
      load();
    }
  }

  async function handleToggle(item: PackingItem) {
    await fetch(`/api/trips/${id}/packing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, isPacked: !item.isPacked }),
    });
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isPacked: !i.isPacked } : i)));
  }

  async function handleDelete(itemId: string) {
    await fetch(`/api/trips/${id}/packing`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  async function quickAdd(name: string, category: string) {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setItems((prev) => [...prev, { id: tempId, name, category, isPacked: false, quantity: 1 }]);
    try {
      await fetch(`/api/trips/${id}/packing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, quantity: 1 }),
      });
      load();
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
    }
  }

  async function addBulk(newItems: { name: string; category: string }[]) {
    const existing = new Set(items.map((i) => i.name.toLowerCase()));
    const toAdd = newItems.filter((ni) => !existing.has(ni.name.toLowerCase()));
    await Promise.all(
      toAdd.map((ni) =>
        fetch(`/api/trips/${id}/packing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: ni.name, category: ni.category, quantity: 1 }),
        })
      )
    );
    load();
  }

  const packed = items.filter((i) => i.isPacked).length;
  const total = items.length;
  const existingNames = useMemo(() => new Set(items.map((i) => i.name.toLowerCase())), [items]);

  const grouped = items.reduce<Record<string, PackingItem[]>>((acc, item) => {
    const key = item.category ?? "Sem categoria";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const tripDays = getTripDays(trip?.startDate ?? null, trip?.endDate ?? null);
  const smartSuggestions = useMemo(() => getSmartSuggestions(trip?.destination ?? ""), [trip?.destination]);
  const durationExtras = useMemo(() => tripDays ? getDurationExtras(tripDays) : [], [tripDays]);

  // ── Smart Generator Panel ────────────────────────────────
  function GeneratorPanel() {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [adding, setAdding] = useState(false);

    const allSuggestions = [
      ...smartSuggestions.flatMap((p) => p.items.map((i) => ({ ...i, source: p.label, icon: p.icon }))),
      ...(tripDays ? durationExtras.map((i) => ({ ...i, source: `${tripDays} ${t.packing.tripDays}`, icon: "📅" })) : []),
    ];

    const grouped = allSuggestions.reduce<Record<string, typeof allSuggestions>>((acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    }, {});

    function toggle(name: string) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
    }

    function selectAll() {
      setSelected(new Set(allSuggestions.map((i) => i.name)));
    }

    async function addSelected() {
      setAdding(true);
      const toAdd = allSuggestions.filter((i) => selected.has(i.name));
      await addBulk(toAdd);
      setAdding(false);
      setGeneratorOpen(false);
    }

    if (allSuggestions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Thermometer className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-sm">{t.packing.noSuggestions}</p>
          <p className="text-xs mt-1">{t.packing.noSuggestionsDesc}</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{allSuggestions.length}</span> {t.packing.suggestedFor}
          </p>
          <button onClick={selectAll} className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
            {t.packing.selectAll}
          </button>
        </div>

        {Object.entries(grouped).map(([source, sourceItems]) => {
          const icon = sourceItems[0]?.icon ?? "📦";
          return (
            <div key={source}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span>{icon}</span> {source}
              </p>
              <div className="space-y-1.5">
                {sourceItems.map((item) => (
                  <label
                    key={item.name}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-all",
                      selected.has(item.name)
                        ? "bg-primary-50 border-primary-200"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.name)}
                      onChange={() => toggle(item.name)}
                      className="h-4 w-4 rounded accent-primary-600"
                    />
                    <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-3 border-t border-gray-100">
          <Button
            onClick={addSelected}
            disabled={selected.size === 0 || adding}
            className="w-full gap-2"
          >
            {adding ? t.packing.addingLabel : `${t.common.add} ${selected.size} ${selected.size !== 1 ? t.packing.addItem.toLowerCase() : t.packing.formItem.replace(" *", "").toLowerCase()}`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t.packing.title}</h2>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {packed} / {total} ({Math.round((packed / total) * 100)}% {t.packing.progress})
            </p>
          )}
          {tripDays && (
            <p className="text-xs text-gray-400 mt-0.5">{tripDays} {t.packing.tripDays}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(smartSuggestions.length > 0 || tripDays) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratorOpen(true)}
              className="gap-1.5 border-primary-200 text-primary-700 hover:bg-primary-50"
            >
              <Wand2 className="h-4 w-4" />
              {t.packing.aiGenerator}
            </Button>
          )}
          <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {t.common.add}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all",
                packed === total ? "bg-green-500" : "bg-primary-400"
              )}
              style={{ width: `${(packed / total) * 100}%` }}
            />
          </div>
          {packed === total && total > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t.packing.allPackedMsg}
            </div>
          )}
        </div>
      )}

      {/* Smart suggestions banner (when list is empty) */}
      {total === 0 && smartSuggestions.length > 0 && (
        <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t.packing.customListFor} {trip?.destination?.split(",")[0]}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {smartSuggestions.length === 1
                  ? `1 ${t.packing.detectedProfiles}`
                  : `${smartSuggestions.length} ${t.packing.detectedProfilesPlural}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {smartSuggestions.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1 text-xs bg-white border border-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">
                {p.icon} {p.label}
              </span>
            ))}
            {tripDays && (
              <span className="inline-flex items-center gap-1 text-xs bg-white border border-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">
                📅 {tripDays} {t.packing.tripDays}
              </span>
            )}
          </div>
          <Button onClick={() => setGeneratorOpen(true)} size="sm" className="gap-2 w-full sm:w-auto">
            <Wand2 className="h-4 w-4" />
            {t.packing.generateList}
          </Button>
        </div>
      )}

      {/* ── Quick-add Essentials Panel ── always visible ── */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowEssentials((v) => !v)}
          className="w-full flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-gray-50 to-white hover:from-primary-50 hover:to-white transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <Package className="h-3.5 w-3.5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-800">{t.packing.essentials}</span>
            {total > 0 && (() => {
              const addedCount = BASE_TEMPLATES.flatMap((c) => c.items).filter((i) => existingNames.has(i.toLowerCase())).length;
              const totalCount = BASE_TEMPLATES.flatMap((c) => c.items).length;
              return (
                <span className="ml-2 text-xs text-gray-400">
                  {addedCount}/{totalCount} {t.packing.addedLabel}
                </span>
              );
            })()}
          </div>
          <span className="text-xs text-primary-600 font-medium shrink-0 mr-1">
            {showEssentials ? t.packing.hide : t.common.add}
          </span>
          {showEssentials ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
        </button>

        {showEssentials && (
          <div className="p-4 space-y-5 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-green-200 border border-green-400" />
              {t.packing.alreadyInList}
            </p>
            {BASE_TEMPLATES.map((cat) => (
              <EssentialSection key={cat.label} cat={cat} existingNames={existingNames} onAdd={quickAdd} />
            ))}
          </div>
        )}
      </div>

      {/* Items list */}
      {total > 0 && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catItems]) => {
            const catPacked = catItems.filter((i) => i.isPacked).length;
            const catTotal = catItems.length;
            const catPct = catTotal > 0 ? Math.round((catPacked / catTotal) * 100) : 0;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</h3>
                  <div className="flex items-center gap-3">
                    {getCategoryAmazon(category) && (
                      <a
                        href={getCategoryAmazon(category)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                        title="Comprar na Amazon"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Amazon
                      </a>
                    )}
                    <span className="text-xs text-gray-400">{catPacked}/{catTotal} · {catPct}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
                  <div
                    className={`h-1 rounded-full transition-all ${catPct === 100 ? "bg-green-500" : "bg-primary-400"}`}
                    style={{ width: `${catPct}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors",
                        item.isPacked
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => handleToggle(item)}
                        className="h-4 w-4 rounded accent-green-600 cursor-pointer"
                      />
                      <span className={cn("flex-1 text-sm", item.isPacked && "line-through text-gray-400")}>
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="ml-1.5 text-xs text-gray-400">×{item.quantity}</span>
                        )}
                      </span>
                      {!item.isPacked && (() => {
                        const link = getItemLink(item.name);
                        if (!link) return null;
                        return (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className={cn(
                              "transition-colors shrink-0",
                              link.isInsurance
                                ? "text-green-500 hover:text-green-700"
                                : "text-orange-400 hover:text-orange-600"
                            )}
                            title={link.isInsurance ? "Contratar seguro viagem" : "Comprar na Amazon"}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </a>
                        );
                      })()}
                      <button
                        onClick={() => openEdit(item)}
                        className="text-gray-300 hover:text-primary-500 transition-colors"
                        aria-label={t.common.edit}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        aria-label={t.common.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit item dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null); setForm({ name: "", category: "", quantity: "1" }); }}>
        <DialogHeader>
          <DialogTitle>{editingId ? t.packing.dialogEdit : t.packing.dialogNew}</DialogTitle>
          <DialogClose onClose={() => { setOpen(false); setEditingId(null); setForm({ name: "", category: "", quantity: "1" }); }} />
        </DialogHeader>
        <DialogBody>
          <form id="packing-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.packing.formItem}</Label>
              <Input name="name" value={form.name} onChange={handleChange} required placeholder={t.packing.formItemPh} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.packing.category}</Label>
                <Input name="category" value={form.category} onChange={handleChange} placeholder={t.packing.formCategoryPh} />
              </div>
              <div className="space-y-2">
                <Label>{t.packing.qty}</Label>
                <Input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); }}>{t.common.cancel}</Button>
          <Button type="submit" form="packing-form" disabled={loading}>
            {loading ? t.common.saving : editingId ? t.common.saveChanges : t.common.add}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Smart Generator dialog */}
      <Dialog open={generatorOpen} onClose={() => setGeneratorOpen(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary-600" />
            {t.packing.generatorTitle}
          </DialogTitle>
          <DialogClose onClose={() => setGeneratorOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <GeneratorPanel />
        </DialogBody>
      </Dialog>
    </div>
  );
}

// ── Essential section (flat, always-open, shows added state) ──

function EssentialSection({
  cat,
  existingNames,
  onAdd,
}: {
  cat: { label: string; icon: string; items: string[] };
  existingNames: Set<string>;
  onAdd: (name: string, category: string) => void;
}) {
  const addedCount = cat.items.filter((i) => existingNames.has(i.toLowerCase())).length;
  const allAdded = addedCount === cat.items.length;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base leading-none">{cat.icon}</span>
        <span className={cn("text-xs font-bold uppercase tracking-widest", allAdded ? "text-green-600" : "text-gray-400")}>
          {cat.label}
        </span>
        {addedCount > 0 && (
          <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
            {addedCount}/{cat.items.length}
          </span>
        )}
        {getCategoryAmazon(cat.label) && (
          <a
            href={getCategoryAmazon(cat.label)!}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-[10px] text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            <ShoppingCart className="h-3 w-3" /> Amazon
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {cat.items.map((item) => {
          const added = existingNames.has(item.toLowerCase());
          return (
            <button
              key={item}
              type="button"
              onClick={() => !added && onAdd(item, cat.label)}
              disabled={added}
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all select-none",
                added
                  ? "bg-green-50 text-green-600 border-green-200 cursor-default"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 active:scale-95 cursor-pointer shadow-sm"
              )}
            >
              {added ? (
                <CheckCircle2 className="h-3 w-3 shrink-0" />
              ) : (
                <Plus className="h-3 w-3 shrink-0" />
              )}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
