import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tawakkulzone.shop";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/pagol-aso-naki",
        "/pagol-aso-naki/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}