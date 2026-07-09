"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getNativePlatform } from "@/lib/native";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GATracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Marca a plataforma (web/ios/android) em TODOS os eventos → permite medir
  // conversão web→app e retenção por plataforma no GA4.
  useEffect(() => {
    window.gtag?.("set", { platform: getNativePlatform() });
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    window.gtag?.("config", gaId, { page_path: url });
  }, [pathname, searchParams, gaId]);

  return null;
}
