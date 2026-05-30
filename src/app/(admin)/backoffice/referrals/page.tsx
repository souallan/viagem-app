"use client";

import { useState, useEffect } from "react";
import { GitBranch, Users, Trophy, RefreshCw } from "lucide-react";

interface Referrer {
  id: string;
  name: string | null;
  email: string;
  referralCode: string;
  referredCount: number;
  createdAt: string;
}

interface ReferralStats {
  referrers: Referrer[];
  totalReferred: number;
  totalWithCode: number;
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/referrals");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-red-400" /> Referrals
          </h1>
          <p className="text-sm text-slate-500 mt-1">Usuários que indicaram amigos para o RoteiroApp</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 border border-white/8 hover:bg-white/5 transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">Total indicados</p>
          <p className="text-3xl font-black text-white">{data?.totalReferred ?? "—"}</p>
          <p className="text-xs text-slate-600 mt-1">usuários cadastrados via link</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">Com código ativo</p>
          <p className="text-3xl font-black text-white">{data?.totalWithCode ?? "—"}</p>
          <p className="text-xs text-slate-600 mt-1">usuários com link gerado</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-white">Ranking de indicações</span>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-600 text-sm">Carregando...</div>
        ) : !data || data.referrers.filter(r => r.referredCount > 0).length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">Nenhuma indicação registrada ainda.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6 bg-white/2">
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">#</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Usuário</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Código</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Indicações</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden md:table-cell">Membro desde</th>
              </tr>
            </thead>
            <tbody>
              {data.referrers.filter(r => r.referredCount > 0).map((r, i) => (
                <tr key={r.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-sm font-black ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-600" : "text-slate-700"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-white">{r.name ?? "—"}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{r.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-lg">{r.referralCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-600" />
                      <span className="text-sm font-bold text-white">{r.referredCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-600 hidden md:table-cell">
                    {new Date(r.createdAt).toLocaleDateString("pt-BR")}
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
