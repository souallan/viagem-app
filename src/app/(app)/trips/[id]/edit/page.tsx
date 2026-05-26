"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Image as ImageIcon, Link as LinkIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PRESET_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1499856374753-58c65c3da0ba?w=800&q=80", label: "Paris" },
  { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80", label: "Tokyo" },
  { url: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80", label: "Roma" },
  { url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", label: "Barcelona" },
  { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", label: "Dubai" },
  { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", label: "Bali" },
  { url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80", label: "Lisboa" },
  { url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80", label: "Amsterdam" },
  { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", label: "Santorini" },
  { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", label: "Nova York" },
  { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80", label: "Praia tropical" },
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", label: "Montanhas" },
  { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80", label: "Índia" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "Marrocos" },
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80", label: "Estrada" },
  { url: "https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?w=800&q=80", label: "Sunset tropical" },
];

export default function EditTripPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [photoMode, setPhotoMode] = useState<"preset" | "url">("preset");
  const [urlInput, setUrlInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    currency: "BRL",
    budget: "",
    status: "PLANNING",
    coverImage: "" as string | null,
  });

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((trip) => {
        setForm({
          title: trip.title ?? "",
          destination: trip.destination ?? "",
          description: trip.description ?? "",
          startDate: trip.startDate ? trip.startDate.slice(0, 10) : "",
          endDate: trip.endDate ? trip.endDate.slice(0, 10) : "",
          currency: trip.currency ?? "BRL",
          budget: trip.budget?.toString() ?? "",
          status: trip.status ?? "PLANNING",
          coverImage: trip.coverImage ?? null,
        });
        if (trip.coverImage) setUrlInput(trip.coverImage);
      });
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectPreset(url: string) {
    setForm((prev) => ({ ...prev, coverImage: url }));
    setUrlInput(url);
  }

  function applyUrl() {
    const url = urlInput.trim();
    setForm((prev) => ({ ...prev, coverImage: url || null }));
  }

  function clearPhoto() {
    setForm((prev) => ({ ...prev, coverImage: null }));
    setUrlInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("A data de volta não pode ser anterior à data de ida.");
      return;
    }
    setLoading(true);

    const res = await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar");
      return;
    }
    router.push(`/trips/${id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Excluir esta viagem? Todos os dados (atividades, despesas, documentos) serão removidos permanentemente.")) return;
    setDeleting(true);
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  const selectedPhoto = form.coverImage;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/trips/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar viagem</h1>
      </div>

      {/* ── Cover photo picker ── */}
      <Card className="mb-5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4 text-sky-500" aria-hidden="true" />
            Foto de capa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-40">
            {selectedPhoto ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto}
                  alt="Foto de capa"
                  className="w-full h-full object-cover"
                  onError={() => setForm((p) => ({ ...p, coverImage: null }))}
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center transition-colors"
                  title="Remover foto"
                >
                  <X className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <ImageIcon className="h-10 w-10 text-gray-200" aria-hidden="true" />
                <p className="text-sm">Nenhuma foto selecionada</p>
              </div>
            )}
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
            <button
              type="button"
              onClick={() => setPhotoMode("preset")}
              className={cn(
                "flex-1 py-2 transition-colors",
                photoMode === "preset" ? "bg-sky-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              Fotos prontas
            </button>
            <button
              type="button"
              onClick={() => setPhotoMode("url")}
              className={cn(
                "flex-1 py-2 transition-colors border-l border-gray-200",
                photoMode === "url" ? "bg-sky-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              URL personalizada
            </button>
          </div>

          {/* Preset grid */}
          {photoMode === "preset" && (
            <div className="grid grid-cols-4 gap-2">
              {PRESET_PHOTOS.map(({ url, label }) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => selectPreset(url)}
                  className={cn(
                    "relative rounded-lg overflow-hidden aspect-video border-2 transition-all",
                    selectedPhoto === url ? "border-sky-500 scale-95" : "border-transparent hover:border-gray-300"
                  )}
                  title={label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={label} className="w-full h-full object-cover" />
                  {selectedPhoto === url && (
                    <div className="absolute inset-0 bg-sky-500/30 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white drop-shadow" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 px-1">
                    <p className="text-white text-[9px] font-medium text-center truncate">{label}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* URL input */}
          {photoMode === "url" && (
            <div className="space-y-2">
              <Label className="text-xs">Cole a URL de uma imagem</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
                    placeholder="https://images.unsplash.com/..."
                    className="pl-9 text-sm"
                  />
                </div>
                <Button type="button" size="sm" onClick={applyUrl} className="shrink-0">
                  Aplicar
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Dica: use <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">unsplash.com</a> para fotos gratuitas. Clique em qualquer foto → botão "Share" → "Copy image URL".
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Trip info form ── */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da viagem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da viagem *</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino(s)</Label>
              <Input
                id="destination"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Ex: Paris, França → Roma, Itália"
              />
              <p className="text-xs text-gray-400">Separe múltiplos destinos com " → " (seta).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select id="currency" name="currency" value={form.currency} onChange={handleChange}>
                  <option value="BRL">🇧🇷 BRL — Real</option>
                  <option value="USD">🇺🇸 USD — Dólar</option>
                  <option value="EUR">🇪🇺 EUR — Euro</option>
                  <option value="GBP">🇬🇧 GBP — Libra</option>
                  <option value="JPY">🇯🇵 JPY — Iene</option>
                  <option value="ARS">🇦🇷 ARS — Peso Argentino</option>
                  <option value="AED">🇦🇪 AED — Dirham</option>
                  <option value="CHF">🇨🇭 CHF — Franco Suíço</option>
                  <option value="IDR">🇮🇩 IDR — Rupia</option>
                  <option value="AUD">🇦🇺 AUD — Dólar Australiano</option>
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

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="PLANNING">📋 Planejando</option>
                <option value="CONFIRMED">✅ Confirmada</option>
                <option value="IN_PROGRESS">✈️ Em andamento</option>
                <option value="COMPLETED">🏁 Concluída</option>
                <option value="CANCELLED">❌ Cancelada</option>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-100">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Link href={`/trips/${id}`} className="flex-1">
                <Button variant="outline" className="w-full" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Danger zone ── */}
      <div className="mt-6 p-5 border border-red-200 rounded-xl bg-red-50">
        <h3 className="text-sm font-bold text-red-800 mb-1.5 flex items-center gap-2">
          <Trash2 className="h-4 w-4" aria-hidden="true" /> Zona de perigo
        </h3>
        <p className="text-sm text-red-700 mb-4">
          Excluir a viagem remove permanentemente todos os dados associados — atividades, despesas, documentos, lista de malas e transportes. Esta ação não pode ser desfeita.
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {deleting ? "Excluindo..." : "Excluir esta viagem"}
        </Button>
      </div>
    </div>
  );
}
