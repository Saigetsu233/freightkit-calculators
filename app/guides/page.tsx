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
  return <main><SiteHeader/><section className="shell collection-hero"><p className="eyebrow">Field guides</p><h1>Make the calculation.<br/>Challenge the assumptions.</h1><p>Sixteen practical workflows built around real packaging, freight, warehouse, and inventory decisions—not filler written to catch a keyword.</p></section><section className="shell guide-grid">{guides.map((guide)=><Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><div><span>{guide.category}</span><span>{guide.readTime}</span></div><h2>{guide.title}</h2><p>{guide.description}</p><strong>Read the guide ↗</strong></Link>)}</section><SiteFooter/></main>;
}
