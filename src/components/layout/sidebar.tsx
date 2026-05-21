"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, Plane, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/routes", label: "Roteiros", icon: Route },
  { href: "/tips", label: "Dicas", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col h-screen fixed left-0 top-0 bg-gradient-to-b from-slate-900 to-blue-950">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
            <Plane className="h-4 w-4 text-sky-400" />
          </div>
          <span className="text-xl font-bold gradient-text">ViagemApp</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sky-500/20 text-sky-300 shadow-inner shadow-sky-900/30 border border-sky-500/30"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-sky-400" : "text-slate-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer tagline */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>✈</span>
          <span>Explorar o mundo</span>
        </p>
      </div>
    </aside>
  );
}
