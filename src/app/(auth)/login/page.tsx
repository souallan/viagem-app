"use client";

import { useState, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, ArrowLeft, RotateCcw } from "lucide-react";

import { darkInputClass, autofillStyle } from "@/app/(auth)/_auth-input";

type Step = "credentials" | "otp";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const passwordReset  = searchParams.get("reset") === "1";

  const [step, setStep]       = useState<Step>("credentials");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Step 1: validate email + password, send OTP ──────────────

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/check-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Email ou senha incorretos.");
      return;
    }

    setStep("otp");
    startCooldown();
  }

  // ── Step 2: verify OTP via NextAuth ──────────────────────────

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Código inválido ou expirado. Solicite um novo.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────

  function startCooldown() {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/check-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível reenviar o código. Tente voltar e fazer login novamente.");
    } else {
      setOtp("");
      startCooldown();
    }
  }

  // ── UI ────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Banners de sucesso ── */}
      {justRegistered && (
        <div className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">Conta criada! Entre com seu email e senha.</p>
        </div>
      )}
      {passwordReset && (
        <div className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">Senha redefinida! Entre com sua nova senha.</p>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ETAPA 1 — Email + Senha
      ══════════════════════════════════════════ */}
      {step === "credentials" && (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-1">Bem-vindo de volta</h1>
            <p className="text-sm text-slate-400">Entre na sua conta para continuar planejando</p>
          </div>

          <form onSubmit={handleCredentials} className="space-y-4">
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
              {loading ? "Verificando..." : "Continuar"}
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-5">
            Não tem conta?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </>
      )}

      {/* ══════════════════════════════════════════
          ETAPA 2 — Código OTP
      ══════════════════════════════════════════ */}
      {step === "otp" && (
        <>
          <div className="mb-6">
            <button
              onClick={() => { setStep("credentials"); setError(""); setOtp(""); }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar
            </button>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/25 mb-4">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Verifique seu email</h1>
            <p className="text-sm text-slate-400">
              Enviamos um código de 6 dígitos para{" "}
              <span className="text-slate-200 font-semibold">{email}</span>.
              Válido por 10 minutos.
            </p>
          </div>

          <form onSubmit={handleOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Código de verificação</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoComplete="one-time-code"
                autoFocus
                className={`${darkInputClass} text-center text-2xl font-bold tracking-[0.5em]`}
                style={autofillStyle}
              />
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11 text-base" disabled={loading || otp.length < 6}>
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </form>

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="w-full flex items-center justify-center gap-1.5 mt-4 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar código"}
          </button>
        </>
      )}
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
