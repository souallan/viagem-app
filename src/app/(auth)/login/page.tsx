"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail } from "lucide-react";

const darkInputClass =
  "flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

const autofillStyle: React.CSSProperties = {
  WebkitBoxShadow: "0 0 0 1000px rgba(14,21,32,0.95) inset",
  WebkitTextFillColor: "white",
  caretColor: "white",
};

type Step = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/check-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Email ou senha incorretos.");
      return;
    }

    setStep("otp");
    setResendCooldown(60);
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      otp,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Código inválido ou expirado. Tente novamente.");
      setOtp("");
      otpRef.current?.focus();
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/check-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setResendCooldown(60);
      setOtp("");
    } else {
      setError("Não foi possível reenviar o código.");
    }
  }

  if (step === "otp") {
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/30 mb-4">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Verificação em 2 etapas</h1>
          <p className="text-sm text-slate-400">
            Enviamos um código de 6 dígitos para
          </p>
          <p className="text-sm font-semibold text-blue-400 mt-0.5">{email}</p>
        </div>

        <form onSubmit={handleOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">Código de verificação</label>
            <input
              ref={otpRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              autoComplete="one-time-code"
              className={`${darkInputClass} text-center text-2xl font-bold tracking-[0.5em]`}
              style={autofillStyle}
            />
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verificando..." : "Confirmar código"}
          </Button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-slate-500">
            Não recebeu?{" "}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar código"}
            </button>
          </p>
          <button
            onClick={() => { setStep("credentials"); setError(""); setOtp(""); }}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Voltar e corrigir email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
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

      <div className="mt-4 flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2.5">
        <Mail className="h-4 w-4 text-blue-400 shrink-0" />
        <p className="text-xs text-slate-400">
          Após verificar sua senha, enviaremos um código para seu email.
        </p>
      </div>

      <p className="text-sm text-slate-500 text-center mt-5">
        Não tem conta?{" "}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
