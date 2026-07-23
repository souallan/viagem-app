// Guarda no aparelho se o usuário é Premium, para que o app saiba disso mesmo
// OFFLINE (quando não dá para consultar /api/user/plan). Atualizado sempre que há
// conexão. Usado para liberar/bloquear o modo offline, que é recurso Premium.

const CHAVE = "roteiroapp-premium";

export function setPremiumCache(isPremium: boolean) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CHAVE, isPremium ? "1" : "0");
  } catch {
    /* localStorage indisponível — ignora */
  }
}

/**
 * Último status conhecido: true/false se já foi determinado alguma vez com
 * conexão; null se nunca soubemos (usuário nunca abriu online neste aparelho).
 */
export function getPremiumCache(): boolean | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const v = localStorage.getItem(CHAVE);
    if (v === "1") return true;
    if (v === "0") return false;
    return null;
  } catch {
    return null;
  }
}
