"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { pushDismissable } from "@/lib/dismissable-stack";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({ open, onClose, children, className }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    // Guarda o foco de origem para devolver ao fechar (WCAG 2.4.3).
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Bloqueia o scroll do fundo enquanto o modal está aberto.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    // Foca o primeiro elemento (ou o painel) ao abrir.
    const focusables = getFocusable();
    (focusables[0] ?? panelRef.current)?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      // Foco-trap: mantém o Tab dentro do modal.
      const items = getFocusable();
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault(); first.focus();
      }
    };

    // Registra na pilha de dispensáveis para o botão VOLTAR do Android fechar
    // este modal em vez de navegar para fora (ou fechar o app). `Escape` acima
    // resolve só no desktop — no Android essa tecla não existe.
    const unregister = pushDismissable(onClose);

    document.addEventListener("keydown", handleKey);
    return () => {
      unregister();
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // pt-safe/pb-safe: sem isso um modal alto encostava no notch.
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-safe pb-safe">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          // `dvh` e não `vh`: no WebView a unidade `vh` não acompanha a abertura
          // do teclado virtual, então o modal ficava mais alto que o espaço real.
          "relative z-50 bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90dvh] overflow-y-auto outline-none",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between p-4 sm:p-6 border-b", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

// p-4 no celular: com p-6 fixo, uma tela de 360px deixava só 280px úteis dentro
// do modal — os campos em duas colunas não cabiam.
function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-6", className)} {...props} />;
}

// No celular os botões empilham e ocupam a linha inteira (`col-reverse` mantém a
// ação principal por cima). Lado a lado num modal de 280px úteis, "Cancelar" e
// "Salvar alterações" se esmagavam — ainda mais quando havia mensagem de erro.
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-4 pb-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:pb-6 [&>button]:w-full sm:[&>button]:w-auto",
        className
      )}
      {...props}
    />
  );
}

function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Fechar"
      className="h-11 w-11 -mr-2 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <X className="h-5 w-5" />
    </button>
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose };
