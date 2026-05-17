"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditTripPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    currency: "BRL",
    budget: "",
    status: "PLANNING",
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
        });
      });
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/trips/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar viagem</h1>
      </div>

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
              <Label htmlFor="destination">Destino *</Label>
              <Input id="destination" name="destination" value={form.destination} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de ida</Label>
                <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de volta</Label>
                <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select id="currency" name="currency" value={form.currency} onChange={handleChange}>
                  <option value="BRL">BRL — Real</option>
                  <option value="USD">USD — Dólar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — Libra</option>
                  <option value="ARS">ARS — Peso Argentino</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento total</Label>
                <Input id="budget" name="budget" type="number" min="0" step="0.01" value={form.budget} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="PLANNING">Planejando</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Link href={`/trips/${id}`} className="flex-1">
                <Button variant="outline" className="w-full" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 border border-red-200 rounded-xl bg-red-50">
        <h3 className="text-sm font-semibold text-red-800 mb-2">Zona de perigo</h3>
        <p className="text-sm text-red-700 mb-3">
          Excluir a viagem remove permanentemente todos os dados associados (atividades, despesas, documentos, etc.).
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "Excluindo..." : "Excluir viagem"}
        </Button>
      </div>
    </div>
  );
}
