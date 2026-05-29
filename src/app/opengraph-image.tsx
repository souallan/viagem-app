import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RoteiroApp — Planejador de Viagens";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A1018 0%, #0E1828 60%, #091420 100%)",
          position: "relative",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "200px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,95,204,0.25) 0%, transparent 65%)",
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            boxShadow: "0 12px 40px rgba(26,95,204,0.50)",
          }}
        >
          <span style={{ fontSize: 40 }}>✈️</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          RoteiroApp
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(148,163,184,0.9)",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Planejador de viagens completo e gratuito
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {["✅ Roteiros", "💰 Orçamento", "📄 Documentos", "🧳 Lista de malas"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "8px 20px",
                color: "rgba(203,213,225,0.9)",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            color: "rgba(100,116,139,0.8)",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          roteiroapp.com
        </div>
      </div>
    ),
    { ...size }
  );
}
