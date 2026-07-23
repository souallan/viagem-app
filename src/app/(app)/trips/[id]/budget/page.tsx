"use client";

import { confirmDialog } from "@/lib/confirm";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Pencil, ExternalLink, ArrowRight, Users, X, Check } from "lucide-react";
import { computeBalances, simplifyDebts } from "@/lib/split";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDate, formatCurrency, expenseCategoryLabel } from "@/lib/utils";
import { affiliates, type AffiliatePartner } from "@/lib/affiliates";
import { useLanguage } from "@/contexts/language-context";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  notes: string | null;
  paidBy: string | null;
  paidById: string | null;
  shares: { participantId: string }[];
}

interface Participant {
  id: string;
  name: string;
  userId?: string | null;
}

interface Member {
  userId: string;
  name: string;
}

function PartnerCard({ p }: { p: AffiliatePartner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center gap-3 p-3.5 rounded-xl border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group ${p.borderColor}`}
    >
      <span className="text-2xl shrink-0">{p.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-sm font-bold text-gray-900">{p.name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{p.tagline}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
    </a>
  );
}

function CurrencyPartners({ hasForeignExpenses }: { hasForeignExpenses: boolean }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(!hasForeignExpenses);

  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-amber-50/60 transition-colors"
      >
        <span className="text-lg">💱</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {hasForeignExpenses ? t.budget.currencyTitleForeign : t.budget.currencyTitle}
          </p>
          <p className="text-xs text-amber-700">
            {hasForeignExpenses ? t.budget.currencyDescForeign : t.budget.currencyDesc}
          </p>
        </div>
        <ArrowRight className={`h-4 w-4 text-amber-400 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {affiliates.currency.map((p) => <PartnerCard key={p.id} p={p} />)}
          <p className="col-span-full text-[10px] text-gray-500 text-right">
            {t.budget.partnerDisclosure}
          </p>
        </div>
      )}
    </div>
  );
}

const categoryColors: Record<string, string> = {
  ACCOMMODATION: "bg-indigo-50 text-indigo-700",
  TRANSPORT: "bg-purple-50 text-purple-700",
  FOOD: "bg-orange-50 text-orange-700",
  ACTIVITY: "bg-blue-50 text-blue-700",
  SHOPPING: "bg-pink-50 text-pink-700",
  HEALTH: "bg-green-50 text-green-700",
  OTHER: "bg-gray-50 text-gray-700",
};

