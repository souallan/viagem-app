"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string | null;
  carrier: string | null;
  bookingRef: string | null;
  seat: string | null;
  cost: number | null;
  notes: string | null;
}

const typeLabels: Record<string, { label: string; icon: string }> = {
  FLIGHT: { label: "Voo", icon: "✈️" },
  BUS: { label: "Ônibus", icon: "🚌" },
  TRAIN: { label: "Trem", icon: "🚆" },
  CAR: { label: "Carro", icon: "🚗" },
  BOAT: { label: "Barco", icon: "⛴️" },
  OTHER: { label: "Outro", icon: "🚀" },
};

function fmt(dt: string) {
  return format(new Date(dt), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export default function TransportPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Transport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "FLIGHT", from: "", to: "", departureTime: "", arrivalTime: "",
    carrier: "", bookingRef: "", seat: "", cost: "", notes: "",
  });

  async function load() {
    const res = await fetch(`/api/trips/${id}/transports`);
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/transports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ type: "FLIGHT", from: "", to: "", departureTime: "", arrivalTime: "", carrier: "", bookingRef: "", seat: "", cost: "", notes: "" });
      load();
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Excluir este transporte?")) return;
    await fetch(`/api/trips/${id}/transports`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Transporte</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">✈️</div>
          <p className="font-medium">Nenhum transporte cadastrado</p>
          <p className="text-sm mt-1">Adicione voos, ônibus e outros meios de transporte.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const t = typeLabels[item.type];
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{t.icon}</span>
                        <span className="text-sm font-medium text-gray-500">{t.label}</span>
                        {item.carrier && <span className="text-sm font-semibold text-gray-900">{item.carrier}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                        <span>{item.from}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span>{item.to}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 mt-1.5 text-sm text-gray-500">
                        <span>Saída: {fmt(item.departureTime)}</span>
                        {item.arrivalTime && <span>Chegada: {fmt(item.arrivalTime)}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 mt-1.5 text-sm text-gray-500">
                        {item.bookingRef && <span>Reserva: <strong>{item.bookingRef}</strong></span>}
                        {item.seat && <span>Assento: <strong>{item.seat}</strong></span>}
                        {item.cost != null && <span className="text-green-700 font-medium">R$ {item.cost.toFixed(2)}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Novo transporte</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="transport-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select name="type" value={form.type} onChange={handleChange}>
                {Object.entries(typeLabels).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Origem *</Label>
                <Input name="from" value={form.from} onChange={handleChange} required placeholder="Cidade / Aeroporto" />
              </div>
              <div className="space-y-2">
                <Label>Destino *</Label>
                <Input name="to" value={form.to} onChange={handleChange} required placeholder="Cidade / Aeroporto" />
              </div>
              <div className="space-y-2">
                <Label>Partida *</Label>
                <Input name="departureTime" type="datetime-local" value={form.departureTime} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Chegada</Label>
                <Input name="arrivalTime" type="datetime-local" value={form.arrivalTime} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Companhia</Label>
                <Input name="carrier" value={form.carrier} onChange={handleChange} placeholder="Ex: LATAM" />
              </div>
              <div className="space-y-2">
                <Label>Código reserva</Label>
                <Input name="bookingRef" value={form.bookingRef} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Assento</Label>
                <Input name="seat" value={form.seat} onChange={handleChange} placeholder="Ex: 14A" />
              </div>
              <div className="space-y-2">
                <Label>Custo</Label>
                <Input name="cost" type="number" min="0" step="0.01" value={form.cost} onChange={handleChange} placeholder="0,00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="transport-form" disabled={loading}>{loading ? "Salvando..." : "Adicionar"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
