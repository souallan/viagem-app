"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Trash2, Crown, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  role: string;
  user: { id: string; name: string | null; email: string; image: string | null };
}

interface Owner {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

const ROLE_CFG = {
  OWNER:  { label: "Dono",    Icon: Crown,  color: "text-amber-700 bg-amber-50 border-amber-200" },
  EDITOR: { label: "Editor",  Icon: Pencil, color: "text-blue-700 bg-blue-50 border-blue-200" },
  VIEWER: { label: "Leitor",  Icon: Eye,    color: "text-gray-700 bg-gray-50 border-gray-200" },
};

function Avatar({ name, email, image }: { name: string | null; email: string; image: string | null }) {
  if (image) return <img src={image} alt={name ?? email} className="w-9 h-9 rounded-full object-cover" />;
  const initials = (name ?? email).slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

export default function TripCollaboration({ tripId }: { tripId: string }) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/trips/${tripId}/members`);
    if (res.ok) {
      const data = await res.json();
      setOwner(data.owner);
      setMembers(data.members);
    }
  }, [tripId]);

  useEffect(() => { load(); }, [load]);

  async function handleInvite() {
    if (!email.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/trips/${tripId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    setSaving(false);
    if (res.ok) {
      setEmail("");
      setRole("VIEWER");
      setOpen(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao convidar.");
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Remover este membro da viagem?")) return;
    await fetch(`/api/trips/${tripId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    load();
  }

  const total = 1 + members.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <Users className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Colaboradores</h3>
            <p className="text-xs text-gray-400">{total} {total === 1 ? "pessoa" : "pessoas"} nesta viagem</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
          <UserPlus className="h-3.5 w-3.5" /> Convidar
        </Button>
      </div>

      <div className="space-y-2">
        {/* Owner */}
        {owner && (
          <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-amber-50 border border-amber-100">
            <Avatar name={owner.name} email={owner.email} image={owner.image} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{owner.name ?? owner.email}</p>
              {owner.name && <p className="text-xs text-gray-400 truncate">{owner.email}</p>}
            </div>
            <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border", ROLE_CFG.OWNER.color)}>
              <Crown className="h-2.5 w-2.5" /> Dono
            </span>
          </div>
        )}

        {/* Members */}
        {members.map(m => {
          const cfg = ROLE_CFG[m.role as keyof typeof ROLE_CFG] ?? ROLE_CFG.VIEWER;
          const { Icon } = cfg;
          return (
            <div key={m.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 group">
              <Avatar name={m.user.name} email={m.user.email} image={m.user.image} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.user.name ?? m.user.email}</p>
                {m.user.name && <p className="text-xs text-gray-400 truncate">{m.user.email}</p>}
              </div>
              <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border", cfg.color)}>
                <Icon className="h-2.5 w-2.5" /> {cfg.label}
              </span>
              <button
                onClick={() => handleRemove(m.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Invite dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }}>
        <DialogHeader>
          <DialogTitle>Convidar colaborador</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              O usuário deve ter uma conta no RoteiroApp. Digite o e-mail cadastrado.
            </p>
            <div>
              <Label htmlFor="invite-email">E-mail *</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="amigo@email.com"
                onKeyDown={e => e.key === "Enter" && handleInvite()}
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Permissão</Label>
              <Select id="invite-role" value={role} onChange={e => setRole(e.target.value)}>
                <option value="VIEWER">👁️ Leitor — só pode ver</option>
                <option value="EDITOR">✏️ Editor — pode editar</option>
              </Select>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleInvite} disabled={saving || !email.trim()} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            {saving ? "Convidando..." : "Convidar"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
