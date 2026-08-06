import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";
import { guides } from "./lib/guides";
import { topics } from "./lib/topics";
import { freightQuestions } from "./lib/freight-questions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shipmathlab.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/guides`, changeFrequency: "weekly", priority: .8 },
    { url: `${base}/freight-planner`, changeFrequency: "weekly", priority: .95 },
    { url: `${base}/questions`, changeFrequency: "weekly", priority: .9 },
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...topics.map((topic) => ({ url: `${base}/topics/${topic.slug}`, changeFrequency: "monthly" as const, priority: .9 })),
    ...freightQuestions.map((question) => ({ url: `${base}/questions/${question.slug}`, changeFrequency: "monthly" as const, priority: .85 })),
    { url: `${base}/resources`, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/embed`, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/resources/for-publishers`, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/methodology`, changeFrequency: "monthly", priority: .6 },
    { url: `${base}/changelog`, changeFrequency: "monthly", priority: .5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: .2 },
  ];
}
