"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, ExternalLink, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  type: string;
  url: string | null;
  expiresAt: string | null;
  notes: string | null;
}

const typeInfo: Record<string, { label: string; icon: string; color: string }> = {
  PASSPORT: { label: "Passaporte", icon: "🛂", color: "bg-blue-50 text-blue-700" },
  VISA: { label: "Visto", icon: "📋", color: "bg-purple-50 text-purple-700" },
  INSURANCE: { label: "Seguro", icon: "🛡️", color: "bg-green-50 text-green-700" },
  TICKET: { label: "Passagem", icon: "🎫", color: "bg-orange-50 text-orange-700" },
  VOUCHER: { label: "Voucher", icon: "📄", color: "bg-indigo-50 text-indigo-700" },
  OTHER: { label: "Outro", icon: "📎", color: "bg-gray-50 text-gray-700" },
};

export default function DocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [docs, setDocs] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "OTHER", url: "", expiresAt: "", notes: "" });

  async function load() {
    const res = await fetch(`/api/trips/${id}/documents`);
    if (res.ok) setDocs(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ title: "", type: "OTHER", url: "", expiresAt: "", notes: "" });
      load();
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Excluir este documento?")) return;
    await fetch(`/api/trips/${id}/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📂</div>
          <p className="font-medium">Nenhum documento cadastrado</p>
          <p className="text-sm mt-1">Adicione passaportes, vistos, vouchers e outros documentos importantes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {docs.map((doc) => {
            const info = typeInfo[doc.type];
            return (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{info.icon}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${info.color}`}>
                          {info.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      {doc.expiresAt && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Validade: {formatDate(doc.expiresAt)}</span>
                        </div>
                      )}
                      {doc.notes && <p className="text-sm text-gray-400 mt-1">{doc.notes}</p>}
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Abrir link
                        </a>
                      )}
                    </div>
                    <button onClick={() => handleDelete(doc.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Novo documento</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="doc-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Passaporte — João Silva" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select name="type" value={form.type} onChange={handleChange}>
                  {Object.entries(typeInfo).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link do documento</Label>
              <Input name="url" type="url" value={form.url} onChange={handleChange} placeholder="https://drive.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="doc-form" disabled={loading}>{loading ? "Salvando..." : "Adicionar"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
