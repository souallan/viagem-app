"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

const darkInputClass =
  "flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.status === 429) {
      setError("Muitas tentativas. Aguarde alguns minutos.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 mb-5">
          <MailCheck className="h-7 w-7 text-green-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Email enviado!</h1>
        <p className="text-sm text-slate-400 mb-2">
          Se o email <strong className="text-white">{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
        <p className="text-xs text-slate-600 mb-6">Verifique também a pasta de spam.</p>
        <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          ← Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Esqueceu sua senha?</h1>
        <p className="text-sm text-slate-400">
          Digite seu email e enviaremos um link para criar uma nova senha.
        </p>
      </div>

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
          />
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
          {loading ? "Enviando..." : "Enviar link de redefinição"}
        </Button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-5">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
