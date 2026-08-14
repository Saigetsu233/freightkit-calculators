import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "../../components/Calculator";
import { getTool } from "../../lib/tools";

const embeddableSlugs = [
  "dimensional-weight-calculator",
  "pallet-load-calculator",
  "lcl-chargeable-volume-calculator",
  "cbm-calculator",
  "landed-cost-calculator",
];

export function generateStaticParams() {
  return embeddableSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  return {
    title: tool ? `Embed ${tool.shortTitle}` : "ShipMathLab calculator",
    robots: { index: false, follow: true },
  };
}

export default async function EmbeddedCalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!embeddableSlugs.includes(slug)) notFound();
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <main className="embed-page">
      <header className="embed-header">
        <div><span className="brand-mark" aria-hidden="true">SM</span><strong>{tool.title}</strong></div>
        <Link href={`/tools/${slug}`} target="_blank">Open full guide ↗</Link>
      </header>
      <div className="embed-calculator"><Calculator slug={slug} /></div>
      <footer className="embed-footer"><Link href={`/tools/${slug}`} target="_blank">Open the full {tool.shortTitle} guide ↗</Link><Link href="/" target="_blank">Powered by ShipMathLab · transparent shipping formulas</Link></footer>
    </main>
  );
}
