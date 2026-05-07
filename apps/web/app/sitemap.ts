import { MetadataRoute } from "next";
import { getPublicSitemapData } from "@/lib/services/nfc-cards.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = "https://identitree.geoplanph.com";

  // 1. Define static routes
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

  // 2. Fetch and add dynamic profile routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const profiles = await getPublicSitemapData();
    dynamicRoutes = profiles.map((p) => ({
      url: `${baseUrl}/${p.orgSlug}/${p.profileSlug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic sitemap data:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}

