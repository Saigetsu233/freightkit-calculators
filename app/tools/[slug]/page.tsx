import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "../../components/Calculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getTool, tools } from "../../lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.intro,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: `${tool.title} | FreightKit`, description: tool.intro },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const related = tools.filter((item) => item.slug !== tool.slug).slice(0, 3);

  return (
    <main className="tool-page">
      <SiteHeader />
      <div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><span>{tool.category}</span></div>
      <section className="shell tool-hero">
        <div><p className="eyebrow">{tool.category} calculator</p><h1>{tool.title}</h1><p className="tool-summary">{tool.intro}</p></div>
        <div className="tool-meta">
          <div><span>Cost</span><strong>Free</strong></div>
          <div><span>Account</span><strong>Not required</strong></div>
          <div><span>Result</span><strong>Updates live</strong></div>
        </div>
      </section>
      <section className="calculator-band"><div className="shell calculator-shell"><Calculator slug={tool.slug} /></div></section>
      <section className="shell method-section">
        <div><p className="eyebrow">Method &amp; limits</p><h2>How this estimate works</h2></div>
        <div className="method-copy"><p>FreightKit keeps the working visible so you can sense-check the answer before using it in a decision.</p><div className="formula-box">{tool.formula}</div><p>{tool.assumption}</p><p className="fine-print">This calculator is a planning aid, not a carrier quotation, engineering assessment, or professional advice. Verify critical figures against current supplier and carrier documentation.</p></div>
      </section>
      <section className="shell next-tools"><p className="eyebrow">Keep calculating</p><h2>Related tools</h2><div className="next-grid">{related.map((item)=><Link className="next-card" key={item.slug} href={`/tools/${item.slug}`}><span>{item.category}</span><strong>{item.shortTitle} ↗</strong></Link>)}</div></section>
      <SiteFooter />
    </main>
  );
}
