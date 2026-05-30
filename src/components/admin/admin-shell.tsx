"use client";

import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import Link from "next/link";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="flex min-h-screen" style={{ background: "#0B0F1A" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header
          className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-white/5"
          style={{ background: "#0A0E1A" }}
        >
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #DC2626, #EF4444)" }}>
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
