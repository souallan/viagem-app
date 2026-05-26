"use client";

import { useState } from "react";
import { Share2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function ShareRouteButton({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "", estimatedBudget: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${tripId}/share-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setForm({ title: "", description: "", tags: "", estimatedBudget: "" }); }, 2000);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" /> Compartilhar roteiro
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Compartilhar como roteiro</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          {done ? (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-bold text-gray-900">Roteiro compartilhado!</p>
              <p className="text-sm text-gray-500">Agora aparece na aba Comunidade em Roteiros.</p>
            </div>
          ) : (
            <form id="share-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                Seu roteiro ficará visível para outros viajantes na aba Comunidade. As atividades serão copiadas automaticamente.
              </p>
              <div className="space-y-2">
                <Label>Título do roteiro *</Label>
                <Input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: 10 dias pela Itália" />
              </div>
              <div className="space-y-2">
                <Label>Descrição *</Label>
                <Textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Conte um pouco sobre essa viagem e o que outros podem esperar..." />
              </div>
              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input name="tags" value={form.tags} onChange={handleChange} placeholder="Ex: família, gastronomia, história" />
              </div>
              <div className="space-y-2">
                <Label>Orçamento estimado</Label>
                <Input name="estimatedBudget" value={form.estimatedBudget} onChange={handleChange} placeholder="Ex: R$ 8.000 por pessoa" />
              </div>
            </form>
          )}
        </DialogBody>
        {!done && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" form="share-form" disabled={loading} className="gap-2">
              <Share2 className="h-4 w-4" />
              {loading ? "Compartilhando..." : "Compartilhar"}
            </Button>
          </DialogFooter>
        )}
      </Dialog>
    </>
  );
}
