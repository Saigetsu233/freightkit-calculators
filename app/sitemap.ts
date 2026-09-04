import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";
import { guides } from "./lib/guides";
import { topics } from "./lib/topics";
import { freightQuestions } from "./lib/freight-questions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shipmathlab.com";
  const contentLastModified = new Date("2026-08-14");
  const latestLastModified = new Date("2026-09-05");
  return [
    { url: base, lastModified: latestLastModified, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, lastModified: tool.reviewed ? new Date(tool.reviewed) : contentLastModified, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/guides`, lastModified: contentLastModified, changeFrequency: "weekly", priority: .8 },
    { url: `${base}/freight-planner`, lastModified: contentLastModified, changeFrequency: "weekly", priority: .95 },
    { url: `${base}/questions`, lastModified: contentLastModified, changeFrequency: "weekly", priority: .9 },
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, lastModified: contentLastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ...topics.map((topic) => ({ url: `${base}/topics/${topic.slug}`, lastModified: contentLastModified, changeFrequency: "monthly" as const, priority: .9 })),
    ...freightQuestions.map((question) => ({ url: `${base}/questions/${question.slug}`, lastModified: contentLastModified, changeFrequency: "monthly" as const, priority: .85 })),
    { url: `${base}/resources`, lastModified: contentLastModified, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/embed`, lastModified: contentLastModified, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/resources/for-publishers`, lastModified: contentLastModified, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/about`, lastModified: contentLastModified, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/methodology`, lastModified: contentLastModified, changeFrequency: "monthly", priority: .6 },
    { url: `${base}/changelog`, lastModified: latestLastModified, changeFrequency: "monthly", priority: .5 },
    { url: `${base}/privacy`, lastModified: contentLastModified, changeFrequency: "yearly", priority: .2 },
    { url: `${base}/nl/tools/laadmeter-calculator`, lastModified: latestLastModified, changeFrequency: "monthly", priority: .9, alternates: { languages: { en: `${base}/tools/load-meter-calculator`, nl: `${base}/nl/tools/laadmeter-calculator` } } },
  ];
}
