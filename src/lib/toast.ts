// Toast leve, sem dependência de provider — substitui alert() nativo.
// Uso: toast("Salvo!") · toast("Erro ao salvar", "error")
export function toast(message: string, type: "success" | "error" | "info" = "info") {
  if (typeof document === "undefined") return;
  const colors: Record<string, string> = {
    success: "#059669",
    error: "#dc2626",
    info: "#1A5FCC",
  };
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.textContent = message;
  el.style.cssText = [
    "position:fixed",
    "left:50%",
    "bottom:24px",
    "transform:translateX(-50%) translateY(16px)",
    "z-index:9999",
    `background:${colors[type]}`,
    "color:#fff",
    "padding:12px 20px",
    "border-radius:12px",
    "font-size:14px",
    "font-weight:600",
    "box-shadow:0 10px 34px rgba(0,0,0,.28)",
    "opacity:0",
    "transition:opacity .25s ease, transform .25s ease",
    "max-width:min(92vw,420px)",
    "text-align:center",
    "line-height:1.35",
  ].join(";");
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
  });
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(16px)";
    setTimeout(() => el.remove(), 300);
  }, 3200);
}
