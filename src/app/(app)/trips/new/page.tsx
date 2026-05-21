"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE_TEMPLATES, getTemplateById } from "@/lib/route-templates";

function NewTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const template = templateId ? getTemplateById(templateId) : undefined;

  const [loading, setLoading] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);
  const [templateProgress, setTemplateProgress] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: template?.title ?? "",
    destination: template?.destination ?? "",
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
        title: template.title,
        destination: template.destination,
        currency: template.currency,
        description: template.description,
      }));
    }
  }, [template]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function applyTemplateActivities(tripId: string) {
    if (!template) return;
    setApplyingTemplate(true);
    const total = template.activities.length;
    for (let i = 0; i < total; i++) {
      const act = template.activities[i];
      try {
        await fetch(`/api/trips/${tripId}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: act.title,
            type: act.type,
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar viagem");
        setLoading(false);
        return;
      }

      if (template) {
        await applyTemplateActivities(data.id);
        router.push(`/trips/${data.id}/itinerary`);
      } else {
        router.push(`/trips/${data.id}`);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (applyingTemplate) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-4 animate-float">✈️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aplicando roteiro...</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Estamos adicionando {template?.activities.length} atividades à sua viagem.
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
      <div className="flex items-center gap-3 mb-6">
        <Link href={template ? "/routes" : "/dashboard"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova viagem</h1>
          {template && (
            <p className="text-sm text-sky-600 mt-0.5">
              Usando roteiro: <span className="font-semibold">{template.title}</span> {template.flag}
            </p>
          )}
        </div>
      </div>

      {template && (
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100">
          <div className="flex items-start gap-3">
            <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0">
              <img
                src={template.coverImage}
                alt={template.destination}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{template.flag}</span>
                <p className="font-semibold text-gray-900 text-sm">{template.title}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{template.destination} • {template.duration} dias</p>
              <p className="text-xs text-sky-700 mt-1">
                {template.activities.length} atividades serão adicionadas automaticamente
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da viagem *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Viagem para Paris"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino *</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Ex: Paris, França"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de ida</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de volta</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="BRL">BRL — Real</option>
                  <option value="USD">USD — Dólar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — Libra</option>
                  <option value="ARS">ARS — Peso Argentino</option>
                  <option value="JPY">JPY — Iene</option>
                  <option value="AED">AED — Dirham</option>
                  <option value="IDR">IDR — Rupia</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento total</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={form.budget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PLANNING">Planejando</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="COMPLETED">Concluída</option>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Link href={template ? "/routes" : "/dashboard"} className="flex-1">
                <Button variant="outline" className="w-full" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : template ? (
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
