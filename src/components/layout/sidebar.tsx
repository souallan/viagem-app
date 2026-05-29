"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, Plane, Lightbulb, Globe, BookOpen, Mail, Instagram, MessageCircle, Shield, UserCircle2, Settings, Lock, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

export function Sidebar({ isAdmin = false, onClose }: { isAdmin?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt?: () => Promise<void> } | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as Event & { prompt?: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const navItems = [
    { href: "/dashboard", label: t.nav.myTrips, icon: LayoutDashboard },
    { href: "/routes", label: t.nav.routes, icon: Route },
    { href: "/tips", label: t.nav.tips, icon: Lightbulb },
    { href: "/experiences", label: t.nav.experiences, icon: BookOpen },
    { href: "/profile", label: t.sidebar.profile, icon: UserCircle2 },
  ];

  return (
    <aside
      className="w-64 flex flex-col h-screen fixed left-0 top-0 overflow-hidden border-r border-white/5"
      style={{
        background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      {/* Logo */}
      <div className="relative z-10 px-5 pt-5 pb-4 border-b border-white/6 flex items-center justify-between">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)",
              boxShadow: "0 3px 10px rgba(26,95,204,0.40)",
            }}
          >
            <Plane className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold gradient-text leading-none tracking-tight">RoteiroApp</span>
            <p className="text-[10px] text-slate-600 leading-tight mt-0.5 font-medium tracking-wide uppercase">Travel Planner</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest px-2.5 pb-2">Menu</p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-white bg-white/8"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-0.5 h-5 rounded-r-full bg-primary-500 ml-0" />
              )}
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                isActive ? "bg-primary-600/30" : "bg-white/4"
              )}>
                <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-primary-400" : "text-slate-600")} />
              </div>
              <span className={isActive ? "text-white" : ""}>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-primary-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin link — only for admins */}
      {isAdmin && (
        <div className="relative z-10 px-3 pb-2">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              pathname.startsWith("/admin")
                ? "text-white bg-red-500/10"
                : "text-slate-600 hover:text-red-300 hover:bg-red-500/8"
            )}
          >
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", pathname.startsWith("/admin") ? "bg-red-600/30" : "bg-red-900/20")}>
              <Settings className={cn("h-3.5 w-3.5", pathname.startsWith("/admin") ? "text-red-400" : "text-red-800")} />
            </div>
            <span>{t.sidebar.adminPanel}</span>
            {!pathname.startsWith("/admin") && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-700/60" />}
          </Link>
        </div>
      )}

      {/* Install PWA button — shown only when browser supports it */}
      {installPrompt && !installed && (
        <div className="relative z-10 px-3 pb-2">
          <button
            onClick={() => installPrompt.prompt?.()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-violet-300 hover:text-white bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/20 transition-all"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            Instalar aplicativo
          </button>
        </div>
      )}

      {/* Language selector */}
      <div className="relative z-10 px-3 pb-3">
        <div
          className="rounded-xl p-3 border border-white/6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Globe className="h-2.5 w-2.5" /> {t.nav.language}
          </p>
          <div className="flex gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                title={l.label}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                  lang === l.code
                    ? "bg-primary-600/25 text-primary-300 border border-primary-500/35"
                    : "text-slate-600 hover:text-slate-300 hover:bg-white/6 border border-transparent"
                )}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="text-[10px] leading-none font-bold">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer com copyright e contato ── */}
      <div className="relative z-10 border-t border-white/5">

        {/* Contato / redes sociais */}
        <div className="px-4 py-3 space-y-1.5">
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Shield className="h-2.5 w-2.5" /> {t.sidebar.contact}
          </p>

          <a
            href={`mailto:${SITE_CONFIG.admin.email}`}
            className="flex items-center gap-2 text-[10px] text-slate-600 hover:text-primary-400 transition-colors group"
          >
            <Mail className="h-3 w-3 shrink-0 group-hover:text-primary-400" />
            <span className="truncate">{SITE_CONFIG.admin.email}</span>
          </a>

          <div className="flex items-center gap-2 pt-1">
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-pink-400 transition-colors"
            >
              <Instagram className="h-3 w-3" />
              <span>Instagram</span>
            </a>
            <span className="text-slate-800">·</span>
            <a
              href={SITE_CONFIG.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-green-400 transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="px-4 py-2.5 border-t border-white/5 bg-black/20">
          <p className="text-[9px] text-slate-700 leading-snug">
            © {SITE_CONFIG.copyright.year} <span className="text-slate-500 font-semibold">{SITE_CONFIG.copyright.owner}</span>
            <br />{SITE_CONFIG.copyright.text}
          </p>
          <p className="text-[9px] text-slate-800 mt-1">
            v1.0 · {t.sidebar.madeWith}
          </p>
          <Link href="/privacy" className="flex items-center gap-1 text-[9px] text-slate-700 hover:text-slate-500 transition-colors mt-1.5">
            <Lock className="h-2.5 w-2.5" />
            {t.sidebar.privacyPolicy}
          </Link>
        </div>
      </div>
    </aside>
  );
}
