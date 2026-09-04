import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "../../components/Calculator";
import { EmbedPanel } from "../../components/EmbedPanel";
import { FormulaFlow } from "../../components/FormulaFlow";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getGuidesForTool } from "../../lib/guides";
import { getPartnerForTool } from "../../lib/monetization";
import { getTool, tools } from "../../lib/tools";
import { getTopicForTool } from "../../lib/topics";
import { priorityToolContent } from "../../lib/priority-content";
import { freightQuestions } from "../../lib/freight-questions";
import { localizedCoreToolPaths, type RegionalCoreTool } from "../../lib/regional-core-tools";
import { localePreferences, type SiteLocale } from "../../lib/locales";

const taxRecommendations: Record<string, { title: string; description: string; href: string; label: string }> = {
  "ecommerce-margin-calculator": {
    title: "Add sales tax to the selling-price calculation.",
    description: "TaxMathKit can add sales tax to a price or recover the pre-tax amount from a tax-inclusive total.",
    href: "https://taxmathkit.com/tools/sales-tax-calculator?utm_source=shipmathlab&utm_medium=referral&utm_campaign=tool-network",
    label: "Open the sales-tax calculator",
  },
  "landed-cost-calculator": {
    title: "Add or remove VAT before calculating landed cost.",
    description: "TaxMathKit includes VAT add and remove modes, country presets, and a custom-rate input.",
    href: "https://taxmathkit.com/tools/vat-calculator?utm_source=shipmathlab&utm_medium=referral&utm_campaign=tool-network",
    label: "Open the VAT calculator",
  },
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const socialImages: Record<string, string> = {
    "dimensional-weight-calculator": "/og-dimensional-weight.png",
    "pallet-load-calculator": "/og-pallet-load.png",
    "lcl-chargeable-volume-calculator": "/og-lcl-wm.png",
  };
  const regionalToolMap: Record<string, RegionalCoreTool> = {
    "dimensional-weight-calculator": "dimensional-weight",
    "pallet-load-calculator": "pallet-loading",
    "lcl-chargeable-volume-calculator": "lcl-chargeable-volume",
  };
  const localizedKey = regionalToolMap[tool.slug];
  const localizedLanguages = localizedKey ? Object.fromEntries(
    (Object.keys(localizedCoreToolPaths) as SiteLocale[]).map((locale) => [localePreferences[locale].languageTag, localizedCoreToolPaths[locale][localizedKey]]),
  ) : null;
  return {
    title: tool.title,
    description: tool.metaDescription ?? tool.intro,
    alternates: localizedLanguages ? { canonical: `/tools/${tool.slug}`, languages: { ...localizedLanguages, "x-default": `/tools/${tool.slug}` } } : tool.slug === "load-meter-calculator" ? {
      canonical: `/tools/${tool.slug}`,
      languages: {
        en: `/tools/${tool.slug}`,
        "nl-NL": "/nl/tools/laadmeter-calculator",
        "de-DE": "/de/tools/lademeter-rechner",
        "fr-FR": "/fr/outils/calculateur-metre-plancher",
        "ja-JP": "/ja/tools/truck-loading-calculator",
        "zh-CN": "/zh/tools/truck-loading-calculator",
        "x-default": `/tools/${tool.slug}`,
      },
    } : { canonical: `/tools/${tool.slug}` },
    openGraph: { title: `${tool.title} | ShipMathLab`, description: tool.metaDescription ?? tool.intro, url: `/tools/${tool.slug}`, images: socialImages[tool.slug] ? [socialImages[tool.slug]] : undefined },
    twitter: socialImages[tool.slug] ? { card: "summary_large_image", images: [socialImages[tool.slug]] } : undefined,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const related = tools.filter((item) => item.slug !== tool.slug).sort((a,b)=>Number(b.category===tool.category)-Number(a.category===tool.category)).slice(0, 3);
  const guides = getGuidesForTool(tool.slug);
  const priority = priorityToolContent[tool.slug];
  const toolQuestions = freightQuestions.filter((question) => question.tool === tool.slug).slice(0, 3);
  const nextSteps = related.slice(0, 2).map((item) => ({ href: `/tools/${item.slug}`, title: item.title, description: item.description }));
  const partner = getPartnerForTool(tool.slug);
  const embeddable = ["dimensional-weight-calculator", "pallet-load-calculator", "lcl-chargeable-volume-calculator", "cbm-calculator", "landed-cost-calculator"].includes(tool.slug);
  const topic = getTopicForTool(tool.slug);
  const taxRecommendation = taxRecommendations[tool.slug];
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
    featureList: [tool.formula, "Live calculation", "Copyable result", ...(tool.workedExample ? ["Worked example and common-error checks"] : []), ...(embeddable ? ["Embeddable calculator"] : [])],
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
      <section id="calculator" className="calculator-band"><div className="shell">
        {priority ? <div className="calculator-start"><div><p className="eyebrow">Example values included</p><strong>{tool.workedExample?.title ?? "Change any input to update the estimate"}</strong><p>{priority.searchLead}</p><code className="calculator-formula">{tool.formula}</code></div><a className="button button-primary" href="#calculator">Start with the example ↓</a></div> : null}
        <div className="calculator-shell"><Calculator slug={tool.slug} nextSteps={nextSteps} /></div>
      </div></section>
      <FormulaFlow slug={tool.slug} />
      {priority ? <section className="shell tool-intent-grid" aria-label="When to use this calculator"><article><p className="eyebrow">Use this when</p><h2>Questions this estimate can answer</h2><ul>{priority.useWhen.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p className="eyebrow">Not for</p><h2>Checks you still need to make</h2><ul>{priority.notFor.map((item) => <li key={item}>{item}</li>)}</ul></article></section> : null}
      {toolQuestions.length ? <section className="shell tool-guides"><p className="eyebrow">Related questions</p><div className="tool-guide-grid">{toolQuestions.map((question) => <Link href={`/questions/${question.slug}`} key={question.slug}><span>{question.toolLabel}</span><strong>{question.title} ↗</strong><p>{question.description}</p></Link>)}</div></section> : null}
      <section className="shell tool-product-cta"><div><p className="eyebrow">Several shipments to calculate?</p><h2>Use the $19 operations workbook for batch work.</h2><p>Compare quotes and keep landed cost, pallet plans, DIM checks, and margin calculations in one editable Excel file.</p></div><Link className="button button-primary" href="/resources#spreadsheet-pack">See the workbook ↗</Link></section>
      <section className="shell method-section">
        <div><p className="eyebrow">Method &amp; limits</p><h2>How this estimate works</h2></div>
        <div className="method-copy"><p>The result uses the formula below. Check the measurements, unit setting, and applicable carrier or supplier rule before using it.</p><div className="formula-box">{tool.formula}</div><p>{tool.assumption}</p>{topic ? <Link className="topic-inline-link" href={`/topics/${topic.slug}`}>Related {topic.shortTitle} guide ↗</Link> : null}{tool.sources?.length ? <div className="tool-sources"><strong>References</strong>{tool.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div> : null}<p className="fine-print">This calculator is a planning aid, not a carrier quotation, engineering assessment, or professional advice. Verify critical figures against current supplier and carrier documentation.</p></div>
      </section>
      {tool.workedExample ? <section className="shell evidence-grid" aria-label="Worked example and common mistakes">
        <article className="evidence-card example-card"><p className="eyebrow">Worked example</p><h2>{tool.workedExample.title}</h2><ol>{tool.workedExample.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="evidence-result"><strong>Result</strong>{tool.workedExample.result}</p></article>
        <article className="evidence-card mistake-card"><p className="eyebrow">Avoid these errors</p><h2>Common mistakes that change the answer</h2><ul>{tool.commonMistakes?.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul><p className="fine-print">A calculator can expose the arithmetic; the applicable carrier rate card, handling standard, or freight quotation still controls the real transaction.</p></article>
      </section> : null}
      {taxRecommendation ? <section className="shell network-inline"><div><span>Related tax calculation · TaxMathKit</span><h2>{taxRecommendation.title}</h2><p>{taxRecommendation.description}</p></div><a className="text-link" href={taxRecommendation.href}>{taxRecommendation.label} ↗</a></section> : null}
      {embeddable ? <EmbedPanel slug={tool.slug} title={tool.title} /> : null}
      {guides.length ? <section className="shell tool-guides"><p className="eyebrow">Examples and guides</p><div className="tool-guide-grid">{guides.map((guide)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.readTime}</span><strong>{guide.title} ↗</strong><p>{guide.description}</p></Link>)}</div></section> : null}
      {partner?.url ? <section className="shell partner-inline"><span>Relevant partner resource</span><div><h2>{partner.name}</h2><p>{partner.description}</p></div><a className="text-link" href={partner.url} target="_blank" rel="sponsored noopener noreferrer">View recommendation ↗</a></section> : null}
      <section className="shell next-tools"><p className="eyebrow">Next calculation</p><h2>Related tools</h2><div className="next-grid">{related.map((item)=><Link className="next-card" key={item.slug} href={`/tools/${item.slug}`}><span>{item.category}</span><strong>{item.shortTitle} ↗</strong></Link>)}</div></section>
      <SiteFooter />
    </main>
  );
}
