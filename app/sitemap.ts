import type { MetadataRoute } from "next";
import { getSiteUrl, NAV_LINKS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return NAV_LINKS.map((link) => ({
    url: new URL(link.href, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: link.href === "/" ? "weekly" : "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
