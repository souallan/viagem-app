"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, Plane, Lightbulb, Globe, BookOpen, Mail, Instagram, MessageCircle, UserCircle2, Settings, Lock, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { SITE_CONFIG } from "@/lib/site-config";
import { NotificationBell } from "./notification-bell";
import { PremiumBadge } from "./premium-badge";
import { signOut } from "next-auth/react";
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

export function Sidebar({ isAdmin = false, onClose }: { isAdmin?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();

  const navItems = [
    { href: "/dashboard", label: t.nav.myTrips, icon: LayoutDashboard },
    { href: "/routes", label: t.nav.routes, icon: Route },
    { href: "/tips", label: t.nav.tips, icon: Lightbulb },
    { href: "/experiences", label: t.nav.experiences, icon: BookOpen },
    { href: "/profile", label: t.sidebar.profile, icon: UserCircle2 },
  ];

  return (
    // NÃO usar `fixed` aqui. Este componente é reaproveitado dentro do drawer
    // mobile, que esconde o menu com `-translate-x-full`. Um filho `fixed` sai do
    // fluxo, o wrapper fica com largura 0 e `translateX(-100%)` vira translateX(0)
    // — o menu ficava permanentemente na tela, sem fechar nem pelo X.
    // Quem posiciona é o wrapper (fixed no desktop, fixed + translate no mobile).
    <aside
      className="w-64 flex flex-col h-screen overflow-hidden border-r border-white/5"
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
        <div className="flex items-center gap-1">
          <NotificationBell />
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
              aria-label={t.sidebar.closeMenu}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-2">{t.sidebar.menu}</p>
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
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-0.5 h-5 rounded-r-full bg-primary-500 ml-0" />
              )}
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                isActive ? "bg-primary-600/30" : "bg-white/4"
              )}>
                <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-primary-400" : "text-slate-400")} />
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
            href="/backoffice"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              pathname.startsWith("/backoffice")
                ? "text-white bg-red-500/10"
                : "text-slate-600 hover:text-red-300 hover:bg-red-500/8"
            )}
          >
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", pathname.startsWith("/backoffice") ? "bg-red-600/30" : "bg-red-900/20")}>
              <Settings className={cn("h-3.5 w-3.5", pathname.startsWith("/backoffice") ? "text-red-400" : "text-red-800")} />
            </div>
            <span>{t.sidebar.adminPanel}</span>
            {!pathname.startsWith("/backoffice") && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-700/60" />}
          </Link>
        </div>
      )}

      {/* ── Bottom area ── */}
      <div className="relative z-10 border-t border-white/5 mt-auto">

        {/* Plan status */}
        <div className="px-3 pt-3">
          <PremiumBadge />
        </div>

        {/* Logout */}
        <div className="px-3 pt-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all group"
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-white/4 group-hover:bg-red-500/15 transition-colors">
              <LogOut className="h-3.5 w-3.5" />
            </div>
            <span>{t.sidebar.logout}</span>
          </button>
        </div>

        {/* Language + social + copyright */}
        <div className="px-3 pb-3 space-y-3">

          {/* Language selector — compact row */}
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-slate-500 shrink-0" />
            <div className="flex gap-1 flex-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  title={l.label}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-bold transition-all",
                    lang === l.code
                      ? "bg-primary-600/20 text-primary-300 border border-primary-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Social icons + copyright */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <a
                href={`mailto:${SITE_CONFIG.admin.email}`}
                title={SITE_CONFIG.admin.email}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-primary-400 hover:bg-white/5 transition-all"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-pink-400 hover:bg-white/5 transition-all"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE_CONFIG.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-green-400 hover:bg-white/5 transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>

            <Link
              href="/privacy"
              title={t.sidebar.privacyPolicy}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-400 hover:bg-white/5 transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-slate-400 leading-snug">
            © {SITE_CONFIG.copyright.year}{" "}
            <span className="text-slate-300 font-semibold">{SITE_CONFIG.copyright.owner}</span>
            {" · "}{SITE_CONFIG.copyright.text}
          </p>
        </div>
      </div>
    </aside>
  );
}
