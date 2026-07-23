"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Check, X, RefreshCw, Route, BookOpen, MapPin, Clock } from "lucide-react";

interface PendingRoute {
  id: string;
  title: string;
  destination: string;
  authorName: string;
  duration: number;
  description: string;
  coverImage: string | null;
  createdAt: string;
  _count: { activities: number };
}
interface PendingExperience {
  id: string;
  title: string;
  destination: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
}

export default function ModerationPage() {
  const [routes, setRoutes] = useState<PendingRoute[]>([]);
  const [experiences, setExperiences] = useState<PendingExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/moderation");
    if (res.ok) {
      const d = await res.json();
      setRoutes(d.routes ?? []);
      setExperiences(d.experiences ?? []);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function moderar(type: "route" | "experience", id: string, action: "APPROVE" | "REJECT") {
    setBusy(id);
    const res = await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, action }),
    });
    if (res.ok) {
      if (type === "route") setRoutes((p) => p.filter((r) => r.id !== id));
      else setExperiences((p) => p.filter((e) => e.id !== id));
    }
    setBusy(null);
  }

  const total = routes.length + experiences.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Moderação</h1>
            <p className="text-xs text-slate-400">
              {total} {total === 1 ? "item aguardando" : "itens aguardando"} aprovação
            </p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors" aria-label="Atualizar">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Carregando…</p>
      ) : total === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-slate-700" />
          <p className="text-sm">Nada na fila. Tudo em dia! 🎉</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Roteiros */}
          {routes.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                <Route className="h-4 w-4 text-primary-400" /> Roteiros da comunidade ({routes.length})
              </h2>
              <div className="space-y-3">
                {routes.map((r) => (
                  <div key={r.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white">{r.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3" />{r.destination}
                          <Clock className="h-3 w-3 ml-1" />{r.duration} dias · {r._count.activities} atividades
                        </p>
                        <p className="text-xs text-slate-500 mt-1">por {r.authorName}</p>
                        <p className="text-sm text-slate-300 mt-2 line-clamp-3">{r.description}</p>
                      </div>
                      <ModButtons busy={busy === r.id} onApprove={() => moderar("route", r.id, "APPROVE")} onReject={() => moderar("route", r.id, "REJECT")} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Relatos */}
          {experiences.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                <BookOpen className="h-4 w-4 text-violet-400" /> Relatos de viagem ({experiences.length})
              </h2>
              <div className="space-y-3">
                {experiences.map((e) => (
                  <div key={e.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white">{e.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3" />{e.destination}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">por {e.user.name ?? e.user.email}</p>
                        <p className="text-sm text-slate-300 mt-2 line-clamp-3">{e.excerpt || e.content}</p>
                      </div>
                      <ModButtons busy={busy === e.id} onApprove={() => moderar("experience", e.id, "APPROVE")} onReject={() => moderar("experience", e.id, "REJECT")} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ModButtons({ busy, onApprove, onReject }: { busy: boolean; onApprove: () => void; onReject: () => void }) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        onClick={onApprove}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 disabled:opacity-50 transition-colors"
      >
        <Check className="h-3.5 w-3.5" /> Aprovar
      </button>
      <button
        onClick={onReject}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/15 text-red-300 border border-red-500/25 hover:bg-red-600/25 disabled:opacity-50 transition-colors"
      >
        <X className="h-3.5 w-3.5" /> Rejeitar
      </button>
    </div>
  );
}
