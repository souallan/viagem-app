"use client";

import { createRoot } from "react-dom/client";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmOpts = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

/**
 * Substitui o confirm() nativo por um diálogo do design system (bonito no app
 * Capacitor). Promise-based: `if (!(await confirmDialog("Excluir?"))) return;`
 */
export function confirmDialog(message: string, opts: ConfirmOpts = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(false);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);

    const close = (result: boolean) => {
      root.unmount();
      host.remove();
      resolve(result);
    };

    const danger = opts.danger !== false; // padrão: ação destrutiva
    root.render(
      <Dialog open onClose={() => close(false)} className="max-w-sm">
        <div className="p-6">
          {opts.title && <h3 className="text-base font-bold text-gray-900 mb-2">{opts.title}</h3>}
          <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => close(false)}>
              {opts.cancelText ?? "Cancelar"}
            </Button>
            <Button variant={danger ? "destructive" : "default"} onClick={() => close(true)}>
              {opts.confirmText ?? "Confirmar"}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  });
}
