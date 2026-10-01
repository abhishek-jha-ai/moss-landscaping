import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { serviceAreas } from "@/data/serviceAreas";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    ...serviceAreas.map((a) => ({
      url: `${siteConfig.url}/service-areas/${a.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
