"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { darkInputClass, autofillStyle } from "@/app/(auth)/_auth-input";
import { trackEvent } from "@/lib/analytics";

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Fraca", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Média", color: "bg-yellow-500" };
  return { level: 3, label: "Forte", color: "bg-green-500" };
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref.toUpperCase());
  }, [searchParams]);

  const pwStrength = getPasswordStrength(password);

  const passwordsMatch = confirm.length === 0 || password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (!accepted) { setError("Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar uma conta."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ref: refCode || undefined, consent: accepted }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta");
        setLoading(false);
        return;
      }

      trackEvent("sign_up", { method: "email" });
      // Pré-preenche o e-mail no login (menos fricção; o 2FA por OTP continua exigido).
      router.push(`/login?registered=1&email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Crie sua conta</h1>
        <p className="text-sm text-slate-400">Comece a organizar suas viagens gratuitamente</p>
      </div>

      {refCode && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
          <span>🎉</span>
          <span>Você foi convidado por um amigo! Código <span className="font-bold">{refCode}</span> aplicado.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-sm font-semibold text-slate-300">Nome</label>
          <input
            id="reg-name"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={darkInputClass}
            style={autofillStyle}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-sm font-semibold text-slate-300">Email</label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" className="text-sm font-semibold text-slate-300">Senha</label>
          <input
            id="reg-password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={darkInputClass}
            style={autofillStyle}
          />
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= pwStrength.level ? pwStrength.color : "bg-white/10"}`}
                  />
                ))}
              </div>
              {pwStrength.label && (
                <p className={`text-[11px] font-semibold ${pwStrength.level === 1 ? "text-red-400" : pwStrength.level === 2 ? "text-yellow-400" : "text-green-400"}`}>
                  Senha {pwStrength.label}
                  {pwStrength.level < 3 && " — adicione letras maiúsculas, números ou símbolos"}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-confirm" className="text-sm font-semibold text-slate-300">Confirmar senha</label>
          <input
            id="reg-confirm"
            type="password"
            placeholder="Digite a senha novamente"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className={`${darkInputClass} ${!passwordsMatch ? "border-red-500/60 focus:border-red-500" : confirm.length > 0 && passwordsMatch ? "border-green-500/50 focus:border-green-500" : ""}`}
            style={autofillStyle}
          />
          {confirm.length > 0 && (
            <p className={`text-[11px] font-semibold ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
              {passwordsMatch ? "✓ Senhas coincidem" : "✗ Senhas não coincidem"}
            </p>
          )}
        </div>

        {/* Consentimento LGPD */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/30 cursor-pointer shrink-0"
          />
          <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
            Li e aceito os{" "}
            <Link
              href="/terms"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Termos de Uso
            </Link>
            {" "}e a{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Política de Privacidade
            </Link>
            , concordo com o tratamento dos meus dados conforme a LGPD (Lei 13.709/2018) e declaro ter pelo menos 13 anos.
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading || !accepted || !passwordsMatch || confirm.length === 0}>
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </Button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-5">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Entrar
        </Link>
      </p>
    </div>
  );
}
