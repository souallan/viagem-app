export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl border-2 border-primary-600/30 border-t-primary-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Carregando...</p>
      </div>
    </div>
  );
}
