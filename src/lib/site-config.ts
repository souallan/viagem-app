/**
 * Configurações globais do site — edite aqui para atualizar
 * nome, contato, redes sociais e direitos autorais em todo o app.
 */
export const SITE_CONFIG = {
  name:        "RoteiroApp",
  tagline:     "Travel Planner",
  description: "Planeje roteiros, organize hospedagens e compartilhe experiências de viagem.",
  url:         "https://RoteiroApp.com.br",

  admin: {
    name:  "Allan Souza",
    email: "contato@roteiroapp.com",
    phone: "+55 (84) 99999-0000", // ajuste conforme necessário
  },

  social: {
    instagram: "https://instagram.com/roteiroapp",
    whatsapp:  "https://wa.me/5584999990000",
  },

  copyright: {
    year:  2025,
    owner: "RoteiroApp",
    text:  "Todos os direitos reservados.",
  },
} as const;
