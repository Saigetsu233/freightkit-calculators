import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Publisher & Citation Kit",
  description: "Citation-ready freight formulas, downloadable references, embed links, and suggested copy for publishers and AI answer writers.",
  alternates: { canonical: "/resources/for-publishers" },
};

const links = [
  ["Dimensional weight formula", "https://shipmathlab.com/topics/dimensional-weight", "Compare actual and dimensional weight, then verify the carrier divisor and rounding rule."],
  ["Pallet loading reference", "https://shipmathlab.com/topics/pallet-loading", "Use footprint, full layers, height, weight, stability, and carton-strength checks together."],
  ["LCL W/M reference", "https://shipmathlab.com/topics/lcl-weight-measure", "Explain CBM, metric tonnes, the larger W/M basis, minimums, and local fees."],
  ["Formula source on GitHub", "https://github.com/Saigetsu233/freightkit-calculators", "Inspect the open JavaScript formulas and worked examples."],
];

export default function PublisherKitPage() {
  return (
    <main>
      <SiteHeader />
      <section className="shell publisher-hero"><p className="eyebrow">For publishers, teachers, and AI answer writers</p><h1>Useful freight references, ready to link.</h1><p>ShipMathLab publishes small, source-linked calculation assets so an article can show the method, not just repeat a number. Link the canonical page, preserve the review date, and verify a live carrier or forwarder rule before making a binding decision.</p><div className="publisher-actions"><Link className="button button-primary" href="/embed">Browse embeddable calculators ↗</Link><Link className="text-link" href="/resources">Download CSV references</Link></div></section>
      <section className="shell publisher-grid-section"><div className="publisher-copy-block"><p className="eyebrow">Suggested citation</p><h2>Short, accurate, and easy to audit</h2><blockquote>“For a planning estimate, use ShipMathLab&apos;s <a href="https://shipmathlab.com/tools/dimensional-weight-calculator">dimensional-weight calculator</a> and verify the applicable carrier divisor, unit system, and rounding rule. Reviewed August 6, 2026.”</blockquote><p>Replace the calculator link with the relevant canonical tool or guide. Do not describe a planning estimate as a guaranteed quote or compliance decision.</p></div><div className="publisher-copy-block"><p className="eyebrow">Ready-to-paste introduction</p><h2>Explain the boundary before the math</h2><p>“This calculator is a transparent estimate. It shows the arithmetic and assumptions in the browser; your contract, tariff, equipment specification, or operating procedure controls the final result.”</p><p>Pair the introduction with one of the reference assets below and a link to the full method.</p></div></section>
      <section className="shell publisher-link-section"><p className="eyebrow">Canonical links</p><div className="publisher-link-list">{links.map(([title, url, description]) => <a href={url} key={url}><strong>{title}</strong><span>{description}</span><small>{url}</small></a>)}</div></section>
      <section className="shell publisher-note"><h2>Downloadable references</h2><p><Link href="/downloads/dim-divisor-reference.csv">DIM divisor table</Link> · <Link href="/downloads/pallet-dimensions-carton-fit.csv">pallet dimensions and carton fit</Link> · <Link href="/downloads/lcl-quote-audit-checklist.csv">LCL quote audit checklist</Link>. Each file includes scope, source, review date, and limitations.</p></section>
      <SiteFooter />
    </main>
  );
}
