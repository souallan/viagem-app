import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/privacy", "/terms"],
        disallow: ["/dashboard", "/trips/", "/admin/", "/api/", "/profile"],
      },
    ],
    sitemap: "https://roteiroapp.com/sitemap.xml",
  };
}
