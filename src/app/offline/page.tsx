export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">✈️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Você está offline</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Sem conexão com a internet. Suas viagens salvas ainda estão disponíveis se você as acessou antes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
