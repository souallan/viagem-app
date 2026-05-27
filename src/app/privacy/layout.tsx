import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — RoteiroApp",
  description: "Política de Privacidade e proteção de dados do RoteiroApp, conforme a LGPD (Lei 13.709/2018).",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#f8fafc" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
}
