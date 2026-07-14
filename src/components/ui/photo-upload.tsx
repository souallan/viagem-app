"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, ImagePlus } from "lucide-react";

// Upload direto (unsigned) para o Cloudinary — sem segredo no servidor.
// Configure no Railway: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
// (crie um "unsigned upload preset" no painel do Cloudinary).
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
// Quando "true", o upload passa a ser ASSINADO (exige login): o cliente pede a
// assinatura em /api/upload/sign em vez de usar o preset unsigned exposto no bundle.
const SIGNED = process.env.NEXT_PUBLIC_CLOUDINARY_SIGNED === "true";

export const uploadConfigured = Boolean(CLOUD && (SIGNED || PRESET));

export function PhotoUpload({
  onUploaded,
  label = "Tirar foto / anexar",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!uploadConfigured) {
    return (
      <p className="text-xs text-gray-400">
        📷 Upload de foto fica disponível assim que o Cloudinary for configurado.
      </p>
    );
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setErr("Imagem muito grande (máx. 10 MB)."); return; }
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      if (SIGNED) {
        // Upload assinado: só usuários autenticados obtêm a assinatura.
        const signRes = await fetch("/api/upload/sign", { method: "POST" });
        if (!signRes.ok) { setErr("Faça login para enviar fotos."); setUploading(false); return; }
        const s = await signRes.json();
        fd.append("api_key", s.apiKey);
        fd.append("timestamp", String(s.timestamp));
        fd.append("signature", s.signature);
        fd.append("folder", s.folder);
      } else {
        fd.append("upload_preset", PRESET!);
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.secure_url) onUploaded(data.secure_url as string);
      else setErr("Falha no upload. Tente novamente.");
    } catch {
      setErr("Falha no upload. Verifique a conexão.");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {/* capture=environment abre a câmera no celular (web e WebView nativo) */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {uploading ? "Enviando…" : label}
      </button>
      {err && <p className="text-xs text-red-500 mt-1.5">{err}</p>}
    </div>
  );
}

/** Ícone auxiliar exportado para uso opcional. */
export { ImagePlus };
