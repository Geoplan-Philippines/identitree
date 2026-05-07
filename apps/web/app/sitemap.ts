import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://identitree.geoplanph.com";

  // Define static routes
  const staticRoutes = [
    "",
    "/login",
    "/signup",
    "/activate",
    "/claim",
    "/docs",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
