"use client";
import { toast } from "@/lib/toast";
import { confirmDialog } from "@/lib/confirm";

import { useEffect, useState } from "react";
import {
  Users, Shield, Trash2, Crown, User as UserIcon,
  Search, RefreshCw, Plane, BookOpen, Route, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan?: string;
  planExpiresAt?: string | null;
  stripeSubscriptionId?: string | null;
  image: string | null;
  createdAt: string;
  _count: { trips: number; experiences: number; communityRoutes: number };
}

/** Premium vigente = plano PREMIUM e ainda dentro do prazo (ou sem prazo). */
function premiumAtivo(u: AdminUser): boolean {
  if (u.plan !== "PREMIUM") return false;
  return !u.planExpiresAt || new Date(u.planExpiresAt) > new Date();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(id: string, currentRole: string) {
    setUpdatingId(id);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
    setUpdatingId(null);
  }

  /** Concede Premium por N meses (cortesia, suporte, teste, influenciador). */
  async function concederPremium(u: AdminUser) {
    const resposta = window.prompt(
      `Conceder Premium a ${u.email}\n\nPor quantos meses? (1 a 120)` +
        (premiumAtivo(u) ? "\n\nJá é Premium — os meses serão SOMADOS ao prazo atual." : ""),
      "12"
    );
    if (resposta === null) return;

    const meses = Number(resposta.trim());
    if (!Number.isFinite(meses) || meses < 1 || meses > 120) {
      toast("Informe um número de 1 a 120.", "error");
      return;
    }

    setUpdatingId(u.id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, action: "GRANT_PREMIUM", meses }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setUsers(prev => prev.map(x => x.id === u.id
        ? { ...x, plan: data.plan, planExpiresAt: data.planExpiresAt }
        : x));
      toast(`Premium até ${new Date(data.planExpiresAt).toLocaleDateString("pt-BR")}.`, "success");
    } else {
      toast(data.error ?? "Não foi possível conceder.", "error");
    }
    setUpdatingId(null);
  }

  async function removerPremium(u: AdminUser) {
    if (!(await confirmDialog(`Remover o Premium de ${u.email}?`))) return;

    setUpdatingId(u.id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, action: "REVOKE_PREMIUM" }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setUsers(prev => prev.map(x => x.id === u.id
        ? { ...x, plan: "FREE", planExpiresAt: null }
        : x));
      toast("Premium removido.", "success");
    } else {
      // O 409 avisa que existe assinatura ativa na Stripe.
      toast(data.error ?? "Não foi possível remover.", "error");
    }
    setUpdatingId(null);
  }

  async function deleteUser(id: string, email: string) {
    if (!(await confirmDialog(`Excluir usuário ${email}? Esta ação é irreversível.`))) return;
    setDeletingId(id);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      toast(data.error ?? "Erro ao excluir.");
    }
    setDeletingId(null);
  }

  const filtered = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === "ADMIN").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Users className="h-[18px] w-[18px] text-blue-400" />
            </div>
            Gerenciar Usuários
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} usuários · {adminCount} admin{adminCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        {loading ? (
          <div className="p-8 text-center text-slate-600">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-600">Nenhum usuário encontrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <th className="text-left px-4 py-3">Usuário</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Desde</th>
                <th className="text-center px-4 py-3 hidden lg:table-cell">Viagens</th>
                <th className="text-center px-4 py-3 hidden lg:table-cell">Relatos</th>
                <th className="text-center px-4 py-3 hidden lg:table-cell">Roteiros</th>
                <th className="text-center px-4 py-3">Papel</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold", u.role === "ADMIN" ? "bg-red-600/20 text-red-300" : "bg-blue-600/20 text-blue-300")}>
                        {u.role === "ADMIN" ? <Shield className="h-4 w-4" /> : (u.name ?? u.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-200 font-medium truncate">{u.name ?? "Sem nome"}</p>
                        <p className="text-slate-600 text-xs truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="flex items-center justify-center gap-1 text-slate-500">
                      <Plane className="h-3 w-3" />{u._count.trips}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="flex items-center justify-center gap-1 text-slate-500">
                      <BookOpen className="h-3 w-3" />{u._count.experiences}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="flex items-center justify-center gap-1 text-slate-500">
                      <Route className="h-3 w-3" />{u._count.communityRoutes}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg", u.role === "ADMIN" ? "bg-red-600/20 text-red-400" : "bg-slate-700/40 text-slate-500")}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        disabled={updatingId === u.id}
                        title={u.role === "ADMIN" ? "Remover admin" : "Tornar admin"}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          u.role === "ADMIN"
                            ? "text-red-400 hover:bg-red-600/15"
                            : "text-slate-500 hover:text-yellow-400 hover:bg-yellow-600/15"
                        )}
                      >
                        {u.role === "ADMIN" ? <UserIcon className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
                      </button>
                      {/* Premium: conceder (cortesia/suporte) ou remover.
                          Assinante pagante é bloqueado pela API — revogar aqui
                          não interromperia a cobrança na Stripe. */}
                      {premiumAtivo(u) ? (
                        <button
                          onClick={() => removerPremium(u)}
                          disabled={updatingId === u.id}
                          title={
                            u.stripeSubscriptionId
                              ? "Assinante pagante — cancele pela Stripe"
                              : `Premium até ${u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString("pt-BR") : "sem prazo"} · clique para remover`
                          }
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-600/15 transition-colors"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => concederPremium(u)}
                          disabled={updatingId === u.id}
                          title="Conceder Premium"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-600/15 transition-colors"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        disabled={deletingId === u.id}
                        title="Excluir usuário"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-600/15 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
