import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "../../components/Calculator";
import { EmbedPanel } from "../../components/EmbedPanel";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getGuidesForTool } from "../../lib/guides";
import { getPartnerForTool } from "../../lib/monetization";
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
  const related = tools.filter((item) => item.slug !== tool.slug).sort((a,b)=>Number(b.category===tool.category)-Number(a.category===tool.category)).slice(0, 3);
  const guides = getGuidesForTool(tool.slug);
  const partner = getPartnerForTool(tool.slug);
  const embeddable = ["dimensional-weight-calculator", "pallet-load-calculator", "lcl-chargeable-volume-calculator"].includes(tool.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.intro,
    url: `https://shipmathlab.com/tools/${tool.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [tool.formula, "Live calculation", "Copyable result", ...(embeddable ? ["Embeddable calculator"] : [])],
  };

  return (
    <main className="tool-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><span>{tool.category}</span></div>
      <section className="shell tool-hero">
        <div><p className="eyebrow">{tool.category} calculator</p><h1>{tool.title}</h1><p className="tool-summary">{tool.intro}</p></div>
        <div className="tool-meta">
          <div><span>Cost</span><strong>Free</strong></div>
          <div><span>Account</span><strong>Not required</strong></div>
          <div><span>Result</span><strong>Updates live</strong></div>
          {tool.reviewed ? <div><span>Rules reviewed</span><strong>{tool.reviewed}</strong></div> : null}
        </div>
      </section>
      <section className="calculator-band"><div className="shell calculator-shell"><Calculator slug={tool.slug} /></div></section>
      <section className="shell tool-product-cta"><div><p className="eyebrow">Need the repeatable version?</p><h2>Carry this result into the $19 operations workbook.</h2><p>Batch calculations, quote comparisons, landed cost, pallet planning, and margin sheets stay connected in one editable Excel file.</p></div><Link className="button button-primary" href="/resources#spreadsheet-pack">Preview the workbook ↗</Link></section>
      <section className="shell method-section">
        <div><p className="eyebrow">Method &amp; limits</p><h2>How this estimate works</h2></div>
        <div className="method-copy"><p>FreightKit keeps the working visible so you can sense-check the answer before using it in a decision.</p><div className="formula-box">{tool.formula}</div><p>{tool.assumption}</p>{tool.sources?.length ? <div className="tool-sources"><strong>Primary references</strong>{tool.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div> : null}<p className="fine-print">This calculator is a planning aid, not a carrier quotation, engineering assessment, or professional advice. Verify critical figures against current supplier and carrier documentation.</p></div>
      </section>
      {embeddable ? <EmbedPanel slug={tool.slug} title={tool.title} /> : null}
      {guides.length ? <section className="shell tool-guides"><p className="eyebrow">Use the number well</p><div className="tool-guide-grid">{guides.map((guide)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.readTime}</span><strong>{guide.title} ↗</strong><p>{guide.description}</p></Link>)}</div></section> : null}
      {partner?.url ? <section className="shell partner-inline"><span>Relevant partner resource</span><div><h2>{partner.name}</h2><p>{partner.description}</p></div><a className="text-link" href={partner.url} target="_blank" rel="sponsored noopener noreferrer">View recommendation ↗</a></section> : null}
      <section className="shell next-tools"><p className="eyebrow">Keep calculating</p><h2>Related tools</h2><div className="next-grid">{related.map((item)=><Link className="next-card" key={item.slug} href={`/tools/${item.slug}`}><span>{item.category}</span><strong>{item.shortTitle} ↗</strong></Link>)}</div></section>
      <SiteFooter />
    </main>
  );
}
