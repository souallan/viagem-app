"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Pencil, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface JournalEntry {
  id: string;
  date: string;
  title: string | null;
  content: string;
  mood: string | null;
}

const MOODS: { value: string; emoji: string; label: string; bg: string }[] = [
  { value: "AMAZING",     emoji: "🤩", label: "Incrível",     bg: "bg-yellow-50 border-yellow-300" },
  { value: "GREAT",       emoji: "😄", label: "Ótimo",        bg: "bg-green-50 border-green-300" },
  { value: "GOOD",        emoji: "😊", label: "Bom",          bg: "bg-blue-50 border-blue-300" },
  { value: "MIXED",       emoji: "😐", label: "Regular",      bg: "bg-gray-50 border-gray-300" },
  { value: "CHALLENGING", emoji: "😤", label: "Desafiador",   bg: "bg-red-50 border-red-300" },
];

const TODAY = new Date().toISOString().slice(0, 10);

function moodFor(v: string | null) {
  return MOODS.find(m => m.value === v) ?? null;
}

export default function JournalPage() {
  const { id } = useParams<{ id: string }>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const emptyForm = { date: TODAY, title: "", content: "", mood: "" };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    const res = await fetch(`/api/trips/${id}/journal`);
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry);
    setForm({
      date: entry.date.slice(0, 10),
      title: entry.title ?? "",
      content: entry.content,
      mood: entry.mood ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.content.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch(`/api/trips/${id}/journal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: editing.id, ...form, mood: form.mood || null, title: form.title || null }),
      });
    } else {
      await fetch(`/api/trips/${id}/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mood: form.mood || null, title: form.title || null }),
      });
    }
    setOpen(false);
    setSaving(false);
    load();
  }

  async function handleDelete(entryId: string) {
    if (!confirm("Excluir esta entrada do diário?")) return;
    setEntries(prev => prev.filter(e => e.id !== entryId));
    await fetch(`/api/trips/${id}/journal`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });
  }

  if (loading) return <div className="py-20 text-center text-gray-400">Carregando...</div>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Diário de bordo</h2>
          <p className="text-sm text-gray-400">Registre memórias e experiências da viagem</p>
        </div>
        <Button size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Nova entrada
        </Button>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📓</div>
          <p className="font-semibold text-gray-500">Nenhuma entrada ainda</p>
          <p className="text-sm mt-1">Comece a registrar suas memórias de viagem</p>
          <Button size="sm" onClick={openNew} className="mt-6 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Primeira entrada
          </Button>
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-4">
        {entries.map(entry => {
          const mood = moodFor(entry.mood);
          const date = new Date(entry.date.slice(0, 10) + "T12:00:00");
          const isExpanded = expandedId === entry.id;
          const preview = entry.content.length > 200 && !isExpanded ? entry.content.slice(0, 200) + "…" : entry.content;

          return (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              {/* Colored top bar based on mood */}
              <div className={cn("h-1.5", mood ? (
                mood.value === "AMAZING" ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                mood.value === "GREAT"   ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                mood.value === "GOOD"    ? "bg-gradient-to-r from-blue-400 to-sky-500" :
                mood.value === "MIXED"   ? "bg-gray-300" :
                "bg-gradient-to-r from-red-400 to-rose-500"
              ) : "bg-gradient-to-r from-primary-400 to-primary-600")} />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">
                        {format(date, "EEEE", { locale: ptBR })}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {mood && (
                      <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", mood.bg)}>
                        {mood.emoji} {mood.label}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(entry)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Pencil className="h-3 w-3 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </div>

                {entry.title && (
                  <h3 className="font-bold text-gray-900 mb-2">{entry.title}</h3>
                )}

                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{preview}</p>

                {entry.content.length > 200 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="text-xs text-primary-600 hover:underline mt-2 font-medium"
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar entrada" : "Nova entrada no diário"}</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Primeiro dia em Paris"
              />
            </div>
            <div>
              <Label>Como foi o dia?</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, mood: f.mood === m.value ? "" : m.value }))}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-all",
                      form.mood === m.value ? m.bg + " shadow-sm scale-105" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="content">Relato *</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Escreva sobre suas experiências, descobertas e memórias do dia..."
                rows={6}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || !form.content.trim()}>
            {saving ? "Salvando..." : editing ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