export default function BudgetPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [tripBudget, setTripBudget] = useState<number | null>(null);
  const [tripCurrency, setTripCurrency] = useState("BRL");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    title: string; category: string; amount: string; currency: string;
    date: string; notes: string; paidBy: string; paidById: string; sharedBy: string[];
  }>({
    title: "", category: "OTHER", amount: "", currency: "BRL", date: "", notes: "", paidBy: "", paidById: "", sharedBy: [],
  });

  async function load() {
    const [expRes, tripRes, partRes, memRes] = await Promise.all([
      fetch(`/api/trips/${id}/expenses`),
      fetch(`/api/trips/${id}`),
      fetch(`/api/trips/${id}/participants`),
      fetch(`/api/trips/${id}/members`),
    ]);
    if (expRes.ok) setExpenses(await expRes.json());
    if (partRes.ok) setParticipants(await partRes.json());
    if (memRes.ok) {
      const m = await memRes.json();
      const list: Member[] = [];
      if (m.owner) list.push({ userId: m.owner.id, name: m.owner.name || m.owner.email });
      for (const mem of m.members ?? []) list.push({ userId: mem.user.id, name: mem.user.name || mem.user.email });
      setMembers(list);
    }
    if (tripRes.ok) {
      const trip = await tripRes.json();
      setTripBudget(trip.budget);
      setTripCurrency(trip.currency ?? "BRL");
      setForm((p) => ({ ...p, currency: trip.currency ?? "BRL" }));
    }
  }

  useEffect(() => { load(); }, [id]);

  // Grupo: recarrega ao voltar o foco à aba, para ver lançamentos de outros membros.
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addParticipant() {
    const name = newParticipant.trim();
    if (!name) return;
    setNewParticipant("");
    await fetch(`/api/trips/${id}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    load();
  }

  async function removeParticipant(participantId: string) {
    await fetch(`/api/trips/${id}/participants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId }),
    });
    load();
  }

  const nameOf = (pid: string) => participants.find((p) => p.id === pid)?.name ?? "?";

  // Adiciona os membros da viagem (grupo) como participantes da divisão, vinculando o userId.
  async function addFromGroup() {
    const existing = new Set(participants.map((p) => p.name.trim().toLowerCase()));
    for (const m of members) {
      if (existing.has(m.name.trim().toLowerCase())) continue;
      await fetch(`/api/trips/${id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: m.name, userId: m.userId }),
      });
    }
    load();
  }

  // Quitar: registra um lançamento de acerto (transferência) que zera a dívida do par.
  async function settleUp(fromId: string, toId: string, amount: number) {
    await fetch(`/api/trips/${id}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Acerto: ${nameOf(fromId)} → ${nameOf(toId)}`,
        category: "TRANSFER",
        amount,
        currency: tripCurrency,
        date: new Date().toISOString().slice(0, 10),
        paidById: fromId,
        sharedBy: [toId],
      }),
    });
    load();
  }

  // ── Acertar contas: saldos + transferências mínimas (usa src/lib/split.ts) ──
  const splitExpenses = expenses
    .filter((e) => e.paidById)
    .map((e) => ({
      amount: e.amount,
      paidBy: e.paidById as string,
      sharedBy: e.shares.map((s) => s.participantId),
    }));
  const balances = participants.length > 0 ? computeBalances(splitExpenses, participants.map((p) => p.id)) : {};
  const settlements = participants.length > 0 ? simplifyDebts(balances) : [];
  const netValues = participants.map((p) => balances[p.id] ?? 0);
  const totalToSettle = netValues.filter((v) => v > 0.005).reduce((s, v) => s + v, 0);
  const debtorsCount = netValues.filter((v) => v < -0.005).length;
  const creditorsCount = netValues.filter((v) => v > 0.005).length;

  // Iniciais coloridas por participante (avatar sem foto)
  const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function openEdit(expense: Expense) {
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      currency: expense.currency,
      date: expense.date.slice(0, 10),
      notes: expense.notes ?? "",
      paidBy: expense.paidBy ?? "",
      paidById: expense.paidById ?? "",
      sharedBy: expense.shares.map((s) => s.participantId),
    });
    setEditingId(expense.id);
    setOpen(true);
  }

  function openNew() {
    setEditingId(null);
    setForm({
      title: "", category: "OTHER", amount: "", currency: tripCurrency, date: new Date().toISOString().slice(0, 10),
      notes: "", paidBy: "", paidById: "", sharedBy: participants.map((p) => p.id),
    });
    setOpen(true);
  }

  function toggleShare(pid: string) {
    setForm((p) => ({
      ...p,
      sharedBy: p.sharedBy.includes(pid) ? p.sharedBy.filter((x) => x !== pid) : [...p.sharedBy, pid],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = editingId ? { ...form, expenseId: editingId } : form;
    const res = await fetch(`/api/trips/${id}/expenses`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setEditingId(null);
      setForm({ title: "", category: "OTHER", amount: "", currency: tripCurrency, date: "", notes: "", paidBy: "", paidById: "", sharedBy: participants.map((p) => p.id) });
      load();
    }
  }

  async function handleDelete(expenseId: string) {
    if (!(await confirmDialog(t.budget.confirmDelete))) return;
    await fetch(`/api/trips/${id}/expenses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId }),
    });
    load();
  }

  const realExpenses = expenses.filter((e) => e.category !== "TRANSFER");
  const totalSpent = realExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = realExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const budgetPct = tripBudget ? Math.min((totalSpent / tripBudget) * 100, 100) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t.budget.title}</h2>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t.budget.addExpense}
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t.budget.totalSpent}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpent, tripCurrency)}</p>
          </CardContent>
        </Card>
        {tripBudget && (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{t.budget.totalBudget}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(tripBudget, tripCurrency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{t.budget.remaining}</p>
                <p className={`text-2xl font-bold mt-1 ${tripBudget - totalSpent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(tripBudget - totalSpent, tripCurrency)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Barra de progresso */}
      {budgetPct !== null && (
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{budgetPct.toFixed(0)}% {t.budget.budgetPct}</span>
            <span>{formatCurrency(totalSpent, tripCurrency)} / {formatCurrency(tripBudget!, tripCurrency)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${budgetPct > 90 ? "bg-red-500" : budgetPct > 70 ? "bg-yellow-500" : "bg-green-500"}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Por categoria */}
      {Object.keys(byCategory).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">{t.budget.categoryBreakdown}</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, val]) => (
              <span key={cat} className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[cat]}`}>
                {expenseCategoryLabel(cat, t.expenseCategories as Record<string, string>)}: {formatCurrency(val, tripCurrency)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Grupo & divisão de contas ── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Grupo &amp; divisão de contas</h3>
            <p className="text-xs text-gray-500">Adicione quem está viajando junto para dividir as despesas.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {participants.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-gray-100 text-gray-700">
              {p.name}
              <button onClick={() => removeParticipant(p.id)} className="text-gray-500 hover:text-red-500" aria-label="Remover">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addParticipant(); } }}
            placeholder="Nome do participante"
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addParticipant} className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
        {members.length > 0 && (
          <button
            type="button"
            onClick={addFromGroup}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            <Users className="h-3.5 w-3.5" /> Adicionar participantes do grupo ({members.length})
          </button>
        )}

        {participants.length > 1 && splitExpenses.length > 0 && (
          <div className="pt-3 border-t border-gray-100 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Acertar contas</p>

            {/* Barra de resumo */}
            <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-gray-100 text-center">
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">A acertar</p>
                <p className="text-base font-black text-gray-900 mt-0.5">{formatCurrency(totalToSettle, tripCurrency)}</p>
              </div>
              <div className="p-3 border-x border-gray-100 bg-rose-50/50">
                <p className="text-[10px] font-bold uppercase tracking-wide text-rose-400">Devem</p>
                <p className="text-base font-black text-rose-600 mt-0.5">{debtorsCount}</p>
              </div>
              <div className="p-3 bg-emerald-50/50">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-500">Recebem</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">{creditorsCount}</p>
              </div>
            </div>

            {/* Saldo por pessoa */}
            <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {participants.map((p) => {
                const net = balances[p.id] ?? 0;
                const settled = Math.abs(net) < 0.005;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0 ${settled ? "bg-gray-300" : net > 0 ? "bg-emerald-500" : "bg-rose-500"}`}>
                      {initial(p.name)}
                    </div>
                    <span className="font-semibold text-gray-900 flex-1 min-w-0 truncate">{p.name}</span>
                    {settled ? (
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> quitado</span>
                    ) : (
                      <div className="text-right">
                        <span className={`block text-[10px] font-bold uppercase tracking-wide ${net > 0 ? "text-emerald-500" : "text-rose-400"}`}>
                          {net > 0 ? "recebe" : "deve"}
                        </span>
                        <span className={`block text-sm font-black ${net > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {formatCurrency(Math.abs(net), tripCurrency)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Como acertar (quem paga quem, já com descontos) */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Como acertar</p>
              {settlements.length === 0 ? (
                <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5"><Check className="h-4 w-4" /> Tudo quitado</p>
              ) : (
                <div className="space-y-2">
                  {settlements.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0">{initial(nameOf(s.from))}</div>
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[5.5rem] sm:max-w-none">{nameOf(s.from)}</span>
                      <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0">{initial(nameOf(s.to))}</div>
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[5.5rem] sm:max-w-none">{nameOf(s.to)}</span>
                      <span className="ml-auto text-sm font-black text-primary-600 shrink-0">{formatCurrency(s.amount, tripCurrency)}</span>
                      <button
                        type="button"
                        onClick={() => settleUp(s.from, s.to, s.amount)}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white shrink-0 hover:bg-emerald-700 transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500">Descontos já aplicados — o mínimo de pagamentos para todos ficarem quites. Considera despesas com pagador definido, na moeda da viagem.</p>
          </div>
        )}
      </div>

      {/* Câmbio partners */}
      <CurrencyPartners hasForeignExpenses={expenses.some((e) => e.currency !== tripCurrency && e.currency !== "BRL")} />

      {/* Lista de despesas */}
      {realExpenses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">💰</div>
          <p className="font-medium">{t.budget.noExpenses}</p>
          <p className="text-sm mt-1">{t.budget.expenseName}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {realExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[expense.category]}`}>
                        {expenseCategoryLabel(expense.category, t.expenseCategories as Record<string, string>)}
                      </span>
                      <span className="font-medium text-gray-900">{expense.title}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>{formatDate(expense.date)}</span>
                      {expense.paidById && <span>{t.budget.paidBy}: {nameOf(expense.paidById)}</span>}
                      {!expense.paidById && expense.paidBy && <span>{t.budget.paidBy}: {expense.paidBy}</span>}
                      {expense.shares.length > 0 && <span>÷ {expense.shares.length}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-gray-900">{formatCurrency(expense.amount, expense.currency)}</span>
                    <button onClick={() => openEdit(expense)} className="text-gray-300 hover:text-primary-500 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null); }}>
        <DialogHeader>
          <DialogTitle>{editingId ? t.budget.dialogEdit : t.budget.dialogNew}</DialogTitle>
          <DialogClose onClose={() => { setOpen(false); setEditingId(null); }} />
        </DialogHeader>
        <DialogBody>
          <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.budget.expenseName} *</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder={t.budget.expenseNamePlaceholder} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.budget.category}</Label>
                <Select name="category" value={form.category} onChange={handleChange}>
                  <option value="ACCOMMODATION">{t.expenseCategories.ACCOMMODATION}</option>
                  <option value="TRANSPORT">{t.expenseCategories.TRANSPORT}</option>
                  <option value="FOOD">{t.expenseCategories.FOOD}</option>
                  <option value="ACTIVITY">{t.expenseCategories.ACTIVITY}</option>
                  <option value="SHOPPING">{t.expenseCategories.SHOPPING}</option>
                  <option value="HEALTH">{t.expenseCategories.HEALTH}</option>
                  <option value="OTHER">{t.expenseCategories.OTHER}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.common.date} *</Label>
                <Input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>{t.budget.amount} *</Label>
                <CurrencyInput
                  value={form.amount}
                  onChange={(raw) => setForm((p) => ({ ...p, amount: raw }))}
                  currency={form.currency}
                  onCurrencyChange={(c) => setForm((p) => ({ ...p, currency: c }))}
                  required
                />
              </div>
            </div>
            {participants.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label>Quem pagou</Label>
                  <Select name="paidById" value={form.paidById} onChange={handleChange}>
                    <option value="">— Ninguém / não dividir —</option>
                    {participants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dividir entre</Label>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => {
                      const on = form.sharedBy.includes(p.id);
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => toggleShare(p.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${on ? "bg-primary-600 text-white border-primary-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>{t.budget.paidBy}</Label>
                <Input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder={t.budget.payer} />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t.common.notes}</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); }}>{t.common.cancel}</Button>
          <Button type="submit" form="expense-form" disabled={loading}>{loading ? t.common.saving : editingId ? t.common.saveChanges : t.common.add}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
