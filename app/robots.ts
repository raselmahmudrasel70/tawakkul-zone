import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tawakkulzone.shop";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/pagol-naki",
        "/pagol-naki/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}