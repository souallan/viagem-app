import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, pattern = "dd/MM/yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatCurrency(amount: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function tripStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PLANNING: "Planejando",
    CONFIRMED: "Confirmada",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };
  return labels[status] ?? status;
}

export function tripStatusColor(status: string) {
  const colors: Record<string, string> = {
    PLANNING: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-green-100 text-green-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export function activityTypeLabel(type: string) {
  const labels: Record<string, string> = {
    ACTIVITY: "Atividade",
    MEAL: "Refeição",
    TRANSPORT: "Transporte",
    ACCOMMODATION: "Hospedagem",
    EVENT: "Evento",
    OTHER: "Outro",
  };
  return labels[type] ?? type;
}

export function expenseCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    ACCOMMODATION: "Hospedagem",
    TRANSPORT: "Transporte",
    FOOD: "Alimentação",
    ACTIVITY: "Atividade",
    SHOPPING: "Compras",
    HEALTH: "Saúde",
    OTHER: "Outro",
  };
  return labels[category] ?? category;
}
