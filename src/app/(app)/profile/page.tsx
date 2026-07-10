"use client";
import { toast } from "@/lib/toast";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  User, Mail, Lock, Camera, Save, LogOut,
  Plane, BookOpen, Route, CheckCircle2, AlertCircle, Pencil,
  Download, Trash2, ShieldAlert, Globe, DollarSign, FileText,
  Share2, Copy, Check, Users, Crown, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  country: string | null;
  currency: string | null;
  bio: string | null;
  createdAt: string;
  plan?: string;
  isPremium?: boolean;
  planExpiresAt?: string | null;
  stats: {
    trips: number;
    experiences: number;
    routes: number;
  };
}

const CURRENCY_CODES = ["BRL","USD","EUR","GBP","ARS","CLP","COP","MXN","JPY","CNY","AUD","CAD"] as const;

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
  const { t } = useLanguage();
  const tp = t.profile;
  const CURRENCIES = CURRENCY_CODES.map((code) => ({
    code,
    label: (tp.currencies as Record<string, string>)[code] ?? code,
  }));
  const COUNTRIES = tp.countries as unknown as string[];

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", image: "", country: "", currency: "BRL", bio: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Referral state
  const [referral, setReferral] = useState<{ code: string; referredCount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // LGPD state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Assinatura (portal do Stripe)
  const [portalLoading, setPortalLoading] = useState(false);
  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast(data.error || "Não foi possível abrir o portal de assinatura.");
    } catch {
      toast("Não foi possível abrir o portal de assinatura.");
    } finally {
      setPortalLoading(false);
    }
  }

  // Saldos de grupo (quanto devo / me devem por viagem)
  const [groupBalances, setGroupBalances] = useState<{ tripId: string; title: string; currency: string; net: number }[]>([]);
  const fmtBRL = (v: number, cur: string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: cur || "BRL" }).format(v);

  async function load() {
    const res = await fetch("/api/user");
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setProfileForm({ name: data.name ?? "", image: data.image ?? "", country: data.country ?? "", currency: data.currency ?? "BRL", bio: data.bio ?? "" });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    fetch("/api/referral").then(r => r.ok ? r.json() : null).then(d => { if (d) setReferral(d); });
    fetch("/api/user/group-balances").then(r => r.ok ? r.json() : []).then(d => setGroupBalances(Array.isArray(d) ? d : []));
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profileForm.name, image: profileForm.image, country: profileForm.country, currency: profileForm.currency, bio: profileForm.bio }),
    });
    setProfileSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setUser((prev) => prev ? { ...prev, name: updated.name, image: updated.image, country: updated.country, currency: updated.currency, bio: updated.bio } : prev);
      setEditingProfile(false);
      setProfileMsg({ type: "ok", text: tp.savedOk });
    } else {
      const data = await res.json().catch(() => ({}));
      setProfileMsg({ type: "err", text: data.error ?? tp.savedErr });
    }
  }

  async function handleExport() {
    setExportLoading(true);
    const res = await fetch("/api/user/export");
    setExportLoading(false);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roteiroapp-dados-${user?.id?.slice(0, 8) ?? "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleting(true);
    setDeleteMsg(null);
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deleteConfirm }),
    });
    setDeleting(false);
    if (res.ok) {
      await signOut({ callbackUrl: "/login" });
    } else {
      const data = await res.json().catch(() => ({}));
      setDeleteMsg({ type: "err", text: data.error ?? tp.deleteErr });
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "err", text: tp.pwNoMatch });
      return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: "err", text: tp.pwTooShort });
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
      setPwMsg({ type: "ok", text: tp.pwOk });
    } else {
      const data = await res.json().catch(() => ({}));
      setPwMsg({ type: "err", text: data.error ?? tp.pwErr });
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
    { label: tp.statsTrips,       value: user.stats.trips,       icon: Plane,    color: "text-primary-600", bg: "bg-primary-50" },
    { label: tp.statsExperiences, value: user.stats.experiences,  icon: BookOpen, color: "text-violet-600",  bg: "bg-violet-50"  },
    { label: tp.statsRoutes,      value: user.stats.routes,       icon: Route,    color: "text-orange-600",  bg: "bg-orange-50"  },
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900 truncate">{user.name ?? tp.noName}</h1>
              {user.isPremium && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <Crown className="h-3 w-3" /> PREMIUM
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {user.email}
            </p>
            {user.bio && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{user.bio}</p>}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {user.country && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Globe className="h-3 w-3" />{user.country}
                </span>
              )}
              {user.currency && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <DollarSign className="h-3 w-3" />{user.currency}
                </span>
              )}
              <span className="text-xs text-gray-400">{tp.memberSince} {joined}</span>
              {user.isPremium ? (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 disabled:opacity-60"
                >
                  <Crown className="h-3 w-3" />
                  {portalLoading ? "Abrindo…" : "Gerenciar assinatura"}
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <Sparkles className="h-3 w-3" />
                  Seja Premium
                </Link>
              )}
            </div>
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

      {/* ── Contas em grupo (quanto devo / me devem) ── */}
      {groupBalances.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary-500" />
            Suas contas em grupo
          </h2>
          <div className="space-y-2">
            {groupBalances.map((g) => {
              const settled = Math.abs(g.net) < 0.005;
              return (
                <Link
                  key={g.tripId}
                  href={`/trips/${g.tripId}/budget`}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 hover:border-primary-200 hover:bg-gray-50 transition-colors"
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", settled ? "bg-gray-100" : g.net > 0 ? "bg-emerald-50" : "bg-rose-50")}>
                    <Plane className={cn("h-4 w-4", settled ? "text-gray-400" : g.net > 0 ? "text-emerald-600" : "text-rose-500")} />
                  </div>
                  <span className="flex-1 min-w-0 truncate font-semibold text-gray-900">{g.title}</span>
                  {settled ? (
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> quitado</span>
                  ) : (
                    <div className="text-right">
                      <span className={cn("block text-[10px] font-bold uppercase tracking-wide", g.net > 0 ? "text-emerald-500" : "text-rose-400")}>
                        {g.net > 0 ? "te devem" : "você deve"}
                      </span>
                      <span className={cn("block text-sm font-black", g.net > 0 ? "text-emerald-600" : "text-rose-600")}>
                        {fmtBRL(Math.abs(g.net), g.currency)}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">Saldo das viagens em grupo onde você é participante. Toque para acertar as contas.</p>
        </div>
      )}

      {/* ── Profile edit form ── */}
      {editingProfile && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            {tp.editProfileTitle}
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{tp.fieldName}</Label>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={tp.namePlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{tp.fieldImage}</Label>
              <Input
                value={profileForm.image}
                onChange={(e) => setProfileForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
                type="url"
              />
              {profileForm.image && (
                <div className="mt-2 flex items-center gap-3">
                  <Avatar name={profileForm.name} image={profileForm.image} size="sm" />
                  <span className="text-xs text-gray-400">{tp.preview}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-gray-400" />{tp.fieldCountry}</Label>
                <select
                  value={profileForm.country}
                  onChange={(e) => setProfileForm((p) => ({ ...p, country: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
                >
                  <option value="">{tp.selectCountry}</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-gray-400" />{tp.fieldCurrency}</Label>
                <select
                  value={profileForm.currency}
                  onChange={(e) => setProfileForm((p) => ({ ...p, currency: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
                >
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-gray-400" />{tp.fieldBio} <span className="text-gray-400 font-normal">({tp.bioHint})</span></Label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder={tp.bioPlaceholder}
                maxLength={300}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{profileForm.bio.length}/300</p>
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
                {profileSaving ? tp.saving : t.common.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setEditingProfile(false); setProfileMsg(null); }}
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Change password ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          {tp.changePwTitle}
        </h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{tp.currentPw}</Label>
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
              <Label>{tp.newPw}</Label>
              <Input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{tp.confirmPw}</Label>
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
            {pwSaving ? tp.changing : tp.changePwBtn}
          </Button>
        </form>
      </div>

      {/* ── Sessão ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LogOut className="h-4 w-4 text-red-400" />
          {tp.sessionTitle}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {tp.sessionDesc} <span className="font-semibold text-gray-700">{user.email}</span>. {tp.sessionDesc2}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="h-4 w-4" />
          {tp.signOut}
        </Button>
      </div>

      {/* ── Convite de amigos ── */}
      {referral && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-500" />
            {tp.referralTitle}
          </h2>
          <p className="text-sm text-gray-500 -mt-1">{tp.referralDesc}</p>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50 border border-blue-100">
            <code className="flex-1 text-sm font-mono text-blue-700 truncate">
              {typeof window !== "undefined" ? `${window.location.origin}/register?ref=${referral.code}` : `/register?ref=${referral.code}`}
            </code>
            <button
              onClick={() => {
                const url = `${window.location.origin}/register?ref=${referral.code}`;
                navigator.clipboard.writeText(url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? tp.copied : tp.copy}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-800">{referral.referredCount}</span>
              <span className="text-sm text-gray-500">{referral.referredCount === 1 ? tp.friendSingular : tp.friendPlural}</span>
            </div>
            <div className="text-xs text-gray-400">{tp.codeLabel}: <span className="font-bold font-mono text-gray-600">{referral.code}</span></div>
          </div>
        </div>
      )}

      {/* ── LGPD — Privacidade e dados ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-violet-500" />
          {tp.privacyTitle}
        </h2>
        <p className="text-xs text-gray-400 -mt-2">
          {tp.privacyDesc}{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">{tp.privacyLink}</Link>
        </p>

        {/* Export */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">{tp.exportTitle}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tp.exportDesc}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exportLoading}
            className="gap-2 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            {exportLoading ? tp.generating : tp.download}
          </Button>
        </div>

        {/* Delete account */}
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{tp.deleteTitle}</p>
          </div>
          <p className="text-xs text-red-500">{tp.deleteDesc}</p>
          <form onSubmit={handleDeleteAccount} className="space-y-3">
            <Input
              type="password"
              placeholder={tp.deletePwPlaceholder}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="border-red-200 focus:border-red-400 bg-white text-sm"
            />
            {deleteMsg && (
              <div className={cn(
                "flex items-center gap-2 text-xs px-3 py-2 rounded-xl",
                deleteMsg.type === "err" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-50 text-green-700"
              )}>
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {deleteMsg.text}
              </div>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={deleting || !deleteConfirm}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white border-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? tp.deleting : tp.deleteBtn}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
