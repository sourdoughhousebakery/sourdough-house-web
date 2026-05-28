import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = ["", "/menu", "/story", "/order", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}

