// Pilha de elementos "dispensáveis" (modais, drawers, confirmações) abertos.
//
// Existe por causa do botão VOLTAR do Android: o handler global do Capacitor não
// enxerga o estado da UI, então voltar com um modal aberto navegava para fora
// (perdendo o formulário) ou — se não houvesse histórico — FECHAVA O APP.
// O `Dialog` só escutava `Escape`, tecla que não existe no Android.
//
// Cada componente dispensável se registra ao abrir e se remove ao fechar. O
// handler do voltar consome o topo da pilha antes de considerar navegar/sair.

type DismissFn = () => void;

const stack: Array<{ id: symbol; dismiss: DismissFn }> = [];

/** Registra um dispensável aberto. Retorna a função para desregistrar. */
export function pushDismissable(dismiss: DismissFn): () => void {
  const id = Symbol("dismissable");
  stack.push({ id, dismiss });
  return () => {
    const i = stack.findIndex((entry) => entry.id === id);
    if (i !== -1) stack.splice(i, 1);
  };
}

/**
 * Fecha o dispensável mais recente, se houver.
 * @returns true se algo foi fechado (então o voltar não deve navegar).
 */
export function dismissTop(): boolean {
  const top = stack.pop();
  if (!top) return false;
  top.dismiss();
  return true;
}

export function hasDismissable(): boolean {
  return stack.length > 0;
}
