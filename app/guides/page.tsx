import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { guides } from "../lib/guides";

export const metadata: Metadata = {
  title: "Packaging, Freight & Inventory Guides",
  description: "Practical, transparent guides for packaging, freight quoting, warehouse planning, and inventory decisions.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return <main><SiteHeader/><section className="shell collection-hero"><p className="eyebrow">Field guides</p><h1>Measure, calculate,<br/>and check the result.</h1><p>{guides.length} guides for packaging, freight quotes, pallet planning, landed cost, warehouse work, and inventory decisions.</p></section><section className="shell guide-grid">{guides.map((guide)=><Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><div><span>{guide.category}</span><span>{guide.readTime}</span></div><h2>{guide.title}</h2><p>{guide.description}</p><strong>Read the guide ↗</strong></Link>)}</section><SiteFooter/></main>;
}
