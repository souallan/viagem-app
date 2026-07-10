"use client";
import { confirmDialog } from "@/lib/confirm";

import { useEffect, useState } from "react";
import { Mail, Trash2, Download, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  confirmedAt: string | null;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/newsletter");
    if (res.ok) {
      const data = await res.json();
      setSubscribers(data.subscribers ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, email: string) {
    if (!(await confirmDialog(`Remover ${email} da newsletter?`))) return;
    setDeleting(id);
    await fetch("/api/admin/newsletter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    load();
  }

  function exportCsv() {
    const csv = [
      "email,data_inscricao,confirmado",
      ...filtered.map((s) => [
        s.email,
        new Date(s.createdAt).toLocaleDateString("pt-BR"),
        s.confirmedAt ? "sim" : "nao",
      ].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter((s) =>
    !search.trim() || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Newsletter</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Carregando..." : `${subscribers.length} inscritos`}
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="w-9 h-9 rounded-xl bg-teal-600/20 flex items-center justify-center mb-3">
            <Users className="h-[18px] w-[18px] text-teal-400" />
          </div>
          <p className="text-2xl font-black text-white">{subscribers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total de inscritos</p>
        </div>
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center mb-3">
            <Mail className="h-[18px] w-[18px] text-green-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {subscribers.filter((s) => s.confirmedAt).length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Email confirmado</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email..."
          className="w-full h-10 rounded-xl border border-white/8 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/15 transition-all"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Inscrito em</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-600 text-sm">Carregando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-600 text-sm">
                    {search ? "Nenhum resultado para a busca." : "Nenhum inscrito ainda."}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm text-white font-medium">{sub.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">
                        {new Date(sub.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        sub.confirmedAt
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-500/20 text-slate-400"
                      )}>
                        {sub.confirmedAt ? "Confirmado" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        disabled={deleting === sub.id}
                        className="text-slate-700 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Remover inscrito"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
