"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";
import { Plane } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function AppShell({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // Close sidebar when route changes (listen to popstate + custom navigation)
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Desktop sidebar (always visible md+) ── */}
      <div className="hidden md:block">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* ── Mobile: overlay + drawer ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isAdmin={isAdmin} onClose={() => setOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 min-h-[3.5rem] pt-safe border-b border-white/5"
          style={{ background: "linear-gradient(180deg, #0E1520 0%, #111827 100%)" }}
        >
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
            aria-label={t.sidebar.openMenu}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)" }}
            >
              <Plane className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">RoteiroApp</span>
          </Link>

          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
