/**
 * Configurações globais do site — edite aqui para atualizar
 * nome, contato, redes sociais e direitos autorais em todo o app.
 */
export const SITE_CONFIG = {
  name:        "RoteiroApp",
  tagline:     "Travel Planner",
  description: "Planeje roteiros, organize hospedagens e compartilhe experiências de viagem.",
  url:         "https://roteiroapp.com",

  admin: {
    name:  "Allan Souza",
    email: "contato@roteiroapp.com",
    phone: "+55 (84) 99999-0000", // ajuste conforme necessário
  },

  social: {
    instagram: "https://instagram.com/roteiroapp",
    whatsapp:  "https://wa.me/5584999990000",
  },

  // Preencher quando o app for publicado nas lojas. Vazio = banner/lojas ficam ocultos.
  app: {
    android: "",   // ex.: https://play.google.com/store/apps/details?id=com.roteiroapp.app
    ios:     "",   // ex.: https://apps.apple.com/app/idXXXXXXXXXX
    iosAppId: "",  // ID numérico da App Store (para o smart banner do iOS Safari)
  },

  copyright: {
    year:  2026,
    owner: "RoteiroApp",
    text:  "Todos os direitos reservados.",
  },
} as const;
