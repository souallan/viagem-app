"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/native";

/**
 * Inicializa os plugins nativos quando o app roda dentro do Capacitor.
 * Na web renderiza null e não importa nenhum plugin (imports são dinâmicos).
 * - StatusBar: estilo escuro combinando com o tema
 * - SplashScreen: esconde após o conteúdo carregar
 * - App: botão voltar do Android (volta no histórico ou sai)
 * - Network: expõe estado offline via classe no <html> (`is-offline`)
 */
export function NativeBootstrap() {
  useEffect(() => {
    if (!isNativeApp()) return;
    const cleanups: Array<() => void> = [];

    (async () => {
      try {
        const [{ StatusBar, Style }, { SplashScreen }, { App }, { Network }] =
          await Promise.all([
            import("@capacitor/status-bar"),
            import("@capacitor/splash-screen"),
            import("@capacitor/app"),
            import("@capacitor/network"),
          ]);

        await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        // setBackgroundColor é Android-only (iOS ignora)
        await StatusBar.setBackgroundColor({ color: "#0E1520" }).catch(() => {});
        await SplashScreen.hide().catch(() => {});

        const backSub = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) window.history.back();
          else App.exitApp();
        });
        cleanups.push(() => backSub.remove());

        const applyOffline = (connected: boolean) => {
          document.documentElement.classList.toggle("is-offline", !connected);
        };
        const status = await Network.getStatus();
        applyOffline(status.connected);
        const netSub = await Network.addListener("networkStatusChange", (s) =>
          applyOffline(s.connected)
        );
        cleanups.push(() => netSub.remove());
      } catch {
        /* plugins indisponíveis — ignora silenciosamente */
      }
    })();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
