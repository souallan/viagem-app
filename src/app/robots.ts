import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/privacy", "/terms", "/pricing", "/blog", "/blog/"],
        disallow: ["/dashboard", "/trips/", "/backoffice/", "/api/", "/profile", "/experiences/", "/routes/", "/tips"],
      },
    ],
    sitemap: "https://roteiroapp.com/sitemap.xml",
  };
}
