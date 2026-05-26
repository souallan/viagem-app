"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import {
  Globe, CalendarDays, BedDouble, Train, Wallet, Package,
  ClipboardCheck, BookOpen, Map, TrendingUp, ArrowLeftRight, FileText,
} from "lucide-react";

export function TripTabs({ tripId }: { tripId: string }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const TABS = [
    { href: "",               label: t.tabs.overview,       Icon: Globe          },
    { href: "/itinerary",     label: t.tabs.itinerary,      Icon: CalendarDays   },
    { href: "/accommodation", label: t.tabs.accommodation,  Icon: BedDouble      },
    { href: "/transport",     label: t.tabs.transport,      Icon: Train          },
    { href: "/budget",        label: t.tabs.budget,         Icon: Wallet         },
    { href: "/packing",       label: t.tabs.packing,        Icon: Package        },
    { href: "/prep",          label: t.tabs.prep,           Icon: ClipboardCheck },
    { href: "/journal",       label: t.tabs.journal,        Icon: BookOpen       },
    { href: "/map",           label: t.tabs.map,            Icon: Map            },
    { href: "/compare",       label: t.tabs.compare,        Icon: TrendingUp     },
    { href: "/currency",      label: t.tabs.currency,       Icon: ArrowLeftRight },
    { href: "/summary",       label: t.tabs.summary,        Icon: FileText       },
  ];

  function isActive(tabHref: string) {
    const full = `/trips/${tripId}${tabHref}`;
    if (tabHref === "") return pathname === full;
    return pathname.startsWith(full);
  }

  return (
    <nav className="flex gap-0.5 overflow-x-auto pb-px" style={{ scrollbarWidth: "none" }}>
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        const { Icon } = tab;
        return (
          <Link
            key={tab.href}
            href={`/trips/${tripId}${tab.href}`}
            className={cn(
              "group flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              active
                ? "bg-primary-50 text-primary-700 border border-primary-200 shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-colors",
                active ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
              )}
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
