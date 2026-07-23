"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PrepItem {
  id: string;
  title: string;
  category: string;
  isDone: boolean;
  dueDate: string | null;
  notes: string | null;
}

const CATEGORIES: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  DOCUMENTOS:  { label: "Documentos",   emoji: "📄", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  SAUDE:       { label: "Saúde",        emoji: "💊", color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
  FINANCEIRO:  { label: "Financeiro",   emoji: "💳", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  BAGAGEM:     { label: "Bagagem",      emoji: "🧳", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  HOSPEDAGEM:  { label: "Hospedagem",   emoji: "🏨", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  TRANSPORTE:  { label: "Transporte",   emoji: "✈️", color: "text-primary-700",    bg: "bg-primary-50",    border: "border-primary-200" },
  OUTRO:       { label: "Outro",        emoji: "📌", color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200" },
};

const TEMPLATES: { title: string; category: string }[] = [
  { title: "Verificar validade do passaporte", category: "DOCUMENTOS" },
  { title: "Solicitar visto", category: "DOCUMENTOS" },
  { title: "Imprimir passagens aéreas", category: "DOCUMENTOS" },
  { title: "Imprimir vouchers de hotel", category: "DOCUMENTOS" },
  { title: "Tirar cópias dos documentos", category: "DOCUMENTOS" },
  { title: "Contratar seguro viagem", category: "SAUDE" },
  { title: "Vacinas necessárias", category: "SAUDE" },
  { title: "Receitas e medicamentos", category: "SAUDE" },
  { title: "Kit primeiros socorros", category: "SAUDE" },
  { title: "Avisar o banco sobre a viagem", category: "FINANCEIRO" },
  { title: "Trocar moeda local", category: "FINANCEIRO" },
  { title: "Verificar limite do cartão", category: "FINANCEIRO" },
  { title: "Pesquisar taxas de câmbio", category: "FINANCEIRO" },
  { title: "Confirmar reservas de hotel", category: "HOSPEDAGEM" },
  { title: "Confirmar transfer/traslado", category: "TRANSPORTE" },
  { title: "Fazer check-in online", category: "TRANSPORTE" },
  { title: "Verificar bagagem permitida", category: "BAGAGEM" },
  { title: "Adaptador de tomada", category: "BAGAGEM" },
  { title: "Carregar eletrônicos", category: "BAGAGEM" },
];

const TODAY = new Date().toISOString().slice(0, 10);

export default function PrepPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<PrepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({ title: "", category: "OUTRO", dueDate: "", notes: "" });

  const load = useCallback(async () => {
    const res = await fetch(`/api/trips/${id}/prep`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const [seeding, setSeeding] = useState(false);
  async function handleSeed() {
    setSeeding(true);
    await fetch(`/api/trips/${id}/prep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    setSeeding(false);
    load();
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    await fetch(`/api/trips/${id}/prep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", category: "OUTRO", dueDate: "", notes: "" });
    setOpen(false);
    setSaving(false);
    load();
  }

  async function handleToggle(item: PrepItem) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isDone: !i.isDone } : i));
    await fetch(`/api/trips/${id}/prep`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, isDone: !item.isDone }),
    });
  }

  async function handleDelete(itemId: string) {
    setItems(prev => prev.filter(i => i.id !== itemId));
    await fetch(`/api/trips/${id}/prep`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
  }

  async function addTemplate(t: { title: string; category: string }) {
    await fetch(`/api/trips/${id}/prep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    });
    load();
  }

  const total = items.length;
  const done = items.filter(i => i.isDone).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const grouped: Record<string, PrepItem[]> = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  if (loading) return <div className="py-20 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Preparativos da viagem</h2>
          <p className="text-sm text-gray-500">Organize tudo antes de partir</p>
        </div>
        <div className="flex gap-2">
          {total > 0 && (
            <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {seeding ? "Gerando…" : "Lembretes com prazo"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(v => !v)} className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {showTemplates ? "Ocultar" : "Sugestões"}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </Button>
        </div>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">{done} de {total} tarefas concluídas</p>
              <p className="text-xs text-gray-500">{pct === 100 ? "🎉 Tudo pronto para a viagem!" : `Faltam ${total - done} tarefa${total - done !== 1 ? "s" : ""}`}</p>
            </div>
            <span className={cn("text-2xl font-black", pct === 100 ? "text-green-600" : pct >= 60 ? "text-amber-600" : "text-primary-600")}>
              {pct}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-primary-500")}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Template suggestions */}
      {showTemplates && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wide">Sugestões de tarefas</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.filter(t => !items.some(i => i.title === t.title)).map(t => {
              const cfg = CATEGORIES[t.category];
              return (
                <button
                  key={t.title}
                  onClick={() => addTemplate(t)}
                  className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5", cfg.bg, cfg.color, cfg.border)}
                >
                  <Plus className="h-2.5 w-2.5" />
                  {cfg.emoji} {t.title}
                </button>
              );
            })}
            {TEMPLATES.filter(t => !items.some(i => i.title === t.title)).length === 0 && (
              <p className="text-xs text-amber-600">Todas as sugestões já foram adicionadas!</p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {total === 0 && !showTemplates && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-gray-500">Nenhuma tarefa ainda</p>
          <p className="text-sm mt-1">Comece com os lembretes essenciais — nós calculamos os prazos pela sua data de ida.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Button size="sm" onClick={handleSeed} disabled={seeding} className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> {seeding ? "Gerando…" : "Gerar lembretes recomendados"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Ver sugestões
            </Button>
          </div>
        </div>
      )}

      {/* Grouped items */}
      {Object.entries(grouped).map(([cat, catItems]) => {
        const cfg = CATEGORIES[cat] ?? CATEGORIES.OUTRO;
        const catDone = catItems.filter(i => i.isDone).length;
        const isCollapsed = collapsed[cat];
        return (
          <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setCollapsed(v => ({ ...v, [cat]: !v[cat] }))}
            >
              <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border", cfg.bg, cfg.color, cfg.border)}>
                {cfg.emoji} {cfg.label}
              </span>
              <span className="text-xs text-gray-500 font-medium">{catDone}/{catItems.length}</span>
              <div className="flex-1" />
              {isCollapsed ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronUp className="h-4 w-4 text-gray-500" />}
            </button>

            {!isCollapsed && (
              <div className="divide-y divide-gray-50 border-t border-gray-100">
                {catItems.map(item => (
                  <div key={item.id} className={cn("flex items-start gap-3 px-5 py-3.5 group transition-colors", item.isDone && "bg-gray-50/50")}>
                    <button onClick={() => handleToggle(item)} className="mt-0.5 shrink-0">
                      {item.isDone
                        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                        : <Circle className="h-5 w-5 text-gray-300 group-hover:text-gray-500" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium text-gray-900", item.isDone && "line-through text-gray-500")}>
                        {item.title}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 mt-0.5">
                        {item.dueDate && (
                          <span className="text-[11px] text-gray-500">
                            até {new Date(item.dueDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                          </span>
                        )}
                        {item.notes && (
                          <span className="text-[11px] text-gray-500 truncate max-w-[200px]">{item.notes}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all shrink-0 mt-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tarefa *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Verificar validade do passaporte"
                onKeyDown={e => e.key === "Enter" && handleSave()}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                id="category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Prazo (opcional)</Label>
              <Input
                id="dueDate"
                type="date"
                min={TODAY}
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Detalhes adicionais..."
                rows={2}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
            {saving ? "Salvando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
