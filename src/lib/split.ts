// Divisão de contas do grupo (estilo Splitwise, integrado ao orçamento).
// Núcleo algorítmico: calcula saldos e simplifica dívidas (mínimo de transferências).
// Puro e testável — sem dependências. UI/DB são construídos por cima disto.

export type SplitExpense = {
  amount: number;      // valor total (na moeda base da viagem)
  paidBy: string;      // id/nome de quem pagou
  sharedBy: string[];  // ids/nomes de quem divide (vazio = todos os participantes)
};

export type Settlement = { from: string; to: string; amount: number };

const round2 = (n: number) => Math.round(n * 100) / 100;
const EPS = 0.005;

/** Saldo líquido por participante: positivo = tem a receber, negativo = deve. */
export function computeBalances(
  expenses: SplitExpense[],
  participants: string[]
): Record<string, number> {
  const bal: Record<string, number> = {};
  for (const p of participants) bal[p] = 0;

  for (const e of expenses) {
    if (!(e.amount > 0)) continue;
    const sharers = e.sharedBy.length ? e.sharedBy : participants;
    if (sharers.length === 0) continue;
    const share = e.amount / sharers.length;
    bal[e.paidBy] = (bal[e.paidBy] ?? 0) + e.amount;
    for (const s of sharers) bal[s] = (bal[s] ?? 0) - share;
  }

  for (const k of Object.keys(bal)) bal[k] = round2(bal[k]);
  return bal;
}

/** Converte saldos em transferências mínimas para quitar tudo. */
export function simplifyDebts(balances: Record<string, number>): Settlement[] {
  const creditors = Object.entries(balances)
    .filter(([, v]) => v > EPS)
    .map(([p, v]) => ({ p, v }))
    .sort((a, b) => b.v - a.v);
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -EPS)
    .map(([p, v]) => ({ p, v: -v }))
    .sort((a, b) => b.v - a.v);

  const out: Settlement[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].v, creditors[j].v);
    if (pay > EPS) out.push({ from: debtors[i].p, to: creditors[j].p, amount: round2(pay) });
    debtors[i].v -= pay;
    creditors[j].v -= pay;
    if (debtors[i].v < EPS) i++;
    if (creditors[j].v < EPS) j++;
  }
  return out;
}

/** Atalho: das despesas + participantes direto para a lista de acertos. */
export function computeSettlements(
  expenses: SplitExpense[],
  participants: string[]
): Settlement[] {
  return simplifyDebts(computeBalances(expenses, participants));
}
