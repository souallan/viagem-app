"use client";

import { useState, useEffect } from "react";
import { ScrollText, Search, RefreshCw, User, Shield, Trash2, Lock, Mail } from "lucide-react";

interface AuditEntry {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetId: string | null;
  targetType: string | null;
  detail: string | null;
  ip: string | null;
  createdAt: string;
}

const ACTION_META: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  USER_DELETE:      { label: "Usuário excluído",  color: "text-red-400 bg-red-900/20",    Icon: Trash2 },
  USER_ROLE_CHANGE: { label: "Role alterado",     color: "text-amber-400 bg-amber-900/20", Icon: Shield },
  USER_BAN:         { label: "Usuário banido",    color: "text-red-400 bg-red-900/20",    Icon: Lock   },
  USER_UNBAN:       { label: "Usuário desbanido", color: "text-green-400 bg-green-900/20", Icon: Lock   },
  ACCOUNT_DELETE:   { label: "Conta excluída",    color: "text-red-400 bg-red-900/20",    Icon: Trash2 },
  EMAIL_VERIFIED:   { label: "Email verificado",  color: "text-blue-400 bg-blue-900/20",  Icon: Mail   },
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/audit");
    if (res.ok) setLogs(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = logs.filter((l) =>
    l.actorEmail.includes(search) || l.action.includes(search.toUpperCase()) || (l.detail ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-red-400" /> Log de Auditoria
          </h1>
          <p className="text-sm text-slate-500 mt-1">Últimas 100 ações — ordem decrescente</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 border border-white/8 hover:bg-white/5 transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email, ação ou detalhe..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20"
        />
      </div>

      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6 bg-white/2">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Ação</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Ator</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden md:table-cell">Detalhe</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden lg:table-cell">IP</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-600">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-600">Nenhum registro encontrado.</td></tr>
            ) : filtered.map((log) => {
              const meta = ACTION_META[log.action] ?? { label: log.action, color: "text-slate-400 bg-white/4", Icon: User };
              const { Icon } = meta;
              return (
                <tr key={log.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${meta.color}`}>
                      <Icon className="h-3 w-3" /> {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 font-mono">{log.actorEmail}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 hidden md:table-cell max-w-xs truncate">{log.detail ?? "—"}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-700 font-mono hidden lg:table-cell">{log.ip ?? "—"}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-600 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
