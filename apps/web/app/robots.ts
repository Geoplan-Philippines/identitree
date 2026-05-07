import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/settings/",
        "/api/",
        "/auth/",
        "/login",
        "/signup",
        "/reset-password",
      ],
    },
    sitemap: "https://identitree.geoplanph.com/sitemap.xml",
  };
}
