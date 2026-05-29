"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// 2FA via OTP temporariamente desativado (Resend domain pendente).
// Para reativar: restaurar fluxo de 2 etapas com check-credentials + OTP input.

const darkInputClass =
  "flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

const autofillStyle: React.CSSProperties = {
  WebkitBoxShadow: "0 0 0 1000px rgba(14,21,32,0.95) inset",
  WebkitTextFillColor: "white",
  caretColor: "white",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const passwordReset   = searchParams.get("reset") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Bem-vindo de volta</h1>
        <p className="text-sm text-slate-400">Entre na sua conta para continuar planejando</p>
      </div>

      {justRegistered && (
        <div className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            Conta criada com sucesso! Entre com seu email e senha.
          </p>
        </div>
      )}

      {passwordReset && (
        <div className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            Senha redefinida com sucesso! Entre com sua nova senha.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-300">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={darkInputClass}
            style={autofillStyle}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-300">Senha</label>
            <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={darkInputClass}
            style={autofillStyle}
          />
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-5">
        Não tem conta?{" "}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <LoginForm />
    </Suspense>
  );
}
