"use client";

import { useState, useEffect } from "react";
import { MailCheck, X } from "lucide-react";

export function EmailVerificationBanner({ email }: { email: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function checkVerified() {
      try {
        const res = await fetch("/api/auth/check-verification");
        if (res.ok) {
          const data = await res.json();
          if (data.verified) setDismissed(true);
        }
      } catch { /* silent */ }
    }

    checkVerified(); // dismiss immediately if already verified in DB
    const onFocus = () => checkVerified();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkVerified();
    });
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (dismissed) return null;

  async function resend() {
    setSending(true);
    const res = await fetch("/api/auth/send-verification", { method: "POST" });
    setSending(false);
    if (res.ok) setSent(true);
  }

  return (
    <div className="flex items-center gap-3 bg-amber-500/10 border-b border-amber-500/20 px-6 py-3">
      <MailCheck className="h-4 w-4 text-amber-400 shrink-0" />
      <p className="text-sm text-amber-300 flex-1">
        {sent ? (
          <span>Email enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.</span>
        ) : (
          <>
            Confirme seu email para garantir acesso completo.{" "}
            <button
              onClick={resend}
              disabled={sending}
              className="underline font-semibold hover:text-amber-200 transition-colors disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Reenviar verificação"}
            </button>
          </>
        )}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-500 hover:text-amber-300 transition-colors"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
