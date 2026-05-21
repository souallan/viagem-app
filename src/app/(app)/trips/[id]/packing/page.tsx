"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PackingItem {
  id: string;
  name: string;
  category: string | null;
  isPacked: boolean;
  quantity: number;
}

const BASE_TEMPLATES = [
  { label: "Documentos", icon: "📄", items: ["Passaporte", "Visto", "Seguro viagem", "Passagens impressas", "Carteira de identidade"] },
  { label: "Roupas", icon: "👕", items: ["Camisetas", "Calças", "Cuecas/Calcinhas", "Meias", "Pijama", "Agasalho"] },
  { label: "Higiene", icon: "🧴", items: ["Escova de dentes", "Pasta de dente", "Shampoo", "Condicionador", "Protetor solar", "Desodorante"] },
  { label: "Eletrônicos", icon: "🔌", items: ["Carregador de celular", "Adaptador de tomada", "Câmera", "Fones de ouvido", "Power bank"] },
  { label: "Saúde", icon: "💊", items: ["Remédios", "Analgésico", "Band-aid", "Repelente", "Antialérgico"] },
];

const DESTINATION_EXTRAS: { keywords: string[]; label: string; icon: string; items: string[] }[] = [
  {
    keywords: ["praia", "beach", "bali", "cancún", "cancun", "maldivas", "maldives", "caribe", "caribbean", "hawaii", "havai"],
    label: "Praia / Tropical", icon: "🏖️",
    items: ["Biquíni/Sunga", "Toalha de praia", "Chinelo", "Protetor solar FPS 60+", "Óculos de sol", "Saída de praia"],
  },
  {
    keywords: ["europa", "europe", "paris", "london", "roma", "amsterdam", "barcelona", "berlin", "viena", "prague", "praga"],
    label: "Europa (adaptador)", icon: "🇪🇺",
    items: ["Adaptador tipo C/F", "Casaco impermeável", "Roupas em camadas", "ETIAS impresso"],
  },
  {
    keywords: ["japão", "japan", "tokyo", "osaka", "kyoto"],
    label: "Japão", icon: "🇯🇵",
    items: ["Adaptador tipo A", "IC Card (Suica/Pasmo)", "Lenços descartáveis", "Cartão de visita", "Seguro viagem"],
  },
  {
    keywords: ["inverno", "neve", "ski", "alpes", "alps", "noruega", "norway", "finlândia", "finland", "islândia", "iceland", "canada", "canadá"],
    label: "Destino frio / neve", icon: "❄️",
    items: ["Casaco térmico", "Luvas", "Gorro", "Meias térmicas", "Bota impermeável", "Manta de pescoço"],
  },
  {
    keywords: ["disney", "universal", "parque", "theme park", "orlando"],
    label: "Parques temáticos", icon: "🎢",
    items: ["Tênis confortável", "Boné", "Garrafa d'água reutilizável", "Protetor solar", "Carteira de ativação"],
  },
  {
    keywords: ["safari", "africa", "áfica", "quênia", "kenya", "tanzânia", "tanzania"],
    label: "Safari / África", icon: "🦁",
    items: ["Roupas tons neutros", "Binóculo", "Repelente forte", "Vacina Febre Amarela", "Bota fechada"],
  },
];

function getSmartSuggestions(destination: string) {
  if (!destination) return [];
  const lower = destination.toLowerCase();
  return DESTINATION_EXTRAS.filter((extra) =>
    extra.keywords.some((kw) => lower.includes(kw))
  );
}

export default function PackingPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [destination, setDestination] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (tripRes.ok) {
      const trip = await tripRes.json();
      setDestination(trip.destination ?? "");
    }
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/packing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
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
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isPacked: !i.isPacked } : i))
    );
  }

  async function handleDelete(itemId: string) {
    await fetch(`/api/trips/${id}/packing`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  async function addTemplateItem(name: string, category: string) {
    await fetch(`/api/trips/${id}/packing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, quantity: 1 }),
    });
    load();
  }

  const packed = items.filter((i) => i.isPacked).length;
  const total = items.length;

  const grouped = items.reduce<Record<string, PackingItem[]>>((acc, item) => {
    const key = item.category ?? "Sem categoria";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Lista de malas</h2>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {packed} de {total} itens separados ({Math.round((packed / total) * 100)}%)
            </p>
          )}
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar item
        </Button>
      </div>

      {/* Barra de progresso */}
      {total > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 bg-green-500 rounded-full transition-all"
            style={{ width: `${(packed / total) * 100}%` }}
          />
        </div>
      )}

      {/* Templates rápidos */}
      {total === 0 && (
        <div className="space-y-5">
          {/* Smart suggestions based on destination */}
          {(() => {
            const smart = getSmartSuggestions(destination);
            return smart.length > 0 ? (
              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                <p className="text-xs font-semibold text-teal-700 mb-3 flex items-center gap-1.5">
                  ✨ Sugestões para {destination}
                </p>
                <div className="space-y-3">
                  {smart.map((cat) => (
                    <div key={cat.label}>
                      <p className="text-xs font-medium text-teal-600 mb-1.5">{cat.icon} {cat.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => addTemplateItem(item, cat.label)}
                            className="text-xs bg-white hover:bg-teal-100 hover:text-teal-700 text-gray-600 border border-teal-200 px-2.5 py-1 rounded-full transition-colors"
                          >
                            + {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Itens essenciais</h3>
            <div className="space-y-3">
              {BASE_TEMPLATES.map((cat) => (
                <div key={cat.label}>
                  <p className="text-xs font-medium text-gray-400 mb-1.5">{cat.icon} {cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => addTemplateItem(item, cat.label)}
                        className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de itens */}
      {total === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Nenhum item na mala</p>
          <p className="text-sm mt-1">Use os templates acima ou adicione itens manualmente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catItems]) => {
            const catPacked = catItems.filter((i) => i.isPacked).length;
            const catTotal = catItems.length;
            const catPct = catTotal > 0 ? Math.round((catPacked / catTotal) * 100) : 0;
            return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {category}
              </h3>
              <span className="text-xs text-gray-400">{catPacked}/{catTotal} · {catPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
                <div
                  className={`h-1 rounded-full transition-all ${catPct === 100 ? "bg-green-500" : "bg-sky-400"}`}
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
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Adicionar item</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="packing-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Item *</Label>
              <Input name="name" value={form.name} onChange={handleChange} required placeholder="Ex: Carregador de celular" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input name="category" value={form.category} onChange={handleChange} placeholder="Ex: Eletrônicos" />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="packing-form" disabled={loading}>{loading ? "Adicionando..." : "Adicionar"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
