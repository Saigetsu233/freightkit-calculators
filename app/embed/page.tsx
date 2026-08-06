import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Free Freight Calculator Embeds",
  description: "Add a transparent dimensional-weight, pallet-loading, or LCL W/M calculator to a freight article or operations knowledge base.",
  alternates: { canonical: "/embed" },
};

const calculators = [
  {
    slug: "dimensional-weight-calculator",
    title: "Dimensional Weight Calculator",
    description: "Compare actual and dimensional weight with carrier planning divisors and chargeable-weight rounding.",
    height: 820,
  },
  {
    slug: "pallet-load-calculator",
    title: "Pallet Loading Calculator",
    description: "Estimate cartons per layer, layers, height, weight, and the constraint that limits the load.",
    height: 820,
  },
  {
    slug: "lcl-chargeable-volume-calculator",
    title: "LCL Chargeable Volume Calculator",
    description: "Compare CBM with metric tonnes, apply W/M minimums, and estimate variable and fixed charges.",
    height: 860,
  },
];

export default function EmbedDirectoryPage() {
  return (
    <main>
      <SiteHeader />
      <section className="shell publisher-hero">
        <p className="eyebrow">Free embeds for freight publishers</p>
        <h1>Put a working freight answer inside your article.</h1>
        <p>Each iframe is hosted by ShipMathLab, runs calculations in the reader&apos;s browser, and links back to the full formula, assumptions, and source notes. No API key or account is required.</p>
        <div className="publisher-actions"><Link className="button button-primary" href="/resources/for-publishers">Open the publisher kit ↗</Link><Link className="text-link" href="/resources">Download reference assets</Link></div>
      </section>
      <section className="shell embed-directory" aria-labelledby="embed-heading">
        <div className="section-heading"><div><p className="eyebrow">Paste-ready iframe sources</p><h2 id="embed-heading">Choose the calculation your readers need</h2></div><p>Keep the title attribute and the attribution link when you publish. The calculators stay free and are updated when the method or source review changes.</p></div>
        <div className="embed-directory-grid">
          {calculators.map((calculator) => {
            const url = `https://shipmathlab.com/embed/${calculator.slug}`;
            const code = `<iframe src="${url}" title="${calculator.title}" width="100%" height="${calculator.height}" loading="lazy" style="border:0"></iframe>`;
            return <article className="embed-directory-card" key={calculator.slug}><span className="eyebrow">{calculator.slug.replaceAll("-", " ")}</span><h3>{calculator.title}</h3><p>{calculator.description}</p><pre><code>{code}</code></pre><div className="embed-directory-actions"><Link className="button button-primary" href={`/embed/${calculator.slug}`}>Preview embed ↗</Link><a className="text-link" href={url}>Open direct URL</a></div></article>;
          })}
        </div>
      </section>
      <section className="shell publisher-note"><h2>Attribution that keeps the result honest</h2><p>Use wording such as: “Calculation powered by <a href="https://shipmathlab.com">ShipMathLab</a>; see the <a href="https://shipmathlab.com/methodology">formula and source method</a>.” The result is a planning estimate, not a carrier quote, engineering approval, or tariff decision.</p></section>
      <SiteFooter />
    </main>
  );
}
