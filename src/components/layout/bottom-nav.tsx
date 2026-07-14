"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, Lightbulb, BookOpen, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

/**
 * Barra de navegação inferior — só no mobile (md:hidden).
 * Padrão nativo: destinos principais ao alcance do polegar.
 * Respeita a safe-area inferior (home indicator) via .pb-safe.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/dashboard", label: t.nav.myTrips, icon: LayoutDashboard },
    { href: "/routes", label: t.nav.routes, icon: Route },
    { href: "/tips", label: t.nav.tips, icon: Lightbulb },
    { href: "/experiences", label: t.nav.experiences, icon: BookOpen },
    { href: "/profile", label: t.sidebar.profile, icon: UserCircle2 },
  ];

  return (
    <nav
      className="md:hidden print:hidden fixed bottom-0 inset-x-0 z-40 pb-safe border-t border-white/8"
      style={{ background: "linear-gradient(0deg, #0E1520 0%, #111827 100%)" }}
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch justify-around h-14">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 transition-colors",
                isActive ? "text-primary-400" : "text-slate-400 active:text-slate-200"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-400")} />
              <span className="text-[10px] font-medium leading-none truncate max-w-[4.5rem] px-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
