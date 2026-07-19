"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">✈️</div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Você está offline
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          Sem conexão com a internet. As viagens, o roteiro e os documentos que você
          já abriu continuam disponíveis a partir do que foi salvo no aparelho.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm text-center"
            style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}
          >
            Ver minhas viagens salvas
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-800"
          >
            Tentar reconectar
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          Dica: abra o roteiro, os documentos e o mapa enquanto tem sinal para
          consultá-los offline durante a viagem.
        </p>
      </div>
    </div>
  );
}
