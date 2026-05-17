"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDate, formatCurrency, expenseCategoryLabel } from "@/lib/utils";

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
  const { id } = useParams<{ id: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tripBudget, setTripBudget] = useState<number | null>(null);
  const [tripCurrency, setTripCurrency] = useState("BRL");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/trips/${id}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setForm({ title: "", category: "OTHER", amount: "", currency: tripCurrency, date: "", notes: "", paidBy: "" });
      load();
    }
  }

  async function handleDelete(expenseId: string) {
    if (!confirm("Excluir esta despesa?")) return;
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
        <h2 className="text-lg font-semibold text-gray-900">Orçamento e despesas</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar despesa
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total gasto</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpent, tripCurrency)}</p>
          </CardContent>
        </Card>
        {tripBudget && (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Orçamento</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(tripBudget, tripCurrency)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Saldo</p>
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
            <span>{budgetPct.toFixed(0)}% do orçamento utilizado</span>
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
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Por categoria</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, val]) => (
              <span key={cat} className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[cat]}`}>
                {expenseCategoryLabel(cat)}: {formatCurrency(val, tripCurrency)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lista de despesas */}
      {expenses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💰</div>
          <p className="font-medium">Nenhuma despesa registrada</p>
          <p className="text-sm mt-1">Adicione gastos para controlar seu orçamento.</p>
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
                        {expenseCategoryLabel(expense.category)}
                      </span>
                      <span className="font-medium text-gray-900">{expense.title}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>{formatDate(expense.date)}</span>
                      {expense.paidBy && <span>Pago por: {expense.paidBy}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-gray-900">{formatCurrency(expense.amount, expense.currency)}</span>
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Nova despesa</DialogTitle>
          <DialogClose onClose={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Jantar no restaurante" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select name="category" value={form.category} onChange={handleChange}>
                  <option value="ACCOMMODATION">Hospedagem</option>
                  <option value="TRANSPORT">Transporte</option>
                  <option value="FOOD">Alimentação</option>
                  <option value="ACTIVITY">Atividade</option>
                  <option value="SHOPPING">Compras</option>
                  <option value="HEALTH">Saúde</option>
                  <option value="OTHER">Outro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Valor *</Label>
                <Input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select name="currency" value={form.currency} onChange={handleChange}>
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pago por</Label>
              <Input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder="Nome do pagante" />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="expense-form" disabled={loading}>{loading ? "Salvando..." : "Adicionar"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
