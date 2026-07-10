"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";

interface Announcement {
  id: string;
  text: string;
  linkLabel: string | null;
  linkUrl: string | null;
  type: string;
  active: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  info:    { label: "Informativo", color: "text-blue-400 bg-blue-500/10" },
  success: { label: "Sucesso",     color: "text-green-400 bg-green-500/10" },
  warning: { label: "Atenção",     color: "text-amber-400 bg-amber-500/10" },
  promo:   { label: "Promoção",    color: "text-violet-400 bg-violet-500/10" },
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ text: "", linkLabel: "", linkUrl: "", type: "info" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/announcements");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setMsg("✓ Anúncio criado e ativado!"); setShowForm(false); setForm({ text: "", linkLabel: "", linkUrl: "", type: "info" }); load(); }
    else setMsg("Erro ao criar.");
  }

  async function toggleActive(item: Announcement) {
    await fetch("/api/admin/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, active: !item.active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!(await confirmDialog("Excluir anúncio?"))) return;
    await fetch("/api/admin/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-red-400" /> Anúncios do site
          </h1>
          <p className="text-sm text-slate-500 mt-1">Banner de notificação exibido no topo do app para todos os usuários</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 border border-white/8 hover:bg-white/5">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">
            <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Novo anúncio"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm text-amber-300 font-semibold">💡 Como funciona</p>
        <p className="text-xs text-amber-400/70 mt-1">Apenas 1 anúncio pode estar ativo por vez. Ao criar um novo, o anterior é automaticamente desativado. O banner aparece no topo do app para todos os usuários logados.</p>
      </div>

      {msg && <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${msg.startsWith("✓") ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>{msg}</div>}

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <h2 className="font-bold text-white">Novo anúncio</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Texto do anúncio *</label>
                <input
                  value={form.text}
                  onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  required
                  placeholder="Ex: 🎉 Nova funcionalidade disponível! Agora você pode compartilhar roteiros..."
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tipo</label>
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm focus:outline-none focus:border-white/20"
                >
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Label do link (opcional)</label>
                <input
                  value={form.linkLabel}
                  onChange={e => setForm(p => ({ ...p, linkLabel: e.target.value }))}
                  placeholder="Ex: Ver novidade →"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">URL do link (opcional)</label>
                <input
                  value={form.linkUrl}
                  onChange={e => setForm(p => ({ ...p, linkUrl: e.target.value }))}
                  placeholder="/pricing ou https://..."
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors">
                {saving ? "Salvando..." : "Criar e ativar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-slate-600">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-slate-600">Nenhum anúncio criado ainda.</div>
        ) : items.map(item => {
          const typeInfo = TYPE_LABELS[item.type] ?? TYPE_LABELS.info;
          return (
            <div key={item.id} className={`rounded-2xl border p-4 transition-colors ${item.active ? "border-green-500/20 bg-green-500/5" : "border-white/6 bg-white/[0.02]"}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                    {item.active && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">● Ativo agora</span>}
                  </div>
                  <p className="text-sm text-white font-medium">{item.text}</p>
                  {item.linkLabel && item.linkUrl && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.linkLabel} → {item.linkUrl}</p>
                  )}
                  <p className="text-[10px] text-slate-700 mt-1">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(item)} title={item.active ? "Desativar" : "Ativar"} className={`p-1.5 rounded-lg transition-colors ${item.active ? "text-green-400 hover:text-red-400" : "text-slate-600 hover:text-green-400"}`}>
                    {item.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
