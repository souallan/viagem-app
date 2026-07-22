import type { CapacitorConfig } from "@capacitor/cli";

// Modelo A (MVP): WebView remoto. O app nativo carrega o site hospedado
// (roteiroapp.com) e injeta os plugins nativos. A sessão NextAuth é first-party.
// webDir aponta para um fallback local (mobile/www) mostrado no cold start/offline.
// Para desenvolvimento apontando ao servidor local, troque server.url temporariamente
// (ex.: http://192.168.x.x:3000 + server.cleartext = true) e rode `npx cap sync`.
const config: CapacitorConfig = {
  appId: "com.roteiroapp.app",
  appName: "RoteiroApp",
  webDir: "mobile/www",
  server: {
    // Abre direto na área do app, NÃO na landing page. Um app que abre em página
    // de marketing ("conheça o RoteiroApp", planos, FAQ) parece um site dentro de
    // uma moldura. /dashboard exige sessão: o middleware manda para /login quando
    // não há, que é exatamente o que se espera ao abrir um app.
    url: "https://roteiroapp.com/dashboard",
    cleartext: false,
  },
  backgroundColor: "#0E1520",
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0E1520",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    Keyboard: {
      resize: "native",
    },
  },
};

export default config;
