"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isPushAvailable, getNativePlatform } from "@/lib/native";

/**
 * Registra o aparelho para receber push (FCM) e trata o toque na notificação.
 * Só roda dentro do app nativo — na web renderiza null e não importa o plugin.
 * Deve ficar na área autenticada: o token é vinculado ao usuário logado.
 */
export function PushRegistration() {
  const router = useRouter();

  useEffect(() => {
    // Sem Firebase no projeto nativo, `register()` derruba o app (exceção
    // nativa fatal, não capturável em JS). Ver isPushAvailable().
    if (!isPushAvailable()) return;

    const cleanups: Array<() => void> = [];
    let cancelled = false;

    (async () => {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");

        // NÃO pede permissão aqui. Este componente monta assim que a pessoa entra
        // na área logada, e um diálogo do sistema sem explicação é negado na
        // maioria das vezes — no Android, negar é difícil de reverter depois.
        // Quem pergunta é o PushPermissionPrompt, com contexto e só depois que o
        // usuário já tem uma viagem. Aqui apenas registramos quem já autorizou.
        const perm = await PushNotifications.checkPermissions();
        if (perm.receive !== "granted" || cancelled) return;

        const registration = await PushNotifications.addListener(
          "registration",
          (token) => {
            void fetch("/api/push/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: token.value,
                platform: getNativePlatform(),
              }),
            }).catch(() => {});
          }
        );
        cleanups.push(() => void registration.remove());

        const regError = await PushNotifications.addListener("registrationError", () => {
          /* sem token: o app segue funcionando normalmente, só não recebe push */
        });
        cleanups.push(() => void regError.remove());

        // Toque na notificação → leva à tela indicada no `data.url` enviado pelo servidor.
        const tapped = await PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (action) => {
            const url = action.notification?.data?.url;
            if (typeof url === "string" && url.startsWith("/")) router.push(url);
          }
        );
        cleanups.push(() => void tapped.remove());

        await PushNotifications.register();
      } catch {
        /* plugin indisponível — ignora silenciosamente */
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [router]);

  return null;
}
