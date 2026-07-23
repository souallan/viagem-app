"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isNativeApp } from "@/lib/native";

const CHAVE = "push-prompt-respondido";

/**
 * Explica POR QUE vale a pena receber notificações, antes de o Android abrir o
 * diálogo de permissão do sistema.
 *
 * Antes, o pedido disparava assim que o usuário entrava na área logada — sem
 * contexto nenhum. Diálogo de permissão sem motivo é negado na maioria das
 * vezes, e no Android a negação é difícil de reverter (só nos ajustes do
 * sistema). Pedimos depois que a pessoa já tem uma viagem, quando o valor é
 * concreto: avisar de check-in, documento vencendo, contagem para o embarque.
 *
 * Só aparece dentro do app nativo, uma única vez (a escolha fica no
 * localStorage). Dispensar não pede de novo — insistir é o que faz o usuário
 * negar de vez.
 */
export function PushPermissionPrompt({ temViagem }: { temViagem: boolean }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!isNativeApp() || !temViagem) return;
    if (localStorage.getItem(CHAVE)) return;

    let cancelado = false;
    (async () => {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const perm = await PushNotifications.checkPermissions();
        // Só faz sentido perguntar quando o sistema ainda não decidiu.
        if (!cancelado && (perm.receive === "prompt" || perm.receive === "prompt-with-rationale")) {
          setVisivel(true);
        }
      } catch {
        /* plugin indisponível — ignora */
      }
    })();

    return () => { cancelado = true; };
  }, [temViagem]);

  function encerrar() {
    localStorage.setItem(CHAVE, "1");
    setVisivel(false);
  }

  async function ativar() {
    try {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive === "granted") await PushNotifications.register();
    } catch {
      /* ignora */
    }
    encerrar();
  }

  if (!visivel) return null;

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <Bell className="h-4 w-4 text-primary-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">Quer ser avisado da sua viagem?</p>
          <p className="text-sm text-gray-600 mt-0.5 leading-snug">
            Podemos lembrar do check-in, avisar quando um documento estiver perto de vencer e
            marcar a contagem regressiva do embarque.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Button size="sm" onClick={ativar} className="w-full sm:w-auto">
              Ativar avisos
            </Button>
            <Button size="sm" variant="ghost" onClick={encerrar} className="w-full sm:w-auto">
              Agora não
            </Button>
          </div>
        </div>
        <button
          onClick={encerrar}
          aria-label="Dispensar"
          className="h-8 w-8 -mt-1 -mr-1 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
