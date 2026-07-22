"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isNativeApp, getNativePlatform } from "@/lib/native";

/**
 * Registra o aparelho para receber push (FCM) e trata o toque na notificação.
 * Só roda dentro do app nativo — na web renderiza null e não importa o plugin.
 * Deve ficar na área autenticada: o token é vinculado ao usuário logado.
 */
export function PushRegistration() {
  const router = useRouter();

  useEffect(() => {
    if (!isNativeApp()) return;

    const cleanups: Array<() => void> = [];
    let cancelled = false;

    (async () => {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");

        let perm = await PushNotifications.checkPermissions();
        if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
          perm = await PushNotifications.requestPermissions();
        }
        // Recusado: não insistir. O usuário pode liberar depois nos ajustes do sistema.
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
