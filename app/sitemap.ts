import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/about`, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: .2 },
  ];
}
