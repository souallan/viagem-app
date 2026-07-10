"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect } from "react";
import { MessageSquare, Trash2, RefreshCw, Search, Route } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  userName: string;
  createdAt: string;
  route: { id: string; title: string; destination: string };
  user: { id: string; email: string };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/comments");
    if (res.ok) setComments(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!(await confirmDialog("Excluir este comentário?"))) return;
    const res = await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setMsg("Comentário excluído."); load(); }
    else setMsg("Erro ao excluir.");
  }

  const filtered = comments.filter(c =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.userName.toLowerCase().includes(search.toLowerCase()) ||
    c.route.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-red-400" /> Comentários
          </h1>
          <p className="text-sm text-slate-500 mt-1">Modere os comentários dos roteiros da comunidade</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 border border-white/8 hover:bg-white/5 transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      {msg && (
        <div className="px-4 py-3 rounded-xl text-sm font-semibold bg-green-500/15 text-green-400 border border-green-500/20">{msg}</div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por texto, usuário ou roteiro..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20"
        />
      </div>

      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/6 bg-white/2 flex items-center justify-between">
          <span className="text-sm font-bold text-white">{filtered.length} comentários</span>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-600 text-sm">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">Nenhum comentário encontrado.</div>
        ) : (
          <div className="divide-y divide-white/4">
            {filtered.map(comment => (
              <div key={comment.id} className="p-4 hover:bg-white/2 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                    {comment.userName[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{comment.userName}</span>
                      <span className="text-[10px] text-slate-600">{comment.user.email}</span>
                      <span className="text-[10px] text-slate-700">
                        {new Date(comment.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-1">{comment.content}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                      <Route className="h-3 w-3" />
                      <span>{comment.route.title}</span>
                      <span className="text-slate-700">·</span>
                      <span>{comment.route.destination}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Excluir comentário"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
