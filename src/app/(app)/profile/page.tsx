"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  User, Mail, Lock, Camera, Save, LogOut,
  Plane, BookOpen, Route, CheckCircle2, AlertCircle, Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  stats: {
    trips: number;
    experiences: number;
    routes: number;
  };
}

function Avatar({ name, image, size = "lg" }: { name: string | null; image: string | null; size?: "sm" | "lg" }) {
  const initials = (name ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const cls = size === "lg"
    ? "w-24 h-24 text-3xl font-black rounded-3xl"
    : "w-10 h-10 text-base font-bold rounded-xl";

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name ?? "avatar"} className={cn(cls, "object-cover")} />;
  }

  return (
    <div
      className={cn(cls, "flex items-center justify-center text-white select-none")}
      style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)" }}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", image: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    const res = await fetch("/api/user");
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setProfileForm({ name: data.name ?? "", image: data.image ?? "" });
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profileForm.name, image: profileForm.image }),
    });
    setProfileSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setUser((prev) => prev ? { ...prev, name: updated.name, image: updated.image } : prev);
      setEditingProfile(false);
      setProfileMsg({ type: "ok", text: "Perfil atualizado com sucesso." });
    } else {
      const data = await res.json().catch(() => ({}));
      setProfileMsg({ type: "err", text: data.error ?? "Erro ao salvar perfil." });
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "err", text: "As senhas novas não coincidem." });
      return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: "err", text: "A nova senha deve ter no mínimo 8 caracteres." });
      return;
    }
    setPwSaving(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    });
    setPwSaving(false);
    if (res.ok) {
      setPwForm({ current: "", next: "", confirm: "" });
      setPwMsg({ type: "ok", text: "Senha alterada com sucesso." });
    } else {
      const data = await res.json().catch(() => ({}));
      setPwMsg({ type: "err", text: data.error ?? "Erro ao alterar senha." });
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-2xl">
        <div className="h-40 rounded-3xl bg-gray-100" />
        <div className="h-60 rounded-3xl bg-gray-100" />
        <div className="h-60 rounded-3xl bg-gray-100" />
      </div>
    );
  }

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const STATS = [
    { label: "Viagens",     value: user.stats.trips,       icon: Plane,   color: "text-primary-600",  bg: "bg-primary-50"  },
    { label: "Relatos",     value: user.stats.experiences,  icon: BookOpen,color: "text-violet-600",   bg: "bg-violet-50"   },
    { label: "Roteiros",    value: user.stats.routes,       icon: Route,   color: "text-orange-600",   bg: "bg-orange-50"   },
  ];

  return (
    <div className="max-w-2xl space-y-6 pb-12">

      {/* ── Header card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-500 via-violet-500 to-teal-500" />
        <div className="p-6 flex items-start gap-5">
          <div className="relative shrink-0">
            <Avatar name={user.name} image={user.image} size="lg" />
            <button
              onClick={() => setEditingProfile(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:border-primary-300 transition-colors"
              title="Editar foto"
            >
              <Camera className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 truncate">{user.name ?? "Sem nome"}</h1>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {user.email}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">Membro desde {joined}</p>
          </div>
          <button
            onClick={() => { setEditingProfile(true); setProfileMsg(null); }}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 border border-gray-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-4">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-1", bg)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <span className="text-2xl font-black text-gray-900">{value}</span>
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Profile edit form ── */}
      {editingProfile && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            Editar perfil
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL da foto de perfil</Label>
              <Input
                value={profileForm.image}
                onChange={(e) => setProfileForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
                type="url"
              />
              {profileForm.image && (
                <div className="mt-2 flex items-center gap-3">
                  <Avatar name={profileForm.name} image={profileForm.image} size="sm" />
                  <span className="text-xs text-gray-400">Pré-visualização</span>
                </div>
              )}
            </div>

            {profileMsg && (
              <div className={cn(
                "flex items-center gap-2 text-sm px-3 py-2 rounded-xl",
                profileMsg.type === "ok"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              )}>
                {profileMsg.type === "ok"
                  ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                  : <AlertCircle className="h-4 w-4 shrink-0" />}
                {profileMsg.text}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" disabled={profileSaving} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                {profileSaving ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setEditingProfile(false); setProfileMsg(null); }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Change password ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          Alterar senha
        </h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Senha atual</Label>
            <Input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nova senha</Label>
              <Input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar nova senha</Label>
              <Input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repetir senha"
                autoComplete="new-password"
              />
            </div>
          </div>

          {pwMsg && (
            <div className={cn(
              "flex items-center gap-2 text-sm px-3 py-2 rounded-xl",
              pwMsg.type === "ok"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-600 border border-red-100"
            )}>
              {pwMsg.type === "ok"
                ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                : <AlertCircle className="h-4 w-4 shrink-0" />}
              {pwMsg.text}
            </div>
          )}

          <Button type="submit" disabled={pwSaving} variant="outline" size="sm" className="gap-2">
            <Lock className="h-4 w-4" />
            {pwSaving ? "Alterando..." : "Alterar senha"}
          </Button>
        </form>
      </div>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LogOut className="h-4 w-4 text-red-400" />
          Sessão
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Você está logado como <span className="font-semibold text-gray-700">{user.email}</span>. Ao sair, será redirecionado para a tela de login.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
