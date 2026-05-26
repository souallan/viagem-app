"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const darkInputClass =
  "flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15";

const autofillStyle: React.CSSProperties = {
  WebkitBoxShadow: "0 0 0 1000px rgba(14,21,32,0.95) inset",
  WebkitTextFillColor: "white",
  caretColor: "white",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-300">Nome</label>
          <input
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
          <label className="text-sm font-semibold text-slate-300">Senha</label>
          <input
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
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/25 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading}>
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
