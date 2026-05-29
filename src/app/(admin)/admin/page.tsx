"use client";

import { useEffect, useState } from "react";
import {
  Users, Plane, BookOpen, Route, TrendingUp, Clock,
  Shield, CheckCircle2, MapPin, Zap, Target, Activity,
  ArrowRight, Download, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  totals: { users: number; trips: number; experiences: number; routes: number; subscribers: number };
  recentUsers: { id: string; name: string | null; email: string; role: string; createdAt: string }[];
  recentTrips: { id: string; title: string; destination: string; status: string; createdAt: string; owner: { name: string | null; email: string } }[];
  tripsByStatus: { status: string; _count: { id: number } }[];
}

interface Analytics {
  topDestinations: { destination: string; count: number }[];
  featureAdoption: { feature: string; count: number; icon: string }[];
  userCohorts: { zero: number; one: number; two_to_five: number; six_plus: number };
  activityTypes: { type: string; count: number }[];
  transportTypes: { type: string; count: number }[];
}

const STATUS_COLOR: Record<string, string> = {
  PLANNING: "bg-blue-500/20 text-blue-300",
  CONFIRMED: "bg-green-500/20 text-green-300",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-300",
  COMPLETED: "bg-slate-500/20 text-slate-400",
  CANCELLED: "bg-red-500/20 text-red-300",
};

const STATUS_LABEL: Record<string, string> = {
  PLANNING: "Planejando", CONFIRMED: "Confirmada", IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída", CANCELLED: "Cancelada",
};

function KPI({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-2xl font-black text-white leading-none">{typeof value === "number" ? value.toLocaleString("pt-BR") : value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-slate-700 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/analytics").then(r => r.json()),
    ]).then(([s, a]) => { setStats(s); setAnalytics(a); }).finally(() => setLoading(false));
  }, []);

  async function handleBackup() {
    setBackupLoading(true);
    const res = await fetch("/api/admin/backup");
    setBackupLoading(false);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roteiroapp-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-white/5" />
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-white/5" />)}</div>
        <div className="grid grid-cols-2 gap-5">{[...Array(2)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-white/5" />)}</div>
      </div>
    );
  }

  if (!stats) return null;

  const { totals, recentUsers, recentTrips, tripsByStatus } = stats;
  const totalCohort = analytics ? Object.values(analytics.userCohorts).reduce((a, b) => a + b, 0) : 0;
  const dormantPct = analytics && totalCohort > 0
    ? Math.round((analytics.userCohorts.zero / totalCohort) * 100)
    : 0;
  const activeUserCount = analytics ? totalCohort - analytics.userCohorts.zero : 0;
  const engagementRate = totalCohort > 0 ? Math.round((activeUserCount / totalCohort) * 100) : 0;
  const topDest = analytics?.topDestinations[0]?.destination ?? "—";
  const topFeature = analytics?.featureAdoption[0]?.feature ?? "—";
  const topTransport = analytics?.transportTypes[0]?.type ?? "—";
  const TRANSPORT_LABEL: Record<string, string> = { FLIGHT: "Voo ✈️", BUS: "Ônibus 🚌", TRAIN: "Trem 🚆", CAR: "Carro 🚗", BOAT: "Barco ⛵" };

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-red-400" />
            </div>
            Painel Admin
          </h1>
          <p className="text-slate-500 text-sm mt-1">Visão executiva do RoteiroApp</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors border border-green-500/20 hover:border-green-400/40 px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {backupLoading ? "Gerando..." : "Backup"}
          </button>
          <Link href="/admin/stats" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 hover:border-blue-400/40 px-3 py-1.5 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5" /> Analytics <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPI label="Usuários" value={totals.users} icon={Users} color="bg-blue-600/20 text-blue-400" sub="cadastrados" />
        <KPI label="Viagens" value={totals.trips} icon={Plane} color="bg-violet-600/20 text-violet-400" sub="criadas" />
        <KPI label="Relatos" value={totals.experiences} icon={BookOpen} color="bg-pink-600/20 text-pink-400" sub="publicados" />
        <KPI label="Roteiros" value={totals.routes} icon={Route} color="bg-orange-600/20 text-orange-400" sub="comunidade" />
        <KPI label="Newsletter" value={totals.subscribers ?? 0} icon={Mail} color="bg-teal-600/20 text-teal-400" sub="inscritos" />
      </div>

      {/* Behavioral snapshot */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
            <Activity className="h-2.5 w-2.5" /> Engajamento
          </p>
          <p className="text-2xl font-black text-white">{engagementRate}%</p>
          <p className="text-[10px] text-slate-600 mt-1">usuários com ≥1 viagem</p>
          {dormantPct > 0 && <p className="text-[9px] text-yellow-600 mt-1">{dormantPct}% inativos</p>}
        </div>
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" /> Top destino
          </p>
          <p className="text-xl font-black text-white leading-tight break-words">{topDest}</p>
          <p className="text-[10px] text-slate-600 mt-1">mais planejado</p>
        </div>
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
            <Zap className="h-2.5 w-2.5" /> Feature mais usada
          </p>
          <p className="text-sm font-black text-white leading-tight">{topFeature}</p>
          <p className="text-[10px] text-slate-600 mt-1">funcionalidade líder</p>
        </div>
        <div className="rounded-2xl border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
            <Target className="h-2.5 w-2.5" /> Transporte líder
          </p>
          <p className="text-lg font-black text-white leading-tight">{TRANSPORT_LABEL[topTransport] ?? topTransport}</p>
          <p className="text-[10px] text-slate-600 mt-1">modal preferido</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />Usuários recentes
            </h2>
            <Link href="/admin/users" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Ver todos →</Link>
          </div>
          <div className="space-y-2">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/4 last:border-0">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold", u.role === "ADMIN" ? "bg-red-600/20 text-red-300" : "bg-blue-600/20 text-blue-300")}>
                  {(u.name ?? u.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{u.name ?? "Sem nome"}</p>
                  <p className="text-[10px] text-slate-600 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {u.role === "ADMIN" && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-600/20 text-red-400">ADM</span>}
                  <Clock className="h-3 w-3 text-slate-800" />
                  <span className="text-[9px] text-slate-700">{new Date(u.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Plane className="h-4 w-4 text-violet-400" />Viagens recentes
            </h2>
            <Link href="/admin/content" className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors">Ver conteúdo →</Link>
          </div>
          <div className="space-y-2">
            {recentTrips.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-white/4 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{t.title}</p>
                  <p className="text-[10px] text-slate-600 truncate">{t.destination} · {t.owner.name ?? t.owner.email}</p>
                </div>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0", STATUS_COLOR[t.status] ?? "bg-slate-700/40 text-slate-400")}>
                  {STATUS_LABEL[t.status] ?? t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status pills + System */}
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <h2 className="text-sm font-bold text-slate-300 mb-3">Viagens por status</h2>
          <div className="flex flex-wrap gap-2">
            {tripsByStatus.map(({ status, _count }) => (
              <span key={status} className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", STATUS_COLOR[status] ?? "bg-slate-700/40 text-slate-400")}>
                {STATUS_LABEL[status] ?? status}: {_count.id}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/6 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />Sistema
          </h2>
          <div className="space-y-2">
            {[
              { label: "Banco de dados", ok: true },
              { label: "NextAuth (JWT)", ok: true },
              { label: "APIs protegidas", ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", ok ? "bg-green-400" : "bg-red-400")} />
                <span className="text-xs text-slate-500">{label}</span>
                <span className={cn("ml-auto text-[9px] font-bold px-1 py-0.5 rounded", ok ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400")}>
                  {ok ? "OK" : "ERRO"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
