"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: string;
  onChange: (raw: string) => void;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: "BRL", symbol: "R$",  label: "Real (BRL)" },
  { code: "USD", symbol: "US$", label: "Dólar (USD)" },
  { code: "EUR", symbol: "€",   label: "Euro (EUR)" },
  { code: "GBP", symbol: "£",   label: "Libra (GBP)" },
  { code: "ARS", symbol: "$",   label: "Peso Arg. (ARS)" },
  { code: "CLP", symbol: "$",   label: "Peso Chi. (CLP)" },
  { code: "COP", symbol: "$",   label: "Peso Col. (COP)" },
  { code: "PEN", symbol: "S/",  label: "Sol (PEN)" },
  { code: "UYU", symbol: "$U",  label: "Peso Uru. (UYU)" },
  { code: "BOB", symbol: "Bs",  label: "Boliviano (BOB)" },
  { code: "PYG", symbol: "₲",   label: "Guarani (PYG)" },
  { code: "JPY", symbol: "¥",   label: "Iene (JPY)" },
  { code: "CNY", symbol: "¥",   label: "Yuan (CNY)" },
  { code: "KRW", symbol: "₩",   label: "Won (KRW)" },
  { code: "INR", symbol: "₹",   label: "Rupia (INR)" },
  { code: "THB", symbol: "฿",   label: "Baht (THB)" },
  { code: "AUD", symbol: "A$",  label: "Dólar Aus. (AUD)" },
  { code: "CAD", symbol: "C$",  label: "Dólar Can. (CAD)" },
  { code: "CHF", symbol: "Fr",  label: "Franco Suíço (CHF)" },
  { code: "MXN", symbol: "$",   label: "Peso Mex. (MXN)" },
  { code: "AED", symbol: "د.إ", label: "Dirham (AED)" },
  { code: "SGD", symbol: "S$",  label: "Dólar Sing. (SGD)" },
  { code: "HKD", symbol: "HK$", label: "Dólar HK (HKD)" },
  { code: "NOK", symbol: "kr",  label: "Coroa Nor. (NOK)" },
  { code: "SEK", symbol: "kr",  label: "Coroa Sue. (SEK)" },
  { code: "DKK", symbol: "kr",  label: "Coroa Din. (DKK)" },
  { code: "PLN", symbol: "zł",  label: "Zloty (PLN)" },
  { code: "CZK", symbol: "Kč",  label: "Koruna (CZK)" },
  { code: "HUF", symbol: "Ft",  label: "Forint (HUF)" },
  { code: "TRY", symbol: "₺",   label: "Lira (TRY)" },
  { code: "EGP", symbol: "E£",  label: "Libra Egip. (EGP)" },
  { code: "ZAR", symbol: "R",   label: "Rand (ZAR)" },
  { code: "NZD", symbol: "NZ$", label: "Dólar NZ (NZD)" },
];

function getSymbol(code: string) {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}

function rawToDisplay(raw: string): string {
  if (!raw) return "";
  const num = parseFloat(raw);
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CurrencyInput({
  value,
  onChange,
  currency = "BRL",
  onCurrencyChange,
  placeholder = "0,00",
  className,
  name,
  required,
  disabled,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(() => rawToDisplay(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDisplay(rawToDisplay(value));
  }, [value, focused]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setDisplay("");
      onChange("");
      return;
    }
    const cents = parseInt(digits, 10);
    const raw = (cents / 100).toFixed(2);
    const formatted = parseFloat(raw).toLocaleString("pt-BR", {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
    setDisplay(formatted);
    onChange(raw);
  }

  const symbol = getSymbol(currency);
  const hasSelector = !!onCurrencyChange;

  if (hasSelector) {
    return (
      <div className={cn("flex h-11 rounded-xl border border-gray-200 overflow-hidden focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/15 transition-all", disabled && "opacity-50", className)}>
        <select
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
          disabled={disabled}
          className="shrink-0 appearance-none bg-gray-50 border-r border-gray-200 px-2 text-xs font-bold text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          style={{ minWidth: symbol.length <= 2 ? "3rem" : "3.5rem" }}
          title="Selecionar moeda"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={display}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 min-w-0 px-3 text-sm font-medium text-gray-900 text-right bg-white focus:outline-none placeholder:text-gray-400"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <span className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold select-none pointer-events-none",
        display ? "text-gray-700" : "text-gray-400"
      )}>
        {symbol}
      </span>
      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={display}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="off"
        className={cn(
          "w-full h-11 rounded-xl border bg-white text-base sm:text-sm text-gray-900 text-right pr-3",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all",
          "border-gray-200 focus:border-primary-400 focus:ring-primary-400/15",
          symbol.length <= 2 ? "pl-9" : "pl-12",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      />
    </div>
  );
}
