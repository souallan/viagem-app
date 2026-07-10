"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState, useEffect } from "react";
import {
  FileText, Plus, Edit3, Trash2, Eye, EyeOff, Star, RefreshCw,
  Search, Video, MapPin, Tag, ChevronDown, ChevronUp,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  destination: string | null;
  videoUrl: string | null;
  published: boolean;
  featured: boolean;
  tags: string;
  createdAt: string;
  author: { name: string | null; email: string };
}

const EMPTY_FORM = {
  title: "", content: "", excerpt: "", coverImage: "",
  destination: "", videoUrl: "", tags: "", published: false, featured: false,
};

function getVideoEmbed(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const ytShort = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  return null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(post: Post) {
    setEditingId(post.id);
    setForm({
      title: post.title, content: "", excerpt: post.excerpt ?? "",
      coverImage: post.coverImage ?? "", destination: post.destination ?? "",
      videoUrl: post.videoUrl ?? "", tags: post.tags,
      published: post.published, featured: post.featured,
    });
    setShowForm(true);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setMsg("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;
    const res = await fetch("/api/admin/posts", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setMsg(editingId ? "✓ Post atualizado!" : "✓ Post criado!");
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? "Erro ao salvar.");
    }
  }

  async function togglePublished(post: Post) {
    await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    load();
  }

  async function toggleFeatured(post: Post) {
    await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, featured: !post.featured }),
    });
    load();
  }

  async function handleDelete(id: string, title: string) {
    if (!(await confirmDialog(`Deletar "${title}"?`))) return;
    await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.destination ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.tags ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-red-400" /> Publicações
          </h1>
          <p className="text-sm text-slate-500 mt-1">Crie artigos, guias de destinos e conteúdo SEO</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 border border-white/8 hover:bg-white/5 transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => showForm ? setShowForm(false) : startNew()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nova publicação"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${msg.startsWith("✓") ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
          {msg}
        </div>
      )}

      {/* ── Editor Form ── */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <h2 className="font-bold text-white text-lg">{editingId ? "Editar publicação" : "Nova publicação"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Título *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Ex: Roteiro Lisboa 7 Dias — O Guia Completo"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Destino / Cidade</label>
                <input
                  value={form.destination}
                  onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                  placeholder="Ex: Lisboa, Portugal"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><Tag className="h-3 w-3" /> Tags (vírgula)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                  placeholder="Ex: roteiro, europa, budget"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">URL da capa (imagem)</label>
                <input
                  value={form.coverImage}
                  onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><Video className="h-3 w-3" /> URL do vídeo (YouTube / TikTok / Instagram)</label>
                <input
                  value={form.videoUrl}
                  onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20"
                />
                {form.videoUrl && getVideoEmbed(form.videoUrl) && (
                  <p className="text-[10px] text-green-400">✓ YouTube detectado — será embutido na publicação</p>
                )}
                {form.videoUrl && !getVideoEmbed(form.videoUrl) && (
                  <p className="text-[10px] text-amber-400">Link de vídeo — aparecerá como botão de visualização</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Resumo / Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="Uma frase que aparece na listagem de posts e no Google..."
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Conteúdo * (Markdown ou texto)</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={12}
                  required={!editingId}
                  placeholder={`## Título da Seção\n\nTexto do artigo...\n\n## Por que escolher Lisboa?\n\nPortugal é o destino favorito dos brasileiros...`}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 resize-y font-mono"
                />
                {editingId && <p className="text-[10px] text-slate-600">Deixe em branco para manter o conteúdo atual.</p>}
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-500" />
                <span className="text-sm text-slate-300">Publicado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-amber-500" />
                <span className="text-sm text-slate-300">Destaque</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors">
                {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar publicação"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm text-slate-400 border border-white/8 hover:bg-white/5 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título, destino ou tag..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20"
        />
      </div>

      {/* ── Posts list ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-600">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            {posts.length === 0 ? "Nenhuma publicação ainda. Crie a primeira!" : "Nenhum resultado para a busca."}
          </div>
        ) : filtered.map(post => (
          <div key={post.id} className="rounded-2xl border border-white/6 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
            <div className="flex items-start gap-3">
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="w-16 h-12 rounded-lg object-cover shrink-0 bg-white/5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${post.published ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-slate-500"}`}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                  {post.featured && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">⭐ Destaque</span>}
                  {post.videoUrl && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1"><Video className="h-2.5 w-2.5" />Vídeo</span>}
                  {post.destination && <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{post.destination}</span>}
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{post.title}</h3>
                {post.excerpt && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{post.excerpt}</p>}
                <p className="text-[10px] text-slate-700 mt-1">
                  {new Date(post.createdAt).toLocaleDateString("pt-BR")} · {post.author.name ?? post.author.email}
                  {post.tags && ` · ${post.tags}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleFeatured(post)} title="Destaque" className={`p-1.5 rounded-lg transition-colors ${post.featured ? "text-amber-400 bg-amber-500/10" : "text-slate-700 hover:text-slate-400 hover:bg-white/5"}`}>
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => togglePublished(post)} title={post.published ? "Despublicar" : "Publicar"} className={`p-1.5 rounded-lg transition-colors ${post.published ? "text-green-400 bg-green-500/10" : "text-slate-700 hover:text-slate-400 hover:bg-white/5"}`}>
                  {post.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => startEdit(post)} className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-colors">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setExpandedContent(expandedContent === post.id ? null : post.id)} className="p-1.5 rounded-lg text-slate-700 hover:text-slate-400 hover:bg-white/5 transition-colors">
                  {expandedContent === post.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            {expandedContent === post.id && post.videoUrl && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-slate-600 mb-2">Vídeo vinculado: <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{post.videoUrl}</a></p>
                {getVideoEmbed(post.videoUrl) && (
                  <iframe src={getVideoEmbed(post.videoUrl)!} className="w-full rounded-xl" height="200" allow="autoplay; encrypted-media" allowFullScreen />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
