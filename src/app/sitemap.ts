import type { MetadataRoute } from "next";
import { listExperiments } from "@/lib/experiments";

const BASE = "https://www.weekend-experiments.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const experiments = await listExperiments();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/experiments`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/kits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/merch`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const experimentRoutes: MetadataRoute.Sitemap = experiments.map((e) => ({
    url: `${BASE}/experiments/${e.id}`,
    lastModified: e.updatedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...experimentRoutes];
}
