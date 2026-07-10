"use client";

import { useEffect, useState } from "react";
import {
  FileText, BookOpen, Route, Plane, Trash2,
  Search, RefreshCw, Star, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  title: string;
  destination: string;
  rating: number | null;
  publishedAsTip: boolean;
  createdAt: string;
  user: { name: string | null; email: string };
}
interface CommunityRoute {
  id: string;
  title: string;
  destination: string;
  continent: string;
  duration: number;
  createdAt: string;
  user: { name: string | null; email: string };
}
interface Trip {
  id: string;
  title: string;
  destination: string;
  status: string;
  createdAt: string;
  owner: { name: string | null; email: string };
}

type Tab = "experiences" | "routes" | "trips";

const STATUS_COLOR: Record<string, string> = {
  PLANNING: "bg-blue-500/20 text-blue-300",
  CONFIRMED: "bg-green-500/20 text-green-300",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-300",
  COMPLETED: "bg-slate-500/20 text-slate-400",
  CANCELLED: "bg-red-500/20 text-red-300",
};

export default function AdminContentPage() {
  const [data, setData] = useState<{ experiences: Experience[]; routes: CommunityRoute[]; trips: Trip[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("experiences");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/content");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteItem(type: string, id: string, label: string) {
    if (!confirm(`Excluir "${label}"? Esta ação é irreversível.`)) return;
    setDeletingId(id);
    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    if (res.ok) {
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          experiences: type === "experience" ? prev.experiences.filter(e => e.id !== id) : prev.experiences,
          routes: type === "route" ? prev.routes.filter(r => r.id !== id) : prev.routes,
          trips: type === "trip" ? prev.trips.filter(t => t.id !== id) : prev.trips,
        };
      });
    }
    setDeletingId(null);
  }

  const TABS: { key: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { key: "experiences", label: "Relatos", icon: BookOpen, count: data?.experiences.length ?? 0 },
    { key: "routes", label: "Roteiros", icon: Route, count: data?.routes.length ?? 0 },
    { key: "trips", label: "Viagens", icon: Plane, count: data?.trips.length ?? 0 },
  ];

  const q = search.toLowerCase();

  const experiences = (data?.experiences ?? []).filter(e =>
    !q || e.title.toLowerCase().includes(q) || e.destination.toLowerCase().includes(q) || e.user.email.includes(q)
  );
  const routes = (data?.routes ?? []).filter(r =>
    !q || r.title.toLowerCase().includes(q) || r.destination.toLowerCase().includes(q) || r.user.email.includes(q)
  );
  const trips = (data?.trips ?? []).filter(t =>
    !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q) || t.owner.email.includes(q)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <FileText className="h-[18px] w-[18px] text-violet-400" />
            </div>
            Moderação de Conteúdo
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie relatos, roteiros e viagens</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              tab === key
                ? "bg-white/10 text-white"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", tab === key ? "bg-white/10 text-slate-300" : "bg-white/5 text-slate-600")}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título, destino ou usuário..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>

      {/* Content table */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        {loading ? (
          <div className="p-8 text-center text-slate-600">Carregando...</div>
        ) : (
          <>
            {tab === "experiences" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <th className="text-left px-4 py-3">Título</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Autor</th>
                    <th className="text-center px-4 py-3">Nota</th>
                    <th className="text-center px-4 py-3 hidden lg:table-cell">Publicado</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Data</th>
                    <th className="text-right px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-slate-600">Nenhum relato encontrado.</td></tr>
                  ) : experiences.map(e => (
                    <tr key={e.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-slate-200 font-medium truncate max-w-xs">{e.title}</p>
                        <p className="text-slate-600 text-xs">{e.destination}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{e.user.name ?? e.user.email}</td>
                      <td className="px-4 py-3 text-center">
                        {e.rating ? (
                          <span className="flex items-center justify-center gap-1 text-yellow-400">
                            <Star className="h-3 w-3 fill-current" />{e.rating}
                          </span>
                        ) : <span className="text-slate-700">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        {e.publishedAsTip
                          ? <span className="text-[10px] bg-green-600/20 text-green-400 px-1.5 py-0.5 rounded-md font-bold">SIM</span>
                          : <span className="text-slate-700 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                        {new Date(e.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteItem("experience", e.id, e.title)}
                          disabled={deletingId === e.id}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-600/15 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "routes" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <th className="text-left px-4 py-3">Roteiro</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Autor</th>
                    <th className="text-center px-4 py-3">Duração</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Continente</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Data</th>
                    <th className="text-right px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-slate-600">Nenhum roteiro encontrado.</td></tr>
                  ) : routes.map(r => (
                    <tr key={r.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-slate-200 font-medium truncate max-w-xs">{r.title}</p>
                        <p className="text-slate-600 text-xs">{r.destination}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{r.user.name ?? r.user.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-slate-400 text-xs">{r.duration}d</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Globe className="h-3 w-3" />{r.continent}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                        {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteItem("route", r.id, r.title)}
                          disabled={deletingId === r.id}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-600/15 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "trips" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <th className="text-left px-4 py-3">Viagem</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Dono</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Data</th>
                    <th className="text-right px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-600">Nenhuma viagem encontrada.</td></tr>
                  ) : trips.map(t => (
                    <tr key={t.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-slate-200 font-medium truncate max-w-xs">{t.title}</p>
                        <p className="text-slate-600 text-xs">{t.destination}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{t.owner.name ?? t.owner.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", STATUS_COLOR[t.status] ?? "bg-slate-700/40 text-slate-400")}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteItem("trip", t.id, t.title)}
                          disabled={deletingId === t.id}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-600/15 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
