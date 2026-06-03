"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { darkInputClass, autofillStyle } from "@/app/(auth)/_auth-input";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token || !email) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 mb-5">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Link inválido</h1>
        <p className="text-sm text-slate-400 mb-6">Este link de redefinição é inválido ou já foi usado.</p>
        <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 mb-5">
          <CheckCircle className="h-7 w-7 text-green-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Senha redefinida!</h1>
        <p className="text-sm text-slate-400 mb-6">Sua senha foi alterada. Faça login com a nova senha.</p>
        <Button onClick={() => router.push("/login?reset=1")} className="w-full h-11">
          Ir para o login
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: decodeURIComponent(email), token, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Link inválido ou expirado. Solicite um novo.");
      return;
    }

    setDone(true);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Criar nova senha</h1>
        <p className="text-sm text-slate-400">Escolha uma senha segura com pelo menos 8 caracteres.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-300">Nova senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={darkInputClass}
            style={autofillStyle}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-300">Confirmar senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={darkInputClass}
            style={autofillStyle}
          />
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-center text-sm">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
