"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Pencil, ExternalLink, ArrowRight } from "lucide-react";
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
          <p className="col-span-full text-[10px] text-gray-400 text-right">
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
  const [tripBudget, setTripBudget] = useState<number | null>(null);
  const [tripCurrency, setTripCurrency] = useState("BRL");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", category: "OTHER", amount: "", currency: "BRL", date: "", notes: "", paidBy: "",
  });

  async function load() {
    const [expRes, tripRes] = await Promise.all([
      fetch(`/api/trips/${id}/expenses`),
      fetch(`/api/trips/${id}`),
    ]);
    if (expRes.ok) setExpenses(await expRes.json());
    if (tripRes.ok) {
      const trip = await tripRes.json();
      setTripBudget(trip.budget);
      setTripCurrency(trip.currency ?? "BRL");
      setForm((p) => ({ ...p, currency: trip.currency ?? "BRL" }));
    }
  }

  useEffect(() => { load(); }, [id]);

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
    });
    setEditingId(expense.id);
    setOpen(true);
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
      setForm({ title: "", category: "OTHER", amount: "", currency: tripCurrency, date: "", notes: "", paidBy: "" });
      load();
    }
  }

  async function handleDelete(expenseId: string) {
    if (!confirm(t.budget.confirmDelete)) return;
    await fetch(`/api/trips/${id}/expenses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId }),
    });
    load();
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const budgetPct = tripBudget ? Math.min((totalSpent / tripBudget) * 100, 100) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t.budget.title}</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
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

      {/* Câmbio partners */}
      <CurrencyPartners hasForeignExpenses={expenses.some((e) => e.currency !== tripCurrency && e.currency !== "BRL")} />

      {/* Lista de despesas */}
      {expenses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💰</div>
          <p className="font-medium">{t.budget.noExpenses}</p>
          <p className="text-sm mt-1">{t.budget.expenseName}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
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
                      {expense.paidBy && <span>{t.budget.paidBy}: {expense.paidBy}</span>}
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-2">
              <Label>{t.budget.paidBy}</Label>
              <Input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder={t.budget.payer} />
            </div>
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
