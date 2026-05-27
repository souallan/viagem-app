"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";
  const error = params.get("error");

  if (success) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-5">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Email confirmado!</h1>
        <p className="text-sm text-slate-400 mb-6">
          Sua conta está ativa. Agora você pode fazer login normalmente.
        </p>
        <Link href="/login" className={cn(buttonVariants(), "w-full h-11 text-base justify-center")}>
          Fazer login
        </Link>
      </div>
    );
  }

  if (error) {
    const msg =
      error === "expired"
        ? "O link de verificação expirou (válido por 24 horas)."
        : "Link de verificação inválido.";
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 mb-5">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Link inválido</h1>
        <p className="text-sm text-slate-400 mb-6">{msg}</p>
        <p className="text-sm text-slate-500 mb-4">
          Faça login na sua conta e solicite um novo email de verificação.
        </p>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 text-base justify-center")}>
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 mb-5">
        <Mail className="h-8 w-8 text-blue-400" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">Verifique seu email</h1>
      <p className="text-sm text-slate-400 mb-6">
        Enviamos um link de confirmação para o seu email. Clique no link para ativar sua conta.
      </p>
      <p className="text-xs text-slate-600">
        Não recebeu? Verifique a pasta de spam ou faça login para reenviar.
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-center text-sm">Verificando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
