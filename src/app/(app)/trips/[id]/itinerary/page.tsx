"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Clock, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDate, activityTypeLabel } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  cost: number | null;
  notes: string | null;
}

const activityTypeColors: Record<string, string> = {
  ACTIVITY: "bg-blue-50 border-blue-200 text-blue-700",
  MEAL: "bg-orange-50 border-orange-200 text-orange-700",
  TRANSPORT: "bg-purple-50 border-purple-200 text-purple-700",
  ACCOMMODATION: "bg-green-50 border-green-200 text-green-700",
  EVENT: "bg-pink-50 border-pink-200 text-pink-700",
  OTHER: "bg-gray-50 border-gray-200 text-gray-700",
};

export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "ACTIVITY",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    cost: "",
    notes: "",
  });

  async function load() {
    const res = await fetch(`/api/trips/${id}/activities`);
    if (res.ok) setActivities(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ title: "", type: "ACTIVITY", date: "", startTime: "", endTime: "", location: "", description: "", cost: "", notes: "" });
      load();
    }
  }

  async function handleDelete(activityId: string) {
    if (!confirm("Excluir esta atividade?")) return;
    await fetch(`/api/trips/${id}/activities`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });
    load();
  }

  const grouped = activities.reduce<Record<string, Activity[]>>((acc, a) => {
    const key = a.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Itinerário</h2>
        <Button onClick={() => setOpen(true)} className="gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Adicionar atividade
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📅</div>
          <p className="font-medium">Nenhuma atividade planejada</p>
          <p className="text-sm mt-1">Adicione atividades para montar seu roteiro dia a dia.</p>
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                {format(new Date(date + "T12:00:00"), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              <div className="space-y-2">
                {items.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${activityTypeColors[activity.type]}`}>
                              {activityTypeLabel(activity.type)}
                            </span>
                            <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                            {(activity.startTime || activity.endTime) && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {activity.startTime}{activity.endTime ? ` - ${activity.endTime}` : ""}
                              </span>
                            )}
                            {activity.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {activity.location}
                              </span>
                            )}
                            {activity.cost != null && (
                              <span className="text-green-700 font-medium">
                                R$ {activity.cost.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Nova atividade</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="activity-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Visita ao Louvre" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select name="type" value={form.type} onChange={handleChange}>
                  <option value="ACTIVITY">Atividade</option>
                  <option value="MEAL">Refeição</option>
                  <option value="TRANSPORT">Transporte</option>
                  <option value="ACCOMMODATION">Hospedagem</option>
                  <option value="EVENT">Evento</option>
                  <option value="OTHER">Outro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Horário início</Label>
                <Input name="startTime" type="time" value={form.startTime} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Horário fim</Label>
                <Input name="endTime" type="time" value={form.endTime} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input name="location" value={form.location} onChange={handleChange} placeholder="Nome do local" />
            </div>
            <div className="space-y-2">
              <Label>Custo estimado</Label>
              <Input name="cost" type="number" min="0" step="0.01" value={form.cost} onChange={handleChange} placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Informações adicionais..." />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="activity-form" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
