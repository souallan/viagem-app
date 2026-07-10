"use client";
import { confirmDialog } from "@/lib/confirm";

import { useState } from "react";
import { Link2, Copy, CheckCheck, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TripPublicShare({ tripId, initialToken }: { tripId: string; initialToken: string | null }) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = token
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${token}`
    : null;

  async function generate() {
    setLoading(true);
    const res = await fetch(`/api/trips/${tripId}/share`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
    }
    setLoading(false);
  }

  async function revoke() {
    if (!(await confirmDialog("Desativar o link público? Quem tiver o link não poderá mais acessar."))) return;
    setLoading(true);
    await fetch(`/api/trips/${tripId}/share`, { method: "DELETE" });
    setToken(null);
    setLoading(false);
  }

  async function copy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
          <Globe className="h-4 w-4 text-sky-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Link público</h3>
          <p className="text-xs text-gray-400">Compartilhe o roteiro sem precisar de conta</p>
        </div>
      </div>

      {token && shareUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Link2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-600 font-mono truncate flex-1">{shareUrl}</span>
            <button onClick={copy} className="shrink-0 text-gray-400 hover:text-primary-600 transition-colors">
              {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={copy} className="gap-1.5 flex-1">
              {copied ? <><CheckCheck className="h-3.5 w-3.5" /> Copiado!</> : <><Copy className="h-3.5 w-3.5" /> Copiar link</>}
            </Button>
            <Button size="sm" variant="outline" onClick={revoke} disabled={loading} className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" /> Desativar
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-400 mb-3">
            Gere um link único para que amigos e família possam ver o roteiro sem precisar criar uma conta.
          </p>
          <Button size="sm" onClick={generate} disabled={loading} className="gap-1.5 w-full">
            <Link2 className="h-3.5 w-3.5" />
            {loading ? "Gerando..." : "Gerar link público"}
          </Button>
        </div>
      )}
    </div>
  );
}
