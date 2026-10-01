import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

// Crawling stays allowed even in concept mode: social preview bots (X, LinkedIn)
// honour robots.txt, and indexing is controlled by the robots meta tag instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
