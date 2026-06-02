"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Plane, FileWarning, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "trip" | "document";
  title: string;
  subtitle: string;
  href: string;
  urgency: "high" | "medium";
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visible = notifications.filter((n) => !dismissed.has(n.id));
  const count = visible.length;

  if (count === 0 && !open) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
        aria-label={`${count} notificações`}
      >
        <Bell className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-[#111827]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: "#111827" }}>
          <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
            <p className="text-sm font-bold text-white">Notificações</p>
            {count > 0 && (
              <span className="text-[10px] font-bold text-red-400 bg-red-600/15 px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="h-6 w-6 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-600">Nenhum alerta no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {visible.map((n) => {
                const Icon = n.type === "trip" ? Plane : FileWarning;
                const iconColor = n.urgency === "high"
                  ? "text-red-400 bg-red-600/15"
                  : "text-amber-400 bg-amber-600/15";
                return (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/3 transition-colors group">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", iconColor)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Link href={n.href} onClick={() => setOpen(false)} className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{n.title}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{n.subtitle}</p>
                    </Link>
                    <button
                      onClick={() => setDismissed((d) => new Set([...d, n.id]))}
                      className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-slate-400 transition-all shrink-0 mt-1"
                      aria-label="Dispensar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
