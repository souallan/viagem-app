"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/native";
import { dismissTop } from "@/lib/dismissable-stack";
import { toast } from "@/lib/toast";

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

    // Rede de segurança do script inline do <head>: se a ponte do Capacitor foi
    // injetada depois dele, a classe é aplicada agora. Sem ela, as ofertas de
    // assinatura ficariam visíveis dentro do app (política de Pagamentos do Google).
    document.documentElement.classList.add("is-native-app");

    const cleanups: Array<() => void> = [];

    (async () => {
      try {
        const [{ StatusBar, Style }, { SplashScreen }, { App }, { Network }, { Keyboard }] =
          await Promise.all([
            import("@capacitor/status-bar"),
            import("@capacitor/splash-screen"),
            import("@capacitor/app"),
            import("@capacitor/network"),
            import("@capacitor/keyboard"),
          ]);

        // Estado do teclado: o voltar precisa saber disso (ver handler abaixo).
        let tecladoAberto = false;
        const kShow = await Keyboard.addListener("keyboardWillShow", () => { tecladoAberto = true; });
        const kHide = await Keyboard.addListener("keyboardWillHide", () => { tecladoAberto = false; });

        // Traz o campo focado para a área visível quando o teclado abre.
        // `resize: native` encolhe a WebView, mas NÃO rola até o campo: quem
        // estava digitando perto do rodapé (ex.: orçamento em "Nova viagem")
        // ficava com o próprio campo escondido atrás do teclado.
        // `block: "center"` deixa o campo no meio do espaço que sobrou, o que
        // funciona tanto para campo alto quanto para o rodapé de um modal.
        const kDidShow = await Keyboard.addListener("keyboardDidShow", () => {
          const rolar = () => {
            const el = document.activeElement as HTMLElement | null;
            if (el && typeof el.scrollIntoView === "function") {
              // `behavior:"auto"` (instantâneo) de propósito: a rolagem suave é
              // cancelada pelo relayout que acontece quando o body encolhe.
              el.scrollIntoView({ block: "center", behavior: "auto" });
            }
          };
          // Duas passadas: a primeira age assim que o teclado aparece; a segunda
          // corrige depois que o redimensionamento do body termina, senão o
          // navegador reposiciona a página e desfaz a nossa rolagem.
          rolar();
          setTimeout(rolar, 300);
        });

        cleanups.push(() => {
          void kShow.remove();
          void kHide.remove();
          void kDidShow.remove();
        });

        await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        // setBackgroundColor é Android-only (iOS ignora)
        await StatusBar.setBackgroundColor({ color: "#0E1520" }).catch(() => {});
        await SplashScreen.hide().catch(() => {});

        // Botão VOLTAR do Android. Antes era cego para o estado da UI: com um
        // modal aberto, voltar navegava para fora (perdendo o formulário) ou,
        // sem histórico, FECHAVA O APP. Agora respeita a hierarquia esperada.
        let ultimoBack = 0;
        const backSub = await App.addListener("backButton", ({ canGoBack }) => {
          // 1) Teclado aberto: voltar só fecha o teclado — é o que o Android faz.
          //    Sem isto, quem apertava voltar para esconder o teclado (ex.: após
          //    digitar o código de verificação) via o aviso de saída e, ao tocar
          //    de novo achando que o teclado não fechou, FECHAVA O APP.
          if (tecladoAberto) {
            void Keyboard.hide().catch(() => {});
            tecladoAberto = false;
            return;
          }
          // 2) Fecha o que estiver aberto por cima (modal, confirmação)
          if (dismissTop()) return;
          // 3) Volta no histórico
          if (canGoBack) {
            window.history.back();
            return;
          }
          // 4) Na raiz: duplo toque para sair. Fechar no primeiro toque, sem
          //    aviso, é percebido como travamento — convenção do Android.
          const agora = Date.now();
          if (agora - ultimoBack < 2000) {
            App.exitApp();
            return;
          }
          ultimoBack = agora;
          toast("Toque em voltar novamente para sair");
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
