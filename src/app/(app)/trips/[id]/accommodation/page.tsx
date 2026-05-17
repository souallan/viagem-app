"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Calendar, Phone, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface Accommodation {
  id: string;
  name: string;
  type: string;
  address: string | null;
  checkIn: string;
  checkOut: string;
  confirmationNumber: string | null;
  phone: string | null;
  website: string | null;
  cost: number | null;
  notes: string | null;
}

const typeLabels: Record<string, string> = {
  HOTEL: "Hotel",
  HOSTEL: "Hostel",
  AIRBNB: "Airbnb",
  RESORT: "Resort",
  POUSADA: "Pousada",
  OTHER: "Outro",
};

export default function AccommodationPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Accommodation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "HOTEL", address: "", checkIn: "", checkOut: "",
    confirmationNumber: "", phone: "", website: "", cost: "", notes: "",
  });

  async function load() {
    const res = await fetch(`/api/trips/${id}/accommodations`);
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/accommodations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ name: "", type: "HOTEL", address: "", checkIn: "", checkOut: "", confirmationNumber: "", phone: "", website: "", cost: "", notes: "" });
      load();
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Excluir esta hospedagem?")) return;
    await fetch(`/api/trips/${id}/accommodations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Hospedagem</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🏨</div>
          <p className="font-medium">Nenhuma hospedagem cadastrada</p>
          <p className="text-sm mt-1">Adicione hotéis, Airbnbs e pousadas da sua viagem.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {typeLabels[item.type]}
                      </span>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Check-in: {formatDate(item.checkIn)} → Check-out: {formatDate(item.checkOut)}</span>
                    </div>
                    {item.address && <p className="text-sm text-gray-500 mt-1">📍 {item.address}</p>}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      {item.confirmationNumber && <span>Confirmação: <strong>{item.confirmationNumber}</strong></span>}
                      {item.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {item.phone}
                        </span>
                      )}
                      {item.cost != null && <span className="text-green-700 font-medium">R$ {item.cost.toFixed(2)}</span>}
                    </div>
                    {item.notes && <p className="text-sm text-gray-400 mt-1 italic">{item.notes}</p>}
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Nova hospedagem</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="accom-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>Nome *</Label>
                <Input name="name" value={form.name} onChange={handleChange} required placeholder="Ex: Hotel Marriott" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select name="type" value={form.type} onChange={handleChange}>
                  {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Custo total</Label>
                <Input name="cost" type="number" min="0" step="0.01" value={form.cost} onChange={handleChange} placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Check-in *</Label>
                <Input name="checkIn" type="date" value={form.checkIn} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Check-out *</Label>
                <Input name="checkOut" type="date" value={form.checkOut} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Endereço completo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nº confirmação</Label>
                <Input name="confirmationNumber" value={form.confirmationNumber} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="accom-form" disabled={loading}>{loading ? "Salvando..." : "Adicionar"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
