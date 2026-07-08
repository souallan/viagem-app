"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import {
  Globe, CalendarDays, BedDouble, Train, Wallet, Package,
  ClipboardCheck, BookOpen, Map, TrendingUp, ArrowLeftRight, FileText, Lock,
  ChevronDown, MoreHorizontal,
} from "lucide-react";

type Item = { href: string; label: string; Icon: typeof Globe };

/**
 * Abas da viagem (Théo/UX): núcleo enxuto + grupos "Reservas" e "Mais" em dropdown,
 * alvos de toque ≥44px. A barra é sticky (fica no topo ao rolar). Antes eram 13 abas
 * em scroll horizontal — muitas nasciam fora da tela no mobile.
 */
export function TripTabs({ tripId }: { tripId: string }) {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState<null | "reservas" | "mais">(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useEffect(() => setOpen(null), [pathname]); // fecha ao navegar

  const groupLabel = {
    reservas: ({ pt: "Reservas", en: "Bookings", es: "Reservas" } as Record<string, string>)[lang] ?? "Reservas",
    mais: ({ pt: "Mais", en: "More", es: "Más" } as Record<string, string>)[lang] ?? "Mais",
  };

  const primary: Item[] = [
    { href: "",           label: t.tabs.overview,  Icon: Globe        },
    { href: "/itinerary", label: t.tabs.itinerary, Icon: CalendarDays },
    { href: "/budget",    label: t.tabs.budget,    Icon: Wallet       },
  ];
  const reservas: Item[] = [
    { href: "/accommodation", label: t.tabs.accommodation, Icon: BedDouble },
    { href: "/transport",     label: t.tabs.transport,     Icon: Train     },
    { href: "/documents",     label: t.tabs.documents,     Icon: Lock      },
  ];
  const mais: Item[] = [
    { href: "/packing",  label: t.tabs.packing,  Icon: Package        },
    { href: "/prep",     label: t.tabs.prep,     Icon: ClipboardCheck },
    { href: "/journal",  label: t.tabs.journal,  Icon: BookOpen       },
    { href: "/map",      label: t.tabs.map,      Icon: Map            },
    { href: "/compare",  label: t.tabs.compare,  Icon: TrendingUp     },
    { href: "/currency", label: t.tabs.currency, Icon: ArrowLeftRight },
    { href: "/summary",  label: t.tabs.summary,  Icon: FileText       },
  ];

  const base = `/trips/${tripId}`;
  const isActive = (href: string) =>
    href === "" ? pathname === base : pathname.startsWith(base + href);
  const reservasActive = reservas.some((r) => isActive(r.href));
  const maisActive = mais.some((m) => isActive(m.href));

  const chip = (active: boolean) =>
    cn(
      "group flex items-center gap-1.5 px-3 py-3 min-h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
      active
        ? "bg-primary-50 text-primary-700 border border-primary-200 shadow-sm"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    );
  const iconCls = (active: boolean) =>
    cn("h-4 w-4 shrink-0 transition-colors", active ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600");

  const Menu = ({ items, align }: { items: Item[]; align: "left" | "right" }) => (
    <div
      className={cn(
        "absolute top-full mt-2 min-w-[190px] bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-30",
        align === "right" ? "right-0" : "left-0"
      )}
      role="menu"
    >
      {items.map((it) => {
        const active = isActive(it.href);
        return (
          <Link
            key={it.href}
            href={base + it.href}
            onClick={() => setOpen(null)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors",
              active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <it.Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary-600" : "text-gray-400")} />
            {it.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav ref={ref} className="relative flex flex-wrap gap-1">
      {primary.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link key={tab.href} href={base + tab.href} className={chip(active)}>
            <tab.Icon className={iconCls(active)} />
            {tab.label}
          </Link>
        );
      })}

      {/* Reservas ▾ */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "reservas" ? null : "reservas")}
          className={chip(reservasActive)}
          aria-expanded={open === "reservas"}
          aria-haspopup="menu"
        >
          <BedDouble className={iconCls(reservasActive)} />
          {groupLabel.reservas}
          <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open === "reservas" && "rotate-180")} />
        </button>
        {open === "reservas" && <Menu items={reservas} align="left" />}
      </div>

      {/* Mais ▾ */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "mais" ? null : "mais")}
          className={chip(maisActive)}
          aria-expanded={open === "mais"}
          aria-haspopup="menu"
        >
          <MoreHorizontal className={iconCls(maisActive)} />
          {groupLabel.mais}
          <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open === "mais" && "rotate-180")} />
        </button>
        {open === "mais" && <Menu items={mais} align="right" />}
      </div>
    </nav>
  );
}
