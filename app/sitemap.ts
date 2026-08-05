import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";
import { guides } from "./lib/guides";
import { topics } from "./lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shipmathlab.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/guides`, changeFrequency: "weekly", priority: .8 },
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...topics.map((topic) => ({ url: `${base}/topics/${topic.slug}`, changeFrequency: "monthly" as const, priority: .9 })),
    { url: `${base}/resources`, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: .2 },
  ];
}
