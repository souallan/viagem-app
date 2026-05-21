"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, Users, Plus, Trash2, Calculator, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CURRENCIES = [
  { code: "BRL", name: "Real brasileiro", flag: "🇧🇷" },
  { code: "USD", name: "Dólar americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Libra esterlina", flag: "🇬🇧" },
  { code: "JPY", name: "Iene japonês", flag: "🇯🇵" },
  { code: "AUD", name: "Dólar australiano", flag: "🇦🇺" },
  { code: "CAD", name: "Dólar canadense", flag: "🇨🇦" },
  { code: "CHF", name: "Franco suíço", flag: "🇨🇭" },
  { code: "ARS", name: "Peso argentino", flag: "🇦🇷" },
  { code: "MXN", name: "Peso mexicano", flag: "🇲🇽" },
  { code: "AED", name: "Dirham (EAU)", flag: "🇦🇪" },
  { code: "THB", name: "Baht tailandês", flag: "🇹🇭" },
  { code: "KRW", name: "Won sul-coreano", flag: "🇰🇷" },
  { code: "SGD", name: "Dólar de Singapura", flag: "🇸🇬" },
  { code: "CLP", name: "Peso chileno", flag: "🇨🇱" },
];

interface Person {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  currency: string;
}

export default function CurrencyPage() {
  const [from, setFrom] = useState("BRL");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Você" },
    { id: "2", name: "Pessoa 2" },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expForm, setExpForm] = useState({ description: "", amount: "", paidBy: "1", currency: "BRL" });
  const [newPersonName, setNewPersonName] = useState("");

  const fetchRates = useCallback(async () => {
    setRatesLoading(true);
    setRatesError(false);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/BRL");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setRatesError(true);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const convert = useCallback(
    (val: number, fromCode: string, toCode: string): number => {
      if (!rates) return 0;
      const fromRate = fromCode === "BRL" ? 1 : rates[fromCode];
      const toRate = toCode === "BRL" ? 1 : rates[toCode];
      if (!fromRate || !toRate) return 0;
      return (val / fromRate) * toRate;
    },
    [rates]
  );

  const converted = rates ? convert(parseFloat(amount) || 0, from, to) : null;

  function addPerson() {
    if (!newPersonName.trim()) return;
    setPeople((p) => [...p, { id: Date.now().toString(), name: newPersonName.trim() }]);
    setNewPersonName("");
  }

  function removePerson(personId: string) {
    if (people.length <= 2) return;
    setPeople((p) => p.filter((x) => x.id !== personId));
    setExpenses((prev) => prev.filter((e) => e.paidBy !== personId));
  }

  function addExpense() {
    if (!expForm.description.trim() || !expForm.amount) return;
    const amountInBRL = convert(parseFloat(expForm.amount), expForm.currency, "BRL");
    setExpenses((prev) => [
      ...prev,
      { id: Date.now().toString(), ...expForm, amount: amountInBRL },
    ]);
    setExpForm((p) => ({ ...p, description: "", amount: "" }));
  }

  function removeExpense(expId: string) {
    setExpenses((p) => p.filter((e) => e.id !== expId));
  }

  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const sharePerPerson = people.length > 0 ? grandTotal / people.length : 0;

  const balances = people.reduce<Record<string, number>>((acc, p) => {
    acc[p.id] = -sharePerPerson;
    return acc;
  }, {});
  expenses.forEach((exp) => {
    balances[exp.paidBy] = (balances[exp.paidBy] ?? 0) + exp.amount;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle, #2dd4bf 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1">
            💱 Divisas & Gastos
          </h1>
          <p className="text-slate-300 text-sm">Converta moedas e divida despesas do grupo</p>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-sky-500" aria-hidden="true" />
            Conversor de Moedas
          </h2>
          <button
            onClick={fetchRates}
            disabled={ratesLoading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-sky-600 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${ratesLoading ? "animate-spin" : ""}`} aria-hidden="true" />
            {lastUpdated ? `Atualizado ${lastUpdated}` : "Atualizar"}
          </button>
        </div>

        {ratesLoading && (
          <p className="text-sm text-gray-400 animate-pulse py-4">Carregando taxas de câmbio...</p>
        )}
        {ratesError && (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 mb-3">Não foi possível carregar as taxas. Verifique sua conexão.</p>
            <Button size="sm" variant="outline" onClick={fetchRates}>Tentar novamente</Button>
          </div>
        )}

        {!ratesLoading && !ratesError && rates && (
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div className="space-y-2">
                <Label>De</Label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => { setFrom(to); setTo(from); }}
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-sky-50 hover:border-sky-300 transition-colors"
                title="Inverter moedas"
              >
                <ArrowLeftRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
              </button>

              <div className="space-y-2">
                <Label>Para</Label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>

            <div className="rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Resultado</p>
              <p className="text-3xl font-bold text-gray-900">
                {converted !== null
                  ? `${CURRENCIES.find((c) => c.code === to)?.flag ?? ""} ${converted.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`
                  : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                1 {from} ={" "}
                {from !== to ? convert(1, from, to).toLocaleString("pt-BR", { maximumFractionDigits: 4 }) : "1"} {to}
                {" · "}Fonte: open.er-api.com
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 500, 1000].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="text-xs text-center py-2 rounded-lg bg-gray-50 hover:bg-sky-50 hover:text-sky-700 border border-gray-100 hover:border-sky-200 transition-colors font-medium"
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Quick reference table */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tabela de referência — 1 {from}
              </div>
              <div className="divide-y divide-gray-50">
                {CURRENCIES.filter((c) => c.code !== from).slice(0, 6).map((c) => (
                  <div key={c.code} className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-gray-600">{c.flag} {c.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {convert(1, from, c.code).toLocaleString("pt-BR", { maximumFractionDigits: 4 })} {c.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expense Splitter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Users className="h-5 w-5 text-teal-500" aria-hidden="true" />
          Divisão de Gastos do Grupo
        </h2>

        {/* People */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Participantes</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {people.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 rounded-full px-3 py-1"
              >
                <span className="text-xs font-medium text-sky-700">{p.name}</span>
                {people.length > 2 && (
                  <button
                    onClick={() => removePerson(p.id)}
                    className="text-sky-300 hover:text-red-500 transition-colors ml-0.5 text-base leading-none"
                    aria-label={`Remover ${p.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPerson(); } }}
              placeholder="Nome da pessoa..."
              className="h-8 text-sm"
            />
            <Button size="sm" variant="outline" onClick={addPerson} className="h-8 px-3 gap-1 shrink-0">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Adicionar
            </Button>
          </div>
        </div>

        {/* Add expense */}
        <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Registrar gasto</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Descrição</Label>
                <Input
                  value={expForm.description}
                  onChange={(e) => setExpForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Ex: Jantar em grupo"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valor</Label>
                <Input
                  type="number"
                  value={expForm.amount}
                  onChange={(e) => setExpForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="h-9 text-sm"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Moeda</Label>
                <select
                  value={expForm.currency}
                  onChange={(e) => setExpForm((p) => ({ ...p, currency: e.target.value }))}
                  className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pago por</Label>
                <select
                  value={expForm.paidBy}
                  onChange={(e) => setExpForm((p) => ({ ...p, paidBy: e.target.value }))}
                  className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button size="sm" onClick={addExpense} className="w-full gap-1.5">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Adicionar gasto
            </Button>
          </div>
        </div>

        {/* Expense list */}
        {expenses.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gastos registrados</p>
            <div className="space-y-1.5">
              {expenses.map((exp) => (
                <div key={exp.id} className="flex items-center gap-3 text-sm py-2 border-b border-gray-100">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-800 truncate block">{exp.description}</span>
                    <span className="text-xs text-gray-400">
                      pago por {people.find((p) => p.id === exp.paidBy)?.name ?? "—"}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0">
                    R$ {exp.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeExpense(exp.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remover gasto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold pt-2">
                <span className="text-gray-600">Total do grupo</span>
                <span className="text-gray-900">R$ {grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Cada pessoa deve</span>
                <span>R$ {sharePerPerson.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Balances */}
        {expenses.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calculator className="h-3.5 w-3.5" aria-hidden="true" /> Quem deve a quem
            </p>
            <div className="space-y-2">
              {people.map((p) => {
                const bal = balances[p.id] ?? 0;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border ${
                      bal > 0.01
                        ? "bg-emerald-50 border-emerald-100"
                        : bal < -0.01
                        ? "bg-red-50 border-red-100"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <span className="font-medium text-gray-800">{p.name}</span>
                    <span
                      className={`font-bold ${
                        bal > 0.01 ? "text-emerald-700" : bal < -0.01 ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {bal > 0.01
                        ? `+R$ ${bal.toFixed(2)} a receber`
                        : bal < -0.01
                        ? `-R$ ${Math.abs(bal).toFixed(2)} a pagar`
                        : "Quitado ✓"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Valores convertidos para BRL · Gastos divididos igualmente
            </p>
          </div>
        )}

        {expenses.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Calculator className="h-10 w-10 mx-auto mb-3 text-gray-200" aria-hidden="true" />
            <p className="text-sm font-medium">Nenhum gasto registrado ainda</p>
            <p className="text-xs mt-1">Adicione os gastos do grupo para calcular quem deve a quem.</p>
          </div>
        )}
      </div>
    </div>
  );
}
